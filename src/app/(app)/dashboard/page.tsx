// frontend/src/app/(app)/dashboard/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { apiClient } from "@/lib/api/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar, Users, Euro, Activity } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DashboardSummary {
  dailyReservations: number
  activeClients: number
  dailyRevenue: number
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const loadDashboardData = async () => {
        try {
          setIsLoadingData(true)
          setError(null)
          const data = await apiClient.get<DashboardSummary>(
            "/reports/dashboard-summary",
          )
          setSummary(data)
        } catch (err) {
          console.error("Error loading dashboard data:", err)
          setError(
            err instanceof Error ? err.message : "Chyba při načítání dat",
          )
        } finally {
          setIsLoadingData(false)
        }
      }
      loadDashboardData()
    }
  }, [user])

  if (authLoading || (user && isLoadingData)) {
    return (
      <div className="flex h-[calc(100vh-150px)] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Přehled</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dnešní tržby</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(summary?.dailyRevenue ?? 0).toLocaleString("cs-CZ")} Kč
            </div>
            <p className="text-xs text-muted-foreground">
              Z dokončených transakcí
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktivní klienti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{summary?.activeClients ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Za poslední týden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dnešní rezervace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{summary?.dailyReservations ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Celkem pro dnešní den
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Obsazenost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Bude doplněno</p>
          </CardContent>
        </Card>
      </dl>
    </div>
  )
}
