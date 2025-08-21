"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function Navigation() {
  const { user } = useAuth(); // Tento hook nyní funguje, protože je obalen v AuthProvider

  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="#"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
      >
        <Sparkles className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">Salon Harmonie</span>
      </Link>
      <Link
        href="/dashboard"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        Dashboard
      </Link>
      <Link
        href="/kalendar"
        className="flex items-center gap-4 px-2.5 text-foreground"
      >
        Kalendář
      </Link>
      <Link
        href="/clients"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        Klienti
      </Link>
      <Link
        href="/pos"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        Pokladna
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        Reporty
      </Link>
      <Link
        href="/settings"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        Nastavení
      </Link>
    </nav>
  )
}
