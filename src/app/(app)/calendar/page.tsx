// frontend/src/app/(app)/calendar/page.tsx

"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from "date-fns"
import { cs } from "date-fns/locale"

// Definujeme typy pro data, která dostaneme z API
interface Therapist {
  id: number
  firstName: string
  lastName: string
}
interface Reservation {
  id: number
  startTime: string
  endTime: string
  therapistId: number
  client: {
    firstName: string
    lastName: string
  }
  service: {
    name: string
  }
}
interface TimeBlock {
  id: number
  startTime: string
  endTime: string
  therapistId: number
  reason: string | null
}

interface CalendarData {
  therapists: Therapist[]
  reservations: Reservation[]
  timeBlocks: TimeBlock[]
}

export default function CalendarPage() {
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const startDate = format(weekStart, "yyyy-MM-dd")
        const endDate = format(weekEnd, "yyyy-MM-dd'T'23:59:59.999'Z'")
        const response = await apiClient.get<CalendarData>(
          `/calendar/manager-view?startDate=${startDate}&endDate=${endDate}`,
        )
        setData(response)
      } catch (error) {
        console.error("Failed to fetch calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentDate]) // Znovu načteme data, když se změní týden

  if (loading) {
    return <div>Načítám kalendář...</div>
  }

  if (!data) {
    return <div>Nepodařilo se načíst data kalendáře.</div>
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kalendář</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nová rezervace
        </Button>
      </div>

      {/* Ovládání kalendáře */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() =>
            setCurrentDate((d) => new Date(d.setDate(d.getDate() - 7)))
          }
        >
          Předchozí týden
        </Button>
        <div className="text-xl font-semibold">
          {format(weekStart, "d. MMMM", { locale: cs })} -{" "}
          {format(weekEnd, "d. MMMM yyyy", { locale: cs })}
        </div>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentDate((d) => new Date(d.setDate(d.getDate() + 7)))
          }
        >
          Následující týden
        </Button>
      </div>

      {/* Mřížka kalendáře */}
      <div className="grid grid-cols-8 border-t border-l border-gray-200">
        {/* Prázdný roh */}
        <div className="p-2 border-r border-b border-gray-200 bg-gray-50"></div>

        {/* Hlavička dnů */}
        {days.map((day) => (
          <div
            key={day.toString()}
            className="p-2 text-center border-r border-b border-gray-200 bg-gray-50"
          >
            <div className="font-semibold capitalize">
              {format(day, "eeee", { locale: cs })}
            </div>
            <div className="text-gray-500">{format(day, "d.M.")}</div>
          </div>
        ))}

        {/* Řádky terapeutů */}
        {data.therapists.map((therapist) => (
          <>
            <div
              key={therapist.id}
              className="p-2 border-r border-b border-gray-200 bg-gray-50 flex items-center justify-center"
            >
              {therapist.firstName} {therapist.lastName}
            </div>
            {days.map((day) => (
              <div
                key={`${therapist.id}-${day.toString()}`}
                className="p-1 border-r border-b border-gray-200 h-48 relative"
              >
                {/* Zde vykreslíme rezervace a blokace pro daný den a terapeuta */}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}
