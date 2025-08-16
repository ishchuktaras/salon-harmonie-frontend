"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addHours, startOfDay } from "date-fns"
import { cs } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  clientId: string
  therapistId: string
  serviceId: string
  status: "confirmed" | "pending" | "cancelled"
  notes: string
}

interface CalendarViewProps {
  appointments: Appointment[]
  viewType: "day" | "week" | "month"
  onAppointmentClick: (appointment: Appointment) => void
  onTimeSlotClick: (date: Date) => void
}

export function CalendarView({ appointments, viewType, onAppointmentClick, onTimeSlotClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (viewType === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getDateRange = () => {
    if (viewType === "day") {
      return [currentDate]
    } else if (viewType === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      return eachDayOfInterval({ start, end })
    } else {
      // Month view - simplified for now
      const start = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), { weekStartsOn: 1 })
      const end = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), { weekStartsOn: 1 })
      return eachDayOfInterval({ start, end })
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => isSameDay(appointment.start, date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-stone-100 text-stone-800 border-stone-200"
    }
  }

  const timeSlots = Array.from({ length: 12 }, (_, i) => addHours(startOfDay(new Date()), 8 + i)) // 8:00 - 19:00

  const dateRange = getDateRange()

  return (
    <div className="space-y-4">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-serif font-semibold text-stone-800">
            {viewType === "day" && format(currentDate, "EEEE, d. MMMM yyyy", { locale: cs })}
            {viewType === "week" &&
              `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d. MMM", { locale: cs })} - ${format(
                endOfWeek(currentDate, { weekStartsOn: 1 }),
                "d. MMM yyyy",
                { locale: cs },
              )}`}
            {viewType === "month" && format(currentDate, "MMMM yyyy", { locale: cs })}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
          Dnes
        </Button>
      </div>

      {/* Calendar Grid */}
      {viewType === "month" ? (
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-stone-600 bg-stone-100 rounded-lg">
              {day}
            </div>
          ))}
          {/* Date cells */}
          {dateRange.map((date) => {
            const dayAppointments = getAppointmentsForDate(date)
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const isToday = isSameDay(date, new Date())

            return (
              <Card
                key={date.toISOString()}
                className={cn(
                  "min-h-24 p-2 cursor-pointer hover:shadow-md transition-shadow",
                  !isCurrentMonth && "opacity-50",
                  isToday && "ring-2 ring-amber-500",
                )}
                onClick={() => onTimeSlotClick(date)}
              >
                <div className="text-sm font-medium text-stone-800 mb-1">{format(date, "d")}</div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="text-xs p-1 rounded bg-emerald-100 text-emerald-800 truncate"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAppointmentClick(appointment)
                      }}
                    >
                      {format(appointment.start, "HH:mm")} {appointment.title.split(" - ")[0]}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-stone-600">+{dayAppointments.length - 2} dalších</div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Week/Day view */}
          <div className="grid grid-cols-8 gap-2">
            {/* Time column header */}
            <div className="p-2"></div>
            {/* Day headers */}
            {dateRange.map((date) => (
              <div
                key={date.toISOString()}
                className={cn(
                  "p-2 text-center text-sm font-medium rounded-lg",
                  isSameDay(date, new Date()) ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-600",
                )}
              >
                <div>{format(date, "EEE", { locale: cs })}</div>
                <div className="text-lg font-bold">{format(date, "d")}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-8 gap-2">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.toISOString()} className="contents">
                {/* Time label */}
                <div className="p-2 text-sm text-stone-600 text-right border-r border-stone-200">
                  {format(timeSlot, "HH:mm")}
                </div>
                {/* Day columns */}
                {dateRange.map((date) => {
                  const slotDate = new Date(date)
                  slotDate.setHours(timeSlot.getHours(), timeSlot.getMinutes())
                  const slotAppointments = appointments.filter(
                    (apt) => apt.start <= slotDate && apt.end > slotDate && isSameDay(apt.start, date),
                  )

                  return (
                    <div
                      key={`${date.toISOString()}-${timeSlot.toISOString()}`}
                      className="min-h-12 p-1 border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors"
                      onClick={() => onTimeSlotClick(slotDate)}
                    >
                      {slotAppointments.map((appointment) => (
                        <Badge
                          key={appointment.id}
                          className={cn("w-full text-xs cursor-pointer", getStatusColor(appointment.status))}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAppointmentClick(appointment)
                          }}
                        >
                          <div className="flex items-center space-x-1 truncate">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.title.split(" - ")[0]}</span>
                          </div>
                        </Badge>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
