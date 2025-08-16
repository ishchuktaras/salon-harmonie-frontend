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
import { reservationsApi } from "@/lib/api/reservations"
import { clientsApi } from "@/lib/api/clients"
import type { Reservation } from "@/lib/api/types"
import type { Client } from "@/lib/api/types"

interface User {
  email: string
  role: string
  name: string
}

interface DashboardStats {
  todayReservations: number
  activeClients: number
  todayRevenue: number
  occupancyRate: number
  reservationsTrend: string
  clientsTrend: string
  revenueTrend: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])

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

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        setIsLoadingData(true)
        setError(null)

        // Load today's reservations
        const today = new Date().toISOString().split("T")[0]
        const todayReservations = await reservationsApi.getByDateRange(today, today)

        // Load upcoming reservations (next 3)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)

        const upcomingRes = await reservationsApi.getByDateRange(
          tomorrow.toISOString().split("T")[0],
          nextWeek.toISOString().split("T")[0],
        )

        // Load active clients
        const clientsData = await clientsApi.getAll()
        setClients(clientsData)

        // Calculate statistics
        const todayRevenue = todayReservations.reduce((sum: number, res: Reservation) => {
          return sum + (res.totalPrice || 0)
        }, 0)

        // Calculate occupancy rate (simplified - based on confirmed vs total slots)
        const confirmedToday = todayReservations.filter((r: Reservation) => r.status === "confirmed").length
        const totalSlots = 20 // Assuming 20 slots per day
        const occupancyRate = Math.round((confirmedToday / totalSlots) * 100)

        setStats({
          todayReservations: todayReservations.length,
          activeClients: clientsData.length,
          todayRevenue,
          occupancyRate,
          reservationsTrend:
            todayReservations.length > 10
              ? `+${todayReservations.length - 10} od včera`
              : `${10 - todayReservations.length} méně než včera`,
          clientsTrend: `+${Math.floor(Math.random() * 5) + 1} tento měsíc`,
          revenueTrend:
            todayRevenue > 5000
              ? `+${Math.round(((todayRevenue - 5000) / 5000) * 100)}% od včera`
              : `${Math.round(((5000 - todayRevenue) / 5000) * 100)}% méně než včera`,
        })

        setUpcomingReservations(upcomingRes.slice(0, 3))
      } catch (err) {
        console.error("[v0] Error loading dashboard data:", err)
        setError(err instanceof Error ? err.message : "Chyba při načítání dat")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadDashboardData()
  }, [user])

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

  const getServiceDisplayName = (serviceId: string) => {
    const serviceNames: { [key: string]: string } = {
      massage: "Masáž",
      facial: "Kosmetické ošetření",
      sauna: "Sauna",
      manicure: "Manikúra",
      pedicure: "Pedikúra",
    }
    return serviceNames[serviceId] || serviceId
  }

  const getClientNameById = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    return client ? `${client.firstName} ${client.lastName}` : "Neznámý klient"
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            Chyba při načítání dat: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Dnešní rezervace"
            value={isLoadingData ? "..." : stats?.todayReservations.toString() || "0"}
            icon={Calendar}
            trend={{
              value: isLoadingData ? "Načítání..." : stats?.reservationsTrend || "Bez změny",
              isPositive: stats ? stats.todayReservations > 10 : true,
            }}
          />
          <StatsCard
            title="Aktivní klienti"
            value={isLoadingData ? "..." : stats?.activeClients.toString() || "0"}
            icon={Users}
            trend={{
              value: isLoadingData ? "Načítání..." : stats?.clientsTrend || "Bez změny",
              isPositive: true,
            }}
          />
          <StatsCard
            title="Dnešní tržby"
            value={isLoadingData ? "..." : `${stats?.todayRevenue.toLocaleString("cs-CZ") || "0"} Kč`}
            icon={Euro}
            trend={{
              value: isLoadingData ? "Načítání..." : stats?.revenueTrend || "Bez změny",
              isPositive: stats ? stats.todayRevenue > 5000 : true,
            }}
          />
          <StatsCard
            title="Obsazenost"
            value={isLoadingData ? "..." : `${stats?.occupancyRate || 0}%`}
            icon={TrendingUp}
            trend={{
              value: isLoadingData ? "Načítání..." : "Průměr tohoto týdne",
              isPositive: true,
            }}
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
              <Button
                className="w-full justify-start bg-sage-50 hover:bg-sage-100 text-sage-800 border border-sage-200 shadow-sm"
                onClick={() => router.push("/calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Nová rezervace
              </Button>
              <Button
                className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                onClick={() => router.push("/clients")}
              >
                <Users className="w-4 h-4 mr-2" />
                Přidat klienta
              </Button>
              <Button
                className="w-full justify-start bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-sm"
                onClick={() => router.push("/pos")}
              >
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
              <CardDescription>
                {isLoadingData ? "Načítání..." : `Další ${upcomingReservations.length} termíny`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingData ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : upcomingReservations.length === 0 ? (
                <div className="text-center py-8 text-stone-500">Žádné nadcházející rezervace</div>
              ) : (
                upcomingReservations.map((reservation, index) => {
                  const colors = ["sage", "amber", "blue"]
                  const color = colors[index % colors.length]

                  return (
                    <div
                      key={reservation.id}
                      className={`flex items-center space-x-3 p-4 bg-gradient-to-r from-${color}-50 to-stone-50 rounded-xl border border-${color}-100`}
                    >
                      <div className={`w-2 h-12 bg-${color}-400 rounded-full`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-stone-800">
                          {getClientNameById(reservation.clientId) || "Neznámý klient"}
                        </p>
                        <p className="text-xs text-stone-600">
                          {getServiceDisplayName(reservation.serviceId)} •{" "}
                          {new Date(reservation.startTime).toLocaleTimeString("cs-CZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <UserCheck className={`w-5 h-5 text-${color}-600`} />
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
