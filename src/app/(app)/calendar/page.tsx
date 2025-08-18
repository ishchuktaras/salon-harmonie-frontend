// frontend/src/app/(app)/calendar/page.tsx

"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  startOfWeek,
  endOfWeek,
  format,
  eachDayOfInterval,
  isSameDay,
} from "date-fns"
import { cs } from "date-fns/locale"
import { BookingModal } from "@/components/calendar/booking-modal"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

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

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate])

  if (loading) {
    return (
        <div className="flex h-[calc(100vh-150px)] w-full items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    )
  }

  if (!data) {
    return <div>Nepodařilo se načíst data kalendáře.</div>
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kalendář</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nová rezervace
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() =>
            setCurrentDate((d) => new Date(d.setDate(d.getDate() - 7)))
          }
        >
          Předchozí týden
        </Button>
        <div className="text-xl font-semibold text-center">
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

      <div className="grid grid-cols-[150px_repeat(7,1fr)] border-t border-l border-gray-200 bg-white">
        <div className="p-2 border-r border-b border-gray-200 bg-gray-50"></div>
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

        {data.therapists.map((therapist) => (
          <>
            <div
              key={therapist.id}
              className="p-2 border-r border-b border-gray-200 bg-gray-50 flex items-center justify-center text-center font-semibold"
            >
              {therapist.firstName} {therapist.lastName}
            </div>
            {days.map((day) => (
              <div
                key={`${therapist.id}-${day.toString()}`}
                className="p-1 border-r border-b border-gray-200 h-48 relative space-y-1 overflow-y-auto"
              >
                {/* Vykreslení rezervací */}
                {data.reservations
                  .filter(
                    (res) =>
                      res.therapistId === therapist.id &&
                      isSameDay(new Date(res.startTime), day),
                  )
                  .map((res) => (
                    <div
                      key={res.id}
                      className="bg-blue-100 border border-blue-200 p-2 rounded-lg text-xs cursor-pointer hover:bg-blue-200"
                    >
                      <p className="font-bold text-blue-800">
                        {res.client.firstName} {res.client.lastName}
                      </p>
                      <p className="text-blue-700">{res.service.name}</p>
                      <p className="text-gray-600 mt-1">
                        {format(new Date(res.startTime), "HH:mm")} -{" "}
                        {format(new Date(res.endTime), "HH:mm")}
                      </p>
                    </div>
                  ))}
                {/* Vykreslení blokací */}
                {data.timeBlocks
                  .filter(
                    (block) =>
                      block.therapistId === therapist.id &&
                      isSameDay(new Date(block.startTime), day),
                  )
                  .map((block) => (
                    <div
                      key={block.id}
                      className="bg-gray-200 border border-gray-300 p-2 rounded-lg text-xs"
                    >
                      <p className="font-bold text-gray-700">
                        {block.reason || "Blokace"}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {format(new Date(block.startTime), "HH:mm")} -{" "}
                        {format(new Date(block.endTime), "HH:mm")}
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </>
        ))}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingCreated={fetchData}
      />
    </div>
  )
}
