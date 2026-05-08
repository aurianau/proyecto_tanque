"use client";

import React from "react";
import { InteractiveMap } from "@/components/dashboard/InteractiveMap";
import { useCommunities } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

export default function MapPage() {
  const { communities, isLoading } = useCommunities();

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex flex-col gap-6 page-enter">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
          <h1 className="text-4xl font-black tracking-tight text-white">Mapa Geográfico</h1>
        </div>
        <p className="text-white/35 ml-5 font-medium">Visualiza la ubicación y el estado de todas las comunidades en tiempo real.</p>
      </div>

      <div className="flex-1 rounded-3xl overflow-hidden glass border-none shadow-2xl relative glow-teal">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          </div>
        ) : null}
        <InteractiveMap communities={communities} className="h-full w-full" />
      </div>
    </div>
  );
}
