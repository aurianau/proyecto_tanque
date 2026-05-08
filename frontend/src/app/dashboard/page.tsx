"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Droplets, 
  AlertTriangle, 
  Activity, 
  Cpu,
  TrendingUp,
  Waves,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TankVisualization } from "@/components/dashboard/TankVisualization";
import { InteractiveMap } from "@/components/dashboard/InteractiveMap";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCommunities, useTanks, useAlerts, useHouseholds } from "@/hooks/useApi";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";



type WebSocketMessage = {
  type: string;
  message: any;
};

export default function DashboardPage() {
  const { communities, isLoading: isLoadingComs } = useCommunities();
  const { tanks, isLoading: isLoadingTanks } = useTanks();
  const { alerts, isLoading: isLoadingAlerts } = useAlerts();
  const { households } = useHouseholds();

  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  const [tankStates, setTankStates] = useState<Record<string, any>>({});
  const [isWsConnected, setIsWsConnected] = useState(false);

  const WS_URL = "ws://127.0.0.1:8000/ws/telemetry/global/";
  
  const handleWebSocketMessage = useCallback((msg: WebSocketMessage) => {
    if (msg.type === "telemetry_update" && msg.message?.data?.tanks) {
      const updates: Record<string, any> = {};
      msg.message.data.tanks.forEach((t: any) => {
        updates[t.id] = t;
      });
      setTankStates(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const { isConnected, sendMessage } = useWebSocket({
    url: WS_URL,
    onMessage: handleWebSocketMessage
  });

  useEffect(() => {
    setIsWsConnected(isConnected);
  }, [isConnected]);

  // Sync initial tank levels from API
  useEffect(() => {
    if (tanks && Object.keys(tankStates).length === 0) {
      const initial: Record<string, any> = {};
      tanks.forEach((t: any) => {
        initial[t.id] = {
          level_pct: t.current_level_pct || 0,
          volume_liters: (t.current_level_pct / 100) * t.capacity_liters
        };
      });
      setTankStates(initial);
    }
  }, [tanks]);

  if (isLoadingComs || isLoadingTanks || isLoadingAlerts) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <div className="relative">
          <Loader2 className="w-14 h-14 animate-spin text-cyan-500" />
          <div className="absolute inset-0 w-14 h-14 rounded-full bg-cyan-500/20 blur-xl" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white/60 font-semibold text-lg">Sincronizando</p>
          <p className="text-white/25 text-sm">Cargando datos en tiempo real...</p>
        </div>
      </div>
    );
  }

  // Filter tanks based on selected community
  const filteredTanks = tanks?.filter((t: any) => {
    if (selectedCommunity === "all") return true;
    
    // Find household of this tank
    const household = households?.find((h: any) => h.id === t.household);
    return household?.community === parseInt(selectedCommunity);
  }) || [];

  // Calculate dynamic KPIs
  const totalStored = filteredTanks.reduce((sum: number, t: any) => {
    const state = tankStates[t.id];
    return sum + (state?.volume_liters || 0);
  }, 0);

  const avgLevel = filteredTanks.length > 0 
    ? filteredTanks.reduce((sum: number, t: any) => sum + (tankStates[t.id]?.level_pct || 0), 0) / filteredTanks.length 
    : 0;

  const activeAlerts = alerts?.filter((a: any) => a.is_resolved === false).length || 0;

  const kpis = [
    { 
      title: "Agua Almacenada", 
      value: `${Math.round(totalStored).toLocaleString()} L`, 
      desc: `${Math.round(avgLevel)}% de cap. promedio`, 
      icon: Droplets, 
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      glow: "shadow-cyan-500/20",
      gradient: "from-cyan-500/20 to-blue-500/10"
    },
    { 
      title: "Alertas Activas", 
      value: activeAlerts.toString(), 
      desc: "Requieren atención inmediata", 
      icon: AlertTriangle, 
      color: activeAlerts > 0 ? "text-amber-400" : "text-emerald-400",
      bg: activeAlerts > 0 ? "bg-amber-400/10" : "bg-emerald-400/10",
      glow: activeAlerts > 0 ? "shadow-amber-500/20" : "shadow-emerald-500/20",
      gradient: activeAlerts > 0 ? "from-amber-500/20 to-orange-500/10" : "from-emerald-500/20 to-green-500/10"
    },
    { 
      title: "Tanques Monitoreados", 
      value: filteredTanks.length.toString(), 
      desc: `De ${tanks?.length || 0} totales`, 
      icon: Activity, 
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-500/20 to-teal-500/10"
    },
    { 
      title: "Estado de Red", 
      value: isWsConnected ? "En Vivo" : "Desconectado", 
      desc: isWsConnected ? "Sincronización activa" : "Reconectando...", 
      icon: Zap, 
      color: isWsConnected ? "text-cyan-400" : "text-red-400",
      bg: isWsConnected ? "bg-cyan-400/10" : "bg-red-400/10",
      glow: isWsConnected ? "shadow-cyan-500/20" : "shadow-red-500/20",
      gradient: isWsConnected ? "from-cyan-500/20 to-teal-500/10" : "from-red-500/20 to-rose-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Panel de Control</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">
            Bienvenido. Monitorea el estado del agua en todas tus comunidades.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
            <SelectTrigger className="w-[220px] glass-strong border-white/[0.06] shadow-xl rounded-xl h-11">
              <SelectValue placeholder="Todas las Comunidades" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/[0.06]">
              <SelectItem value="all">Todas las Comunidades</SelectItem>
              {communities?.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3 glass-strong px-4 py-2.5 rounded-xl border border-white/[0.04]">
            <span className={`relative flex h-3 w-3`}>
              {isWsConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isWsConnected ? 'bg-cyan-500 shadow-[0_0_8px_rgba(0,188,212,0.6)]' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-sm font-semibold text-white/70">
              {isWsConnected ? 'En Vivo' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`glass border-none card-premium overflow-hidden relative group`}>
              {/* Top gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${kpi.gradient}`} />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 shimmer-wave opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-xs font-bold text-white/30 uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div className={`${kpi.bg} p-2.5 rounded-xl ${kpi.glow} shadow-lg`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black tracking-tight text-white">{kpi.value}</div>
                <p className="text-xs text-white/25 mt-1.5 font-medium">
                  {kpi.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Map & Tanks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px]">
          <InteractiveMap communities={selectedCommunity === "all" ? communities : communities?.filter((c: any) => c.id.toString() === selectedCommunity)} className="h-full w-full" />
        </div>
        
        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredTanks.length > 0 ? (
            filteredTanks.map((t: any) => {
              const state = tankStates[t.id] || { level_pct: 0, volume_liters: 0 };
              return (
                <TankVisualization 
                  key={t.id}
                  levelPct={state.level_pct} 
                  capacityLiters={t.capacity_liters} 
                  currentLiters={state.volume_liters} 
                  status={t.status} 
                  title={t.name}
                  className="w-full"
                />
              );
            })
          ) : (
            <Card className="glass border-none h-full flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/5 flex items-center justify-center mb-4">
                <Droplets className="w-8 h-8 text-white/10" />
              </div>
              <p className="text-white/25 font-medium">No hay tanques vinculados a esta selección.</p>
            </Card>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 188, 212, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 188, 212, 0.25);
        }
      `}</style>
    </div>
  );
}
