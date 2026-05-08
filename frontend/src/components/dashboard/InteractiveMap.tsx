"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type CommunityMarker = {
  id: string;
  name: string;
  position: [number, number];
  status: "OK" | "WARNING" | "CRITICAL";
  activeTanks: number;
  totalTanks: number;
  lastUpdate: string;
};

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Helper to recenter map
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = (require("react-leaflet") as any).useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Mock data for communities
const mockCommunities: CommunityMarker[] = [
  {
    id: "1",
    name: "Ranchería La Sabana",
    position: [11.534, -72.908], // Example coords in La Guajira
    status: "OK",
    activeTanks: 4,
    totalTanks: 4,
    lastUpdate: "Hace 5 minutos",
  },
  {
    id: "2",
    name: "Comunidad El Cardón",
    position: [11.6, -72.85],
    status: "WARNING",
    activeTanks: 2,
    totalTanks: 3,
    lastUpdate: "Hace 12 minutos",
  },
  {
    id: "3",
    name: "Ranchería Uribia",
    position: [11.7, -72.26],
    status: "CRITICAL",
    activeTanks: 1,
    totalTanks: 5,
    lastUpdate: "Hace 2 horas",
  },
];

export function InteractiveMap({ 
  communities = [], 
  className 
}: { 
  communities?: any[], 
  className?: string 
}) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  // Load Leaflet only on client
  useEffect(() => {
    setMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!mounted || !L) {
    return (
      <Card className={cn("glass border-none flex items-center justify-center relative overflow-hidden", className)}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 blur-3xl rounded-full"></div>
         <p className="text-muted-foreground z-10 animate-pulse">Cargando mapa interactivo...</p>
      </Card>
    );
  }

  // Create custom icons based on status
  const createCustomIcon = (status: string) => {
    let html = "";
    let colorClass = "";

    switch (status) {
      case "CRITICAL":
        colorClass = "bg-red-500 shadow-red-500/50";
        break;
      case "WARNING":
        colorClass = "bg-amber-500 shadow-amber-500/50";
        break;
      default:
        colorClass = "bg-emerald-500 shadow-emerald-500/50";
        break;
    }

    html = `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute inset-0 rounded-full animate-ping opacity-75 ${colorClass}"></div>
        <div class="relative w-4 h-4 rounded-full border-2 border-white shadow-lg ${colorClass}"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CRITICAL": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "WARNING": return <Info className="w-4 h-4 text-amber-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const center: [number, number] = communities.length === 1 
    ? [Number(communities[0].latitude), Number(communities[0].longitude)]
    : [11.6, -72.6];
  
  const zoom = communities.length === 1 ? 14 : 9;

  return (
    <Card className={cn("glass border-none overflow-hidden flex flex-col", className)}>
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
        <h3 className="font-semibold text-foreground/90">Mapa de Comunidades</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Óptimo</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Advertencia</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Crítico</div>
        </div>
      </div>
      
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: "100%", width: "100%", background: "transparent" }}
          zoomControl={false}
        >
          {mounted && <ChangeView center={center} zoom={zoom} />}
          {/* Using a dark themed map tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {communities.map((community: any) => {
            const lat = Number(community.latitude);
            const lng = Number(community.longitude);
            
            // Skip invalid coordinates
            if (isNaN(lat) || isNaN(lng)) return null;

            // Determine status based on tank health or mock for now
            // In a real scenario, this would come from the backend or a calculation
            const status = community.status || "OK";

            return (
              <Marker 
                key={community.id} 
                position={[lat, lng]}
                icon={createCustomIcon(status)}
              >
                <Popup className="premium-popup">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                      {getStatusIcon(status)}
                      <h4 className="font-bold text-sm text-foreground">{community.name}</h4>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Ubicación:</span>
                        <span className="text-foreground">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estado:</span>
                        <span className={cn("font-medium uppercase", 
                          status === "CRITICAL" ? "text-red-400" : 
                          status === "WARNING" ? "text-amber-400" : "text-emerald-400"
                        )}>
                          {status === "OK" ? "Óptimo" : status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Población:</span>
                        <span className="text-foreground">{community.population || "N/A"} hab.</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <style jsx global>{`
        /* Overriding Leaflet styles to match our premium dark theme */
        .leaflet-container {
          font-family: var(--font-geist-sans);
          background: transparent !important;
        }
        
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: rgba(20, 20, 25, 0.85) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }
        
        .leaflet-popup-content {
          margin: 12px;
        }
        
        .custom-leaflet-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </Card>
  );
}
