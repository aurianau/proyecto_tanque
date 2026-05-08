"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Plus, 
  Search, 
  RefreshCw,
  Signal,
  WifiOff,
  Battery,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDevices, useCommunities } from "@/hooks/useApi";
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

export default function DevicesPage() {
  const { devices, isLoading, isError, mutate } = useDevices();
  const { communities } = useCommunities();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    mac_address: "",
    community_id: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/devices/microcontrollers/', formData);
      mutate();
      setIsDialogOpen(false);
      setFormData({ name: "", mac_address: "", community_id: "" });
    } catch (err) {
      console.error("Error creating device", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/devices/microcontrollers/${selectedDevice.id}/`, {
        name: formData.name,
        mac_address: formData.mac_address,
        community: Number(formData.community_id)
      });
      mutate();
      setIsEditOpen(false);
      setSelectedDevice(null);
      setFormData({ name: "", mac_address: "", community_id: "" });
    } catch (err) {
      console.error("Error updating device", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (device: any) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      mac_address: device.mac_address,
      community_id: device.community?.toString() || ""
    });
    setIsEditOpen(true);
  };

  const filteredDevices = devices?.filter((d: any) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.mac_address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Dispositivos IoT</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Gestiona tus microcontroladores ESP32 y sensores de campo.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="h-11 px-4 rounded-xl border border-white/5 hover:bg-white/5 gap-2" onClick={() => mutate()}>
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-cyan-500/20">
                <Plus className="w-5 h-5" />
                Vincular ESP32
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/10 sm:max-w-[425px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Vincular Microcontrolador</DialogTitle>
                  <DialogDescription>
                    Registra la MAC del ESP32 para emparejarlo con el sistema central.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre / Alias</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ej: ESP32 Tanque 1" 
                      className="bg-white/5 border-white/10" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mac">Dirección MAC</Label>
                    <Input 
                      id="mac" 
                      value={formData.mac_address}
                      onChange={e => setFormData({...formData, mac_address: e.target.value})}
                      placeholder="AA:BB:CC:DD:EE:FF" 
                      className="bg-white/5 border-white/10 font-mono" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Comunidad Asignada</Label>
                    <Select value={formData.community_id} onValueChange={(val) => setFormData({...formData, community_id: val})}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Selecciona una comunidad" />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        {communities?.map((c: any) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting || !formData.community_id}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Registrar Dispositivo
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-black/20 p-2 rounded-2xl glass border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por MAC o nombre..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 text-lg h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass border-none rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[250px] font-bold">Dispositivo</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold">Comunidad</TableHead>
              <TableHead className="font-bold text-center">Batería</TableHead>
              <TableHead className="font-bold text-center">Señal</TableHead>
              <TableHead className="font-bold">Visto por última vez</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredDevices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No hay dispositivos registrados.
                </TableCell>
              </TableRow>
            )}
            {filteredDevices.map((device: any) => (
              <TableRow key={device.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-foreground">{device.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{device.mac_address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {device.is_online ? (
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    ) : (
                      <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                    <span className={device.is_online ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                      {device.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {communities?.find((c: any) => c.id === device.community)?.name || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Battery className={`w-4 h-4 ${(device.battery_level || 0) < 20 ? "text-red-400 animate-pulse" : "text-muted-foreground"}`} />
                    <span className={(device.battery_level || 0) < 20 ? "text-red-400 font-bold" : "text-foreground"}>
                      {device.battery_level || 100}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                   <div className="flex items-center justify-center gap-1">
                      {device.is_online ? (
                        <>
                          <Signal className="w-4 h-4 text-primary" />
                          <span className="text-xs">-45 dBm</span>
                        </>
                      ) : (
                        <WifiOff className="w-4 h-4 text-muted-foreground" />
                      )}
                   </div>
                </TableCell>
                <TableCell className="text-muted-foreground italic text-sm">
                  {device.last_seen ? new Date(device.last_seen).toLocaleString() : "Nunca"}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-primary/20 hover:text-primary"
                    onClick={() => openEdit(device)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-red-500/20 hover:text-red-400 ml-2 text-muted-foreground"
                    onClick={async () => {
                      if(confirm("Eliminar dispositivo?")) {
                        await api.delete(`/devices/microcontrollers/${device.id}/`);
                        mutate();
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[425px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Editar Microcontrolador</DialogTitle>
              <DialogDescription>
                Modifica los detalles de conexión del dispositivo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre / Alias</Label>
                <Input 
                  id="edit-name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border-white/10" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mac">Dirección MAC</Label>
                <Input 
                  id="edit-mac" 
                  value={formData.mac_address}
                  onChange={e => setFormData({...formData, mac_address: e.target.value})}
                  className="bg-white/5 border-white/10 font-mono" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Comunidad Asignada</Label>
                <Select value={formData.community_id} onValueChange={(val) => setFormData({...formData, community_id: val})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecciona una comunidad" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    {communities?.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
