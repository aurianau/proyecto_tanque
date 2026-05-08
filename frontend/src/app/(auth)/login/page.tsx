"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves, LogIn, User, Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Cookies from "js-cookie";

// Animated water drop
function WaterDrop({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        background: `radial-gradient(circle at 35% 35%, rgba(0, 188, 212, 0.15), rgba(0, 120, 180, 0.04))`,
        border: '1px solid rgba(0, 188, 212, 0.08)',
      }}
      initial={{ y: '110vh', scale: 0, opacity: 0 }}
      animate={{
        y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 200 : 1200)],
        scale: [0, 1, 0.6],
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration: 14 + Math.random() * 8,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Usamos el username field porque Django por defecto espera 'username'
      const res = await api.post("/auth/login/", {
        username: username,
        password: password
      });

      if (res.data.access) {
        Cookies.set('access_token', res.data.access, { expires: 1 }); // 1 day
        if (res.data.refresh) {
          Cookies.set('refresh_token', res.data.refresh, { expires: 7 }); // 7 days
        }
        
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Credenciales incorrectas. Verifica tu usuario y contraseña.");
      } else {
        setError("Error de conexión con el servidor.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh relative overflow-hidden">
      {/* Water caustics */}
      <div className="water-caustics" />

      {/* Animated floating drops */}
      {mounted && Array.from({ length: 18 }).map((_, i) => (
        <WaterDrop
          key={i}
          delay={i * 0.9}
          x={Math.random() * 100}
          size={20 + Math.random() * 70}
        />
      ))}

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-md p-4"
      >
        <Card className="glass-strong border-white/8 shadow-2xl rounded-3xl overflow-hidden">
          {/* Top shimmer accent */}
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <CardHeader className="space-y-6 text-center pt-10 pb-4 px-8">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 glow-teal-strong relative"
            >
              <Waves className="w-11 h-11 text-white" />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 pulse-ring" />
            </motion.div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                HydroSmart Pro
              </CardTitle>
              <CardDescription className="text-white/40 text-sm font-medium">
                Sistema de Monitoreo de Agua Comunitario
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                {/* Username Field */}
                <div className="space-y-2.5 group">
                  <Label htmlFor="username" className="text-white/60 ml-1 text-xs font-semibold uppercase tracking-wider">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/25 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    <Input 
                      id="username" 
                      type="text" 
                      placeholder="admin" 
                      className="pl-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/30 h-13 rounded-xl text-base transition-all duration-300 hover:bg-white/[0.06]"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2.5 group">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                      Contraseña
                    </Label>
                    <a href="#" className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/25 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      className="pl-12 pr-12 bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/30 h-13 rounded-xl text-base transition-all duration-300 hover:bg-white/[0.06]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center font-medium bg-red-400/8 py-3 rounded-xl border border-red-400/15"
                >
                  {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                className="w-full h-13 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base transition-all duration-300 relative overflow-hidden group rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2.5">
                      Iniciar Sesión 
                      <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Hover glare effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-glare" />
                  </>
                )}
              </Button>
            </form>

            {/* Decorative footer */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-white/5">
              <div className="flex h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(0,188,212,0.5)]" />
              <span className="text-[11px] text-white/20 font-medium tracking-wider uppercase">
                Conexión segura SSL
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
