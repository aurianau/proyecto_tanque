"use client";

import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  Calendar, 
  Filter, 
  Download, 
  TrendingUp, 
  Droplets, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTanks } from "@/hooks/useApi";
import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function AnalyticsPage() {
  const { tanks, isLoading: isLoadingTanks } = useTanks();
  const [selectedTank, setSelectedTank] = useState<string>("all");
  
  // Fetch telemetry history (limited for now)
  const { data: readings, isLoading: isLoadingReadings } = useSWR(
    selectedTank !== "all" ? `/telemetry/readings/?tank=${selectedTank}` : "/telemetry/readings/",
    fetcher
  );

  // Transform data for charts
  const chartData = useMemo(() => {
    if (!readings || !Array.isArray(readings)) return [];
    
    // Sort and limit to last 24 entries or aggregate as needed
    return [...readings].reverse().slice(-20).map((r: any) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: r.level_pct,
      liters: r.volume_liters
    }));
  }, [readings]);

  if (isLoadingTanks) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Analítica Avanzada</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Visualiza el historial de consumo y niveles de agua.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedTank} onValueChange={setSelectedTank}>
            <SelectTrigger className="w-[250px] glass border-white/10">
              <SelectValue placeholder="Seleccionar Tanque" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              <SelectItem value="all">Todos los Tanques</SelectItem>
              {tanks?.map((t: any) => (
                <SelectItem key={t.id} value={t.id.toString()}>{t.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" className="glass border-white/10 gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Consumo Total 24h", value: "4.5k L", trend: "+12%", up: true, icon: TrendingUp },
          { title: "Nivel Promedio", value: "72%", trend: "-5%", up: false, icon: Droplets },
          { title: "Eficiencia de Red", value: "98.2%", trend: "+0.5%", up: true, icon: Activity },
          { title: "Alertas Activas", value: "0", trend: "-100%", up: false, icon: Filter },
        ].map((kpi, i) => (
          <Card key={i} className="glass border-none hover:translate-y-[-4px] transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{kpi.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Level Trend Chart */}
        <Card className="glass border-none lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>Historial de Niveles (%)</CardTitle>
            <CardDescription>Fluctuación del nivel de agua en tiempo real.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[400px]">
            {isLoadingReadings ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#0ea5e9' }}
                  />
                  <Area type="monotone" dataKey="level" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorLevel)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Volume Bar Chart */}
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Volumen Estimado (Litros)</CardTitle>
            <CardDescription>Capacidad ocupada en las últimas lecturas.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="liters" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Consumption Table/Line */}
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Rendimiento del Sistema</CardTitle>
            <CardDescription>Consumo proyectado vs real.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="level" stroke="#10b981" strokeWidth={2} dot={false} name="Eficiencia %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
