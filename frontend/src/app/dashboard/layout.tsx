"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-mesh overflow-hidden relative">
      {/* Water caustics overlay */}
      <div className="water-caustics" />
      
      {/* Dot grid pattern */}
      <div className="fixed inset-0 dot-grid pointer-events-none z-0" />
      
      <Sidebar />
      <main className="flex-1 ml-[272px] p-8 min-h-screen overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 page-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
