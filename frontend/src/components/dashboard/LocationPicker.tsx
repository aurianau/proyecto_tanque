"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const defaultPos: [number, number] = [11.5444, -72.9069]; // Riohacha, La Guajira

export function LocationPicker({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  const [addressSearch, setAddressSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reliable Marker Icon (Leaflet base64 or absolute CDN)
  const markerIcon = L ? L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }) : null;

  useEffect(() => {
    setMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || !L || !mapContainerRef.current || mapRef.current) return;

    const initialPos = initialLat && initialLng ? [initialLat, initialLng] : defaultPos;

    mapRef.current = L.map(mapContainerRef.current, {
      center: initialPos,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    markerRef.current = L.marker(initialPos, {
      draggable: true,
      icon: markerIcon,
    }).addTo(mapRef.current);

    markerRef.current.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      onLocationSelect(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });

    mapRef.current.on('click', (e: any) => {
      const pos = e.latlng;
      markerRef.current.setLatLng(pos);
      onLocationSelect(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });

  }, [mounted, L]);

  const handleSearch = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      // Adding a bias to Colombia and a proper User-Agent as per Nominatim policy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=co`,
        {
          headers: {
            'User-Agent': 'HydroSmartPro-App'
          }
        }
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSuggestion = (suggestion: any) => {
    if (!L || !mapRef.current) return;
    const newPos: [number, number] = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    mapRef.current.setView(newPos, 16);
    markerRef.current.setLatLng(newPos);
    onLocationSelect(Number(newPos[0].toFixed(6)), Number(newPos[1].toFixed(6)));
    setAddressSearch(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar dirección (ej: Calle 14, Riohacha)" 
              className="pl-9 bg-white/5 border-white/10"
              value={addressSearch}
              onChange={(e) => {
                setAddressSearch(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[500] w-full mt-1 glass border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-primary/20 transition-colors border-b border-white/5 last:border-0 flex items-start gap-3"
                onClick={() => selectSuggestion(s)}
              >
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="truncate">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative h-64 rounded-xl overflow-hidden border border-white/10 shadow-inner">
        {!mounted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute top-2 left-2 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-white/90 font-medium uppercase tracking-wider">Mueve el marcador o haz clic en el mapa</span>
        </div>
      </div>
    </div>
  );
}
