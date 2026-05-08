"use client";

import React, { useEffect, useState, useId } from "react";
import { motion } from "framer-motion";
import { Droplets, AlertTriangle, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface TankVisualizationProps {
  levelPct: number;
  capacityLiters: number;
  currentLiters: number;
  status: "NORMAL" | "WARNING" | "CRITICAL" | "OVERFLOW";
  title?: string;
  className?: string;
}

export function TankVisualization({
  levelPct,
  capacityLiters,
  currentLiters,
  status,
  title = "Tanque Principal",
  className,
}: TankVisualizationProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const uniqueId = useId().replace(/:/g, "");

  // Smoothly animate to the target level
  useEffect(() => {
    setAnimatedLevel(levelPct);
  }, [levelPct]);

  const getColors = () => {
    switch (status) {
      case "CRITICAL":
        return {
          glow: "shadow-red-500/40",
          text: "text-red-400",
          border: "border-red-500/20",
          stop1: "rgba(239, 68, 68, 0.85)",
          stop2: "rgba(185, 28, 28, 0.65)",
          surface: "rgba(248, 113, 113, 0.85)",
          accent: "rgba(239, 68, 68, 0.15)",
          badge: "bg-red-500/15 text-red-400 border-red-500/20",
        };
      case "WARNING":
        return {
          glow: "shadow-amber-500/40",
          text: "text-amber-400",
          border: "border-amber-500/20",
          stop1: "rgba(245, 158, 11, 0.85)",
          stop2: "rgba(180, 83, 9, 0.65)",
          surface: "rgba(251, 191, 36, 0.85)",
          accent: "rgba(245, 158, 11, 0.15)",
          badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
        };
      case "OVERFLOW":
        return {
          glow: "shadow-purple-500/40",
          text: "text-purple-400",
          border: "border-purple-500/20",
          stop1: "rgba(168, 85, 247, 0.85)",
          stop2: "rgba(126, 34, 206, 0.65)",
          surface: "rgba(192, 132, 252, 0.85)",
          accent: "rgba(168, 85, 247, 0.15)",
          badge: "bg-purple-500/15 text-purple-400 border-purple-500/20",
        };
      default:
        return {
          glow: "shadow-cyan-500/30",
          text: "text-cyan-400",
          border: "border-cyan-500/10",
          stop1: "rgba(0, 188, 212, 0.85)",
          stop2: "rgba(0, 120, 180, 0.65)",
          surface: "rgba(103, 232, 249, 0.75)",
          accent: "rgba(0, 188, 212, 0.15)",
          badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
        };
    }
  };

  const colors = getColors();
  
  // Calculate heights (SVG coordinates: 0 is top, 100 is bottom)
  // Tank cylinder goes from y=10 to y=90 (total height 80)
  const tankTop = 10;
  const tankBottom = 90;
  const tankHeight = tankBottom - tankTop;
  const currentLevel = typeof animatedLevel === 'number' ? animatedLevel : 0;
  const waterHeight = (currentLevel / 100) * tankHeight;
  const waterTopY = tankBottom - waterHeight;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-5 rounded-2xl relative overflow-hidden group",
      "bg-[hsl(220,55%,5%)] border",
      colors.border,
      className
    )}>
      {/* Background accent glow */}
      <div 
        className="absolute inset-0 opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-50"
        style={{ background: `radial-gradient(circle at 50% 70%, ${colors.accent}, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex justify-between w-full mb-4 px-1 relative z-10">
        <div className="flex items-center gap-2">
          <Waves className={cn("w-4 h-4", colors.text)} />
          <h3 className="font-bold text-white/85 text-sm">{title}</h3>
        </div>
        {status !== "NORMAL" && (
          <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1", colors.badge)}>
            <AlertTriangle className="w-3 h-3" />
            {status}
          </div>
        )}
      </div>

      {/* Tank SVG */}
      <div className="relative w-44 h-60 mb-4">
        {/* Glow effect behind tank */}
        <div 
          className="absolute inset-4 blur-2xl opacity-30 transition-all duration-1000 rounded-full"
          style={{ background: `radial-gradient(circle, ${colors.accent}, transparent)` }}
        />

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`glass-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="8%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="92%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
            </linearGradient>
            <linearGradient id={`water-gradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.stop1} />
              <stop offset="100%" stopColor={colors.stop2} />
            </linearGradient>
            {/* Reflection gradient */}
            <linearGradient id={`reflection-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="15%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="20%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Back wall of the tank */}
          <ellipse cx="50" cy="10" rx="40" ry="6" className="fill-white/[0.03]" />
          <path d="M 10 10 L 10 90 A 40 6 0 0 0 90 90 L 90 10" className="fill-white/[0.03]" />

          {/* Water Fill with animation */}
          <motion.g
            initial={false}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1.5 }}
          >
            {/* Wavy Water volume */}
            <motion.path
              initial={{ d: `M 10 90 L 10 90 Q 25 87 40 90 T 70 90 T 90 90 L 90 90 A 40 6 0 0 1 10 90` }}
              animate={{
                d: [
                  `M 10 90 L 10 ${waterTopY} Q 25 ${waterTopY - 3} 40 ${waterTopY} T 70 ${waterTopY} T 90 ${waterTopY} L 90 90 A 40 6 0 0 1 10 90`,
                  `M 10 90 L 10 ${waterTopY} Q 25 ${waterTopY + 3} 40 ${waterTopY} T 70 ${waterTopY} T 90 ${waterTopY} L 90 90 A 40 6 0 0 1 10 90`,
                  `M 10 90 L 10 ${waterTopY} Q 25 ${waterTopY - 3} 40 ${waterTopY} T 70 ${waterTopY} T 90 ${waterTopY} L 90 90 A 40 6 0 0 1 10 90`,
                ]
              }}
              transition={{ 
                d: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                default: { type: "spring", bounce: 0.2, duration: 1.5 }
              }}
              fill={`url(#water-gradient-${uniqueId})`}
              className="transition-all duration-1000"
            />
            {/* Water surface ellipse */}
            <motion.ellipse
              initial={{ cy: 90 }}
              animate={{ cy: waterTopY }}
              transition={{ type: "spring", bounce: 0.2, duration: 1.5 }}
              cx="50"
              rx="40"
              ry="6"
              fill={colors.surface}
              className="transition-all duration-1000"
            />
          </motion.g>

          {/* Front glass cylinder (semi-transparent) */}
          <path d="M 10 10 L 10 90 A 40 6 0 0 0 90 90 L 90 10 Z" fill={`url(#glass-gradient-${uniqueId})`} />
          
          {/* Reflection streak */}
          <path d="M 15 12 L 15 88" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <rect x="13" y="10" width="5" height="80" fill={`url(#reflection-${uniqueId})`} rx="2" />
          
          {/* Top rim */}
          <ellipse cx="50" cy="10" rx="40" ry="6" className="fill-transparent stroke-white/20 stroke-[0.5]" />
          
          {/* Bottom rim */}
          <ellipse cx="50" cy="90" rx="40" ry="6" className="fill-transparent stroke-white/10 stroke-[0.5]" />
          
          {/* Side highlights */}
          <line x1="12" y1="10" x2="12" y2="90" className="stroke-white/10 stroke-[0.8]" />
          <line x1="88" y1="10" x2="88" y2="90" className="stroke-white/[0.05] stroke-[0.5]" />
          
          {/* Level indicators */}
          {[25, 50, 75].map((pct) => {
            const y = tankBottom - (pct / 100) * tankHeight;
            return (
              <g key={pct}>
                <line x1="90" y1={y} x2="96" y2={y} className="stroke-white/20 stroke-[0.5]" />
                <text x="97" y={y + 1.5} className="fill-white/15" fontSize="3" fontWeight="600">
                  {pct}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Text overlay in the center of the tank */}
        <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-lg">
          <span className="text-3xl font-black text-white tracking-tight text-glow-white">
            {animatedLevel.toFixed(1)}%
          </span>
          <span className="text-[10px] text-white/60 font-semibold bg-black/30 px-2.5 py-0.5 rounded-full mt-1.5 backdrop-blur-sm border border-white/5">
            {currentLiters.toLocaleString()} L
          </span>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="w-full flex justify-between items-center px-4 py-3 bg-white/[0.03] rounded-xl mt-1 border border-white/[0.04] relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] text-white/25 uppercase tracking-[0.1em] font-bold">Capacidad</span>
          <span className="text-sm font-bold text-white/70">{capacityLiters.toLocaleString()} L</span>
        </div>
        <div className="h-7 w-px bg-white/[0.06]"></div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-white/25 uppercase tracking-[0.1em] font-bold">Estado</span>
          <span className={cn("text-sm font-black", colors.text)}>
            {status === "NORMAL" ? "ÓPTIMO" : status}
          </span>
        </div>
      </div>
    </div>
  );
}
