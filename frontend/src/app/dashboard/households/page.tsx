"use client";

import React, { useState } from "react";
import { 
  Home, 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2,
  Loader2,
  Droplet
} from "lucide-react";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useHouseholds, useCommunities } from "@/hooks/useApi";
import api from "@/lib/api";

export default function HouseholdsPage() {
  const { households, isLoading, mutate } = useHouseholds();
  const { communities } = useCommunities();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    community: "",
    address: "",
    members_count: 4
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/communities/households/', formData);
      mutate();
      setIsDialogOpen(false);
      setFormData({ name: "", community: "", address: "", members_count: 4 });
    } catch (err) {
      console.error("Error creating household", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHousehold) return;
    setIsSubmitting(true);
    try {
      await api.put(`/communities/households/${selectedHousehold.id}/`, formData);
      mutate();
      setIsEditOpen(false);
      setSelectedHousehold(null);
      setFormData({ name: "", community: "", address: "", members_count: 4 });
    } catch (err) {
      console.error("Error updating household", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (household: any) => {
    setSelectedHousehold(household);
    setFormData({
      name: household.name,
      community: household.community.toString(),
      address: household.address,
      members_count: household.members_count
    });
    setIsEditOpen(true);
  };

  const filteredHouseholds = households?.filter((h: any) => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.address?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Gestión de Viviendas</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Administra los hogares registrados en cada comunidad.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-cyan-500/20">
              <Plus className="w-5 h-5" />
              Nueva Vivienda
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-white/10 sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Registrar Hogar</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles de la vivienda para el monitoreo de consumo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre / Identificador</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Familia González" 
                    className="bg-white/5 border-white/10" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Comunidad</Label>
                  <Select value={formData.community} onValueChange={v => setFormData({...formData, community: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Seleccionar Comunidad" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {communities?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección / Referencia</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Ej: Sector Norte, Casa 4" 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="residents">Nro. de Residentes</Label>
                  <Input 
                    id="residents" 
                    type="number"
                    value={formData.members_count}
                    onChange={e => setFormData({...formData, members_count: parseInt(e.target.value) || 1})}
                    className="bg-white/5 border-white/10" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || !formData.community}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Registrar Vivienda
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
                <DialogTitle>Editar Vivienda</DialogTitle>
                <DialogDescription>
                  Modifica los datos del hogar seleccionado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre / Identificador</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Familia González" 
                    className="bg-white/5 border-white/10" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Comunidad</Label>
                  <Select value={formData.community} onValueChange={v => setFormData({...formData, community: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Seleccionar Comunidad" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {communities?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Dirección / Referencia</Label>
                  <Input 
                    id="edit-address" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Ej: Sector Norte, Casa 4" 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-residents">Nro. de Residentes</Label>
                  <Input 
                    id="edit-residents" 
                    type="number"
                    value={formData.members_count}
                    onChange={e => setFormData({...formData, members_count: parseInt(e.target.value) || 1})}
                    className="bg-white/5 border-white/10" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || !formData.community}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Actualizar Vivienda
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
            placeholder="Buscar por familia o dirección..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 text-lg h-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <div className="col-span-full flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        
        {filteredHouseholds.map((h: any) => (
          <Card key={h.id} className="glass border-none hover:translate-y-[-4px] transition-all group overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass border-white/10">
                    <DropdownMenuItem 
                      className="gap-2 cursor-pointer"
                      onClick={() => openEdit(h)}
                    >
                      <Edit className="w-4 h-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="gap-2 text-red-400 focus:bg-red-500/20 cursor-pointer"
                      onSelect={async (e) => {
                        e.preventDefault(); // Prevent closing before confirm
                        if(confirm("¿Eliminar vivienda?")) {
                          try {
                            await api.delete(`/communities/households/${h.id}/`);
                            mutate();
                          } catch (err) {
                            console.error("Error deleting household", err);
                            alert("No se pudo eliminar la vivienda. Verifica los permisos.");
                          }
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl font-bold">{h.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {h.address || "Sin dirección registrada"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Residentes:
                  </div>
                  <span className="font-bold">{h.members_count}</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 gap-1 px-3">
                     <Droplet className="w-3 h-3" />
                     Consumo Normal
                   </Badge>
                   <span className="text-xs text-muted-foreground">ID: {h.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
