// Tento soubor nahrazuje obsah v `frontend/src/app/layout.tsx`
// Definuje základní strukturu a vzhled pro VŠECHNY stránky v aplikaci.

import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

// Načtení fontů podle strategického dokumentu
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Salon Harmonie - Rezervační Systém",
  description: "Vítejte v digitálním prostředí Salonu Harmonie.",
};

// Komponenta pro navigační lištu
function TopNav() {
  return (
    <header style={{ backgroundColor: '#3C3633' }} className="text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className={`${lora.variable} font-serif text-2xl font-bold`} style={{ color: '#E1D7C6' }}>
          Salon Harmonie
        </div>
        <ul className="flex items-center space-x-8">
          <li><a href="#" className="hover:text-white transition-colors duration-300" style={{ color: '#A4907C' }}>Služby</a></li>
          <li><a href="#" className="hover:text-white transition-colors duration-300" style={{ color: '#A4907C' }}>E-shop</a></li>
          <li><a href="#" className="hover:text-white transition-colors duration-300" style={{ color: '#A4907C' }}>Kontakt</a></li>
          <li>
            <a 
              href="#" 
              className="px-6 py-2 rounded-md transition-colors duration-300" 
              style={{ backgroundColor: '#6A5F5A', color: '#E1D7C6' }}
            >
              Rezervovat
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

// Hlavní layout komponenta
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${inter.variable} font-sans`} style={{ backgroundColor: '#E1D7C6' }}>
        <TopNav />
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}