"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { StatsCard } from "@/components/ui/stats-card"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Calendar, Users, CreditCard, Clock, TrendingUp, UserCheck, Euro, Plus } from "lucide-react"

interface User {
  email: string
  role: string
  name: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage-50 to-stone-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: "Administrátor",
      manager: "Manažer",
      therapist: "Terapeut",
      receptionist: "Recepční",
    }
    return roleNames[role as keyof typeof roleNames] || role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage-50 to-stone-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title={`Vítejte zpět, ${user.name}!`}
          description={`Role: ${getRoleDisplayName(user.role)} • Dnes je ${new Date().toLocaleDateString("cs-CZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Dnešní rezervace"
            value="12"
            icon={Calendar}
            trend={{ value: "+2 od včera", isPositive: true }}
          />
          <StatsCard
            title="Aktivní klienti"
            value="248"
            icon={Users}
            trend={{ value: "+12 tento měsíc", isPositive: true }}
          />
          <StatsCard
            title="Dnešní tržby"
            value="8,450 Kč"
            icon={Euro}
            trend={{ value: "+15% od včera", isPositive: true }}
          />
          <StatsCard
            title="Obsazenost"
            value="78%"
            icon={TrendingUp}
            trend={{ value: "Průměr tohoto týdne", isPositive: true }}
          />
        </div>

        {/* Quick Actions & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-stone-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-stone-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sage-600" />
                Rychlé akce
              </CardTitle>
              <CardDescription>Nejčastěji používané funkce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-sage-50 hover:bg-sage-100 text-sage-800 border border-sage-200 shadow-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Nová rezervace
              </Button>
              <Button className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                <Users className="w-4 h-4 mr-2" />
                Přidat klienta
              </Button>
              <Button className="w-full justify-start bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Otevřít pokladnu
              </Button>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-stone-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sage-600" />
                Nadcházející rezervace
              </CardTitle>
              <CardDescription>Další 3 termíny</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-sage-50 to-stone-50 rounded-xl border border-sage-100">
                <div className="w-2 h-12 bg-sage-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800">Jana Nováková</p>
                  <p className="text-xs text-stone-600">Relaxační masáž • 10:00</p>
                </div>
                <UserCheck className="w-5 h-5 text-sage-600" />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-100">
                <div className="w-2 h-12 bg-amber-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800">Petr Svoboda</p>
                  <p className="text-xs text-stone-600">Kosmetické ošetření • 11:30</p>
                </div>
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-stone-50 rounded-xl border border-blue-100">
                <div className="w-2 h-12 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800">Marie Dvořáková</p>
                  <p className="text-xs text-stone-600">Sauna • 14:00</p>
                </div>
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
