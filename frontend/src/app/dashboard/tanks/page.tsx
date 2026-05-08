"use client";

import React, { useState } from "react";
import { 
  Droplets, 
  Plus, 
  Search, 
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TankVisualization } from "@/components/dashboard/TankVisualization";
import { useTanks, useDevices } from "@/hooks/useApi";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TanksPage() {
  const { tanks, isLoading, isError, mutate } = useTanks();
  const { devices } = useDevices();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    capacity_liters: 1000,
    microcontroller: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/devices/tanks/', formData);
      mutate();
      setIsDialogOpen(false);
      setFormData({ name: "", capacity_liters: 1000, microcontroller: "" });
    } catch (err) {
      console.error("Error creating tank", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTanks = tanks?.filter((t: any) => 
    (t.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Tanques de Reserva</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Monitorea los niveles de agua de todos los depósitos en tiempo real.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-cyan-500/20">
              <Plus className="w-5 h-5" />
              Nuevo Tanque
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-white/10 sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Añadir Tanque</DialogTitle>
                <DialogDescription>
                  Registra un nuevo tanque y asígnalo a un microcontrolador ESP32.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del Tanque</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Tanque Principal" 
                    className="bg-white/5 border-white/10" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacidad (Litros)</Label>
                  <Input 
                    id="capacity" 
                    type="number"
                    value={formData.capacity_liters}
                    onChange={e => setFormData({...formData, capacity_liters: parseInt(e.target.value) || 0})}
                    className="bg-white/5 border-white/10" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Microcontrolador ESP32</Label>
                  <Select value={formData.microcontroller} onValueChange={(val) => setFormData({...formData, microcontroller: val})}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Selecciona un dispositivo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {devices?.map((d: any) => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.mac_address})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || !formData.microcontroller}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Registrar Tanque
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
            placeholder="Buscar por nombre de tanque..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 text-lg h-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="h-12 w-12 p-0 rounded-xl hover:bg-white/5">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && <div className="col-span-full flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        {isError && <div className="col-span-full text-center text-red-400 p-10">Error al cargar tanques.</div>}
        {!isLoading && !isError && filteredTanks.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground p-10 glass rounded-xl">No hay tanques registrados.</div>
        )}
        
        {filteredTanks.map((tank: any) => {
          let status = "NORMAL";
          if (tank.current_level_pct > 95) status = "OVERFLOW";
          else if (tank.current_level_pct < 10) status = "CRITICAL";
          else if (tank.current_level_pct < 25) status = "WARNING";

          return (
            <div key={tank.id} className="relative group">
              <TankVisualization
                title={tank.name}
                levelPct={tank.current_level_pct}
                capacityLiters={tank.capacity_liters}
                currentLiters={(tank.current_level_pct / 100) * tank.capacity_liters}
                status={status as any}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-8 shadow-lg"
                  onClick={async () => {
                    if (confirm("¿Eliminar tanque permanentemente?")) {
                      await api.delete(`/devices/tanks/${tank.id}/`);
                      mutate();
                    }
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
