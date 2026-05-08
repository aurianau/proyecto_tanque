"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Droplets, 
  LayoutDashboard, 
  Map as MapIcon, 
  Bell, 
  Cpu, 
  Settings, 
  Users,
  LogOut,
  Waves,
  Home,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Comunidades", href: "/dashboard/communities", icon: Users },
  { name: "Tanques", href: "/dashboard/tanks", icon: Droplets },
  { name: "Viviendas", href: "/dashboard/households", icon: Home },
  { name: "Mapa", href: "/dashboard/map", icon: MapIcon },
  { name: "Dispositivos", href: "/dashboard/devices", icon: Cpu },
  { name: "Analítica", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Alertas", href: "/dashboard/alerts", icon: Bell },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    router.push('/login');
  };

  return (
    <aside 
      className={cn(
        "h-screen fixed left-0 top-0 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "bg-[hsl(220,55%,4%)] border-r border-white/[0.04]",
        isCollapsed ? "w-20" : "w-[272px]"
      )}
    >
      {/* Sidebar gradient glow on right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute -right-16 top-1/3 w-32 h-64 bg-cyan-500/[0.03] rounded-full blur-[60px] pointer-events-none" />

      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 border-b border-white/[0.04] transition-all duration-500",
        isCollapsed ? "p-4 justify-center" : "p-6"
      )}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 glow-teal">
          <Waves className="text-white w-6 h-6" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  HydroSmart
                </span>
                <span className="text-[10px] font-semibold text-cyan-400/50 uppercase tracking-widest whitespace-nowrap">
                  Pro v3.0
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] px-3 mb-2 block">
            Navegación
          </span>
        )}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-300 group relative",
                isCollapsed ? "px-0 py-3 justify-center" : "px-4 py-3",
                isActive 
                  ? "bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-400" 
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
              )}
            >
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-cyan-400 shadow-[0_0_12px_rgba(0,188,212,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}

              <div className={cn(
                "shrink-0 transition-all duration-300",
                isActive ? "scale-110" : "group-hover:scale-110"
              )}>
                <item.icon className="w-5 h-5" />
              </div>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "font-medium text-sm whitespace-nowrap",
                      isActive ? "font-semibold" : ""
                    )}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 border border-white/10">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white/25 hover:bg-white/[0.04] hover:text-white/50 transition-all duration-300 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Colapsar</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/[0.04]">
        {/* User avatar row */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/10">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/70 truncate">Administrador</p>
              <p className="text-[10px] text-white/25 truncate">admin@hydrosmart.io</p>
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl text-red-400/60 hover:bg-red-500/8 hover:text-red-400 transition-all duration-300 cursor-pointer",
            isCollapsed ? "px-0 py-3 justify-center" : "px-4 py-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium text-sm"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
}
