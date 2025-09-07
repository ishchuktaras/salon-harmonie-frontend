"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth" 

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Můžete přesměrovat na speciální stránku pro neoprávněný přístup
        // nebo zpět na dashboard.
        router.push("/dashboard") 
        return
      }
    }
  }, [user, isLoading, router, allowedRoles])

  // Zobrazí se, zatímco se ověřuje přihlášení
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Pokud uživatel není přihlášen nebo nemá roli, nic se nezobrazí, 
  // protože useEffect ho přesměruje.
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  // Pokud je vše v pořádku, zobrazí se obsah stránky
  return <>{children}</>
}