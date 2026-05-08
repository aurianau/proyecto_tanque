import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HydroSmart Pro 3.0 | Monitoreo Inteligente de Agua",
  description: "Plataforma IoT de última generación para el monitoreo y gestión de recursos hídricos en comunidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
      >
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
