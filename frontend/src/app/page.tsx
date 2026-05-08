"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, 
  Activity, 
  Shield, 
  ChevronRight, 
  Waves, 
  MapPin, 
  Cpu, 
  BarChart3,
  ArrowRight 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Animated bubble component
function FloatingBubble({ delay, size, left }: { delay: number; size: number; left: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: -size,
        background: `radial-gradient(circle at 30% 30%, rgba(0, 188, 212, ${0.1 + Math.random() * 0.1}), rgba(0, 150, 200, 0.03))`,
        border: '1px solid rgba(0, 188, 212, 0.08)',
      }}
      animate={{
        y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 200 : 1200)],
        x: [0, (Math.random() - 0.5) * 150],
        scale: [0, 1, 0.8],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: 12 + Math.random() * 8,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Animated water wave SVG
function WaterWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-48 opacity-20">
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <motion.path
          fill="rgba(0, 188, 212, 0.3)"
          animate={{
            d: [
              "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120Z",
              "M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120Z",
              "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120Z",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="rgba(0, 150, 200, 0.2)"
          animate={{
            d: [
              "M0,80 C360,110 720,50 1080,80 C1260,95 1350,70 1440,80 L1440,120 L0,120Z",
              "M0,80 C360,50 720,110 1080,80 C1260,65 1350,95 1440,80 L1440,120 L0,120Z",
              "M0,80 C360,110 720,50 1080,80 C1260,95 1350,70 1440,80 L1440,120 L0,120Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
    </div>
  );
}

const features = [
  {
    icon: Droplets,
    title: "Monitoreo en Tiempo Real",
    desc: "Telemetría instantánea del nivel de agua mediante sensores ultrasónicos y ESP32.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: MapPin,
    title: "Geolocalización",
    desc: "Mapa interactivo con la ubicación precisa de cada tanque y comunidad.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Activity,
    title: "Alertas Inteligentes",
    desc: "Detección automática de niveles críticos, desbordamientos y fallas.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Analítica Avanzada",
    desc: "Historial de consumo, tendencias y reportes exportables para toma de decisiones.",
    gradient: "from-purple-500 to-indigo-500",
  },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Water caustics overlay */}
      <div className="water-caustics" />

      {/* Floating bubbles */}
      {mounted && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <FloatingBubble
              key={i}
              delay={i * 1.2}
              size={15 + Math.random() * 60}
              left={Math.random() * 100}
            />
          ))}
        </>
      )}

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Top nav bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg glow-teal">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white text-glow-white">
              HydroSmart
            </span>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="glass-strong px-6 py-2.5 rounded-xl text-sm font-semibold text-white/90 hover:text-white transition-all hover:glow-teal-strong cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </motion.nav>

        {/* Main Hero Content */}
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-xs font-semibold text-cyan-300 tracking-wider uppercase">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 pulse-ring" />
              <span className="relative flex h-2 w-2 rounded-full bg-cyan-400" />
              <span className="ml-1">Plataforma IoT v3.0</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
          >
            <span className="bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
              Monitoreo Inteligente
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 bg-clip-text text-transparent text-glow-teal">
              de Agua Comunitario
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Controla el nivel de agua de los tanques en las comunidades en tiempo real.
            Tecnología ESP32 + sensores ultrasónicos con dashboard de última generación.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <button
              onClick={() => router.push("/login")}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Acceder al Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-glare" />
            </button>

            <button 
              className="px-8 py-4 rounded-2xl glass-strong text-white/80 font-semibold hover:text-white transition-all duration-300 hover:glow-teal flex items-center gap-2 cursor-pointer"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Cpu className="w-5 h-5" />
              Conocer Más
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 pt-12"
          >
            {[
              { value: "24/7", label: "Monitoreo" },
              { value: "IoT", label: "Conectividad" },
              { value: "< 1s", label: "Latencia" },
              { value: "∞", label: "Escalable" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-cyan-400 text-glow-teal">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <WaterWaves />
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Tecnología de{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Vanguardia
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg">
              Todo lo que necesitas para garantizar el abastecimiento de agua en tu comunidad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8 card-premium gradient-border group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/45 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-12 glow-teal relative overflow-hidden">
            <div className="shimmer-wave absolute inset-0 rounded-3xl" />
            <div className="relative z-10">
              <Waves className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Listo para controlar el agua de tu comunidad?
              </h3>
              <p className="text-white/40 mb-8 text-lg">
                Comienza ahora y accede al panel de monitoreo en tiempo real.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  Ingresar al Sistema
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-500" />
            <span className="text-sm text-white/30 font-medium">
              HydroSmart Pro 3.0
            </span>
          </div>
          <p className="text-xs text-white/20">
            © 2026 HydroSmart Team. Monitoreo inteligente de agua para comunidades.
          </p>
        </div>
      </footer>
    </div>
  );
}
