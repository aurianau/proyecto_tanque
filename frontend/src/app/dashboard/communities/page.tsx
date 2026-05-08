"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  MapPin, 
  Droplets,
  ArrowUpRight,
  Edit,
  Trash2,
  Map
} from "lucide-react";
import { LocationPicker } from "@/components/dashboard/LocationPicker";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCommunities } from "@/hooks/useApi";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { communities, isLoading, isError, mutate } = useCommunities();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    latitude: 11.5444,
    longitude: -72.9069
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/communities/communities/', formData);
      mutate();
      setIsDialogOpen(false);
      setFormData({ name: "", latitude: 11.5444, longitude: -72.9069 });
    } catch (err) {
      console.error("Error creating community", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/communities/communities/${selectedCommunity.id}/`, formData);
      mutate();
      setIsEditOpen(false);
      setSelectedCommunity(null);
      setFormData({ name: "", latitude: 11.5444, longitude: -72.9069 });
    } catch (err) {
      console.error("Error updating community", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (community: any) => {
    setSelectedCommunity(community);
    setFormData({
      name: community.name,
      latitude: Number(community.latitude),
      longitude: Number(community.longitude)
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta comunidad? Se eliminarán también sus hogares y tanques asociados.")) {
      try {
        await api.delete(`/communities/communities/${id}/`);
        mutate();
      } catch (err) {
        console.error("Error deleting community", err);
      }
    }
  };

  const filteredCommunities = communities?.filter((c: any) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Comunidades</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Gestiona las urbanizaciones y comunidades registradas.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-cyan-500/20">
              <Plus className="w-5 h-5" />
              Nueva Comunidad
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-white/10 sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Añadir Comunidad</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles para registrar una nueva comunidad en el sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Ranchería El Sol" 
                    className="bg-white/5 border-white/10" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Ubicación en el Mapa</Label>
                  <LocationPicker 
                    onLocationSelect={(lat, lng) => setFormData({...formData, latitude: lat, longitude: lng})}
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                  />
                  <div className="flex gap-4 mt-1">
                    <div className="flex-1">
                      <Label className="text-[10px] text-muted-foreground uppercase">Latitud</Label>
                      <div className="text-xs font-mono bg-white/5 p-2 rounded border border-white/10">{formData.latitude.toFixed(6)}</div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-[10px] text-muted-foreground uppercase">Longitud</Label>
                      <div className="text-xs font-mono bg-white/5 p-2 rounded border border-white/10">{formData.longitude.toFixed(6)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Guardar Comunidad
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="glass border-white/10 sm:max-w-[425px]">
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Editar Comunidad</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la comunidad seleccionada.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Ranchería El Sol" 
                    className="bg-white/5 border-white/10" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Ubicación en el Mapa</Label>
                  <LocationPicker 
                    onLocationSelect={(lat, lng) => setFormData({...formData, latitude: lat, longitude: lng})}
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Actualizar Comunidad
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-black/20 p-2 rounded-2xl glass border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o ubicación..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 text-lg h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <div className="col-span-full flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        {isError && <div className="col-span-full text-center text-red-400 p-10">Error al cargar comunidades.</div>}
        {!isLoading && !isError && filteredCommunities.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground p-10 glass rounded-xl">No hay comunidades registradas.</div>
        )}
        
        {filteredCommunities.map((community: any) => (
          <Card key={community.id} className="glass border-none card-premium overflow-hidden group relative">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass border-white/10">
                    <DropdownMenuItem 
                      className="gap-2 focus:bg-white/10 cursor-pointer"
                      onClick={() => openEdit(community)}
                    >
                      <Edit className="w-4 h-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="gap-2 focus:bg-red-500/20 text-red-400 cursor-pointer"
                      onClick={() => handleDelete(community.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl font-bold">{community.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1 font-mono text-[10px]">
                <MapPin className="w-3 h-3 text-primary" />
                {Number(community.latitude).toFixed(4)}, {Number(community.longitude).toFixed(4)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold">Viviendas</span>
                  <span className="text-lg font-bold">{community.households?.length || 0}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold">Tanques</span>
                  <span className="text-lg font-bold text-primary">{community.tanks?.length || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
                  Activa
                </Badge>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1 rounded-lg">
                  Ver Detalles
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
