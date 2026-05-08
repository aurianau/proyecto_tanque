"use client";

import React from "react";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  Filter,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAlerts } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

export default function AlertsPage() {
  const { alerts, isLoading, isError } = useAlerts();

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Centro de Alertas</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Mantente al tanto de cualquier anomalía en el sistema.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="h-11 px-4 rounded-xl border border-white/5 hover:bg-white/5 gap-2">
            <History className="w-5 h-5" />
            Historial
          </Button>
          <Button variant="ghost" className="h-11 px-4 rounded-xl border border-white/5 hover:bg-white/5 gap-2">
            <Filter className="w-5 h-5" />
            Filtrar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        {isError && <div className="text-center text-red-400 p-10">Error al cargar alertas.</div>}
        
        {alerts?.map((alert: any) => {
          let icon = Info;
          let color = "text-blue-400";
          let bg = "bg-blue-400/10";
          let border = "border-blue-400/20";
          
          if (alert.severity === "CRITICAL") {
            icon = AlertTriangle;
            color = "text-red-400";
            bg = "bg-red-400/10";
            border = "border-red-400/20";
          } else if (alert.severity === "WARNING") {
            icon = AlertTriangle;
            color = "text-amber-400";
            bg = "bg-amber-400/10";
            border = "border-amber-400/20";
          }

          const AlertIcon = icon;

          return (
            <Card key={alert.id} className={`glass border-none hover:bg-white/5 transition-all duration-300 group overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`${bg} p-3 rounded-xl ${color} border ${border}`}>
                    <AlertIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{alert.title}</h3>
                      <span className="text-sm text-muted-foreground">{new Date(alert.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-muted-foreground">{alert.message}</p>
                    <div className="flex items-center gap-3 pt-3">
                      <Badge variant="outline" className={`text-xs ${bg} ${color} ${border}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 rounded-lg">Resolver</Button>
                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">Silenciar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isLoading && alerts?.length === 0 && (
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No hay más alertas pendientes.
          </div>
        </div>
      )}
    </div>
  );
}
