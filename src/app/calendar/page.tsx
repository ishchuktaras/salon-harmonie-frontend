"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CalendarView } from "@/components/calendar/calendar-view"
import { BookingModal } from "@/components/calendar/booking-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Filter, Users, Clock } from "lucide-react"

// Mock data for appointments
const mockAppointments = [
  {
    id: "1",
    title: "Jana Nováková - Relaxační masáž",
    start: new Date(2025, 0, 16, 10, 0),
    end: new Date(2025, 0, 16, 11, 0),
    clientId: "client-1",
    therapistId: "therapist-1",
    serviceId: "service-1",
    status: "confirmed" as const,
    notes: "Preferuje silnější tlak",
  },
  {
    id: "2",
    title: "Petr Svoboda - Kosmetické ošetření",
    start: new Date(2025, 0, 16, 11, 30),
    end: new Date(2025, 0, 16, 12, 30),
    clientId: "client-2",
    therapistId: "therapist-2",
    serviceId: "service-2",
    status: "confirmed" as const,
    notes: "",
  },
  {
    id: "3",
    title: "Marie Dvořáková - Sauna",
    start: new Date(2025, 0, 16, 14, 0),
    end: new Date(2025, 0, 16, 15, 0),
    clientId: "client-3",
    therapistId: "therapist-1",
    serviceId: "service-3",
    status: "pending" as const,
    notes: "První návštěva",
  },
]

const therapists = [
  { id: "all", name: "Všichni terapeuti" },
  { id: "therapist-1", name: "Anna Krásná" },
  { id: "therapist-2", name: "Pavel Wellness" },
  { id: "therapist-3", name: "Lucie Harmonie" },
]

const rooms = [
  { id: "all", name: "Všechny místnosti" },
  { id: "room-1", name: "Masérna 1" },
  { id: "room-2", name: "Masérna 2" },
  { id: "room-3", name: "Kosmetika" },
  { id: "room-4", name: "Sauna" },
]

export default function CalendarPage() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [selectedTherapist, setSelectedTherapist] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [viewType, setViewType] = useState<"day" | "week" | "month">("week")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>("")

  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedTherapist !== "all" && appointment.therapistId !== selectedTherapist) {
      return false
    }
    // Room filtering would be implemented based on appointment room data
    return true
  })

  const todayStats = {
    total: appointments.filter((apt) => {
      const today = new Date()
      return apt.start.toDateString() === today.toDateString()
    }).length,
    confirmed: appointments.filter((apt) => {
      const today = new Date()
      return apt.start.toDateString() === today.toDateString() && apt.status === "confirmed"
    }).length,
    pending: appointments.filter((apt) => {
      const today = new Date()
      return apt.start.toDateString() === today.toDateString() && apt.status === "pending"
    }).length,
  }

  useEffect(() => {
    loadAppointmentsFromDatabase()
  }, [])

  const saveAppointmentToDatabase = async (appointment: any) => {
    try {
      console.log("[v0] Saving appointment to database:", appointment)
      setApiStatus("Ukládám do databáze...")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token
        },
        body: JSON.stringify({
          clientId: appointment.clientId,
          therapistId: appointment.therapistId,
          serviceId: appointment.serviceId,
          startTime: appointment.start.toISOString(),
          endTime: appointment.end.toISOString(),
          status: appointment.status,
          notes: appointment.notes,
        }),
      })

      if (response.ok) {
        const savedAppointment = await response.json()
        console.log("[v0] Appointment saved successfully:", savedAppointment)
        setApiStatus(`✅ Rezervace uložena do databáze (ID: ${savedAppointment.id})`)
        return savedAppointment
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("[v0] Error saving appointment:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setApiStatus(`❌ Chyba při ukládání: ${errorMessage}`)
      throw error
    }
  }

  const loadAppointmentsFromDatabase = async () => {
    try {
      console.log("[v0] Loading appointments from database")
      setApiStatus("Načítám z databáze...")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/reservations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const dbAppointments = await response.json()
        console.log("[v0] Loaded appointments from database:", dbAppointments)
        setApiStatus(`✅ Načteno ${dbAppointments.length} rezervací z databáze`)

        // Convert database format to frontend format
        const formattedAppointments = dbAppointments.map((apt: any) => ({
          id: apt.id,
          title: `${apt.client?.name || "Neznámý klient"} - ${apt.service?.name || "Neznámá služba"}`,
          start: new Date(apt.startTime),
          end: new Date(apt.endTime),
          clientId: apt.clientId,
          therapistId: apt.therapistId,
          serviceId: apt.serviceId,
          status: apt.status,
          notes: apt.notes || "",
        }))

        setAppointments(formattedAppointments)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("[v0] Error loading appointments:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setApiStatus(`❌ Chyba při načítání: ${errorMessage}`)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Kalendář rezervací</h1>
              <p className="text-stone-600">Správa termínů a rezervací pro Salon Harmonie</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button variant="outline" onClick={() => setDebugMode(!debugMode)} className="text-xs">
                {debugMode ? "Skrýt debug" : "Debug režim"}
              </Button>
              <Button variant="outline" onClick={loadAppointmentsFromDatabase} className="text-xs bg-transparent">
                Obnovit z DB
              </Button>
              <Button onClick={() => setIsBookingModalOpen(true)} className="bg-amber-700 hover:bg-amber-800">
                <Plus className="w-4 h-4 mr-2" />
                Nová rezervace
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-stone-200 bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">Dnešní rezervace</CardTitle>
                <Calendar className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-800">{todayStats.total}</div>
                <p className="text-xs text-stone-600">
                  {todayStats.confirmed} potvrzených, {todayStats.pending} čekajících
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">Aktivní terapeuti</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-800">3</div>
                <p className="text-xs text-stone-600">Dnes v provozu</p>
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">Obsazenost</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-800">78%</div>
                <p className="text-xs text-stone-600">Průměr tohoto týdne</p>
              </CardContent>
            </Card>
          </div>

          {debugMode && (
            <Card className="border-amber-200 bg-amber-50 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800">🔍 Debug informace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <strong>API Status:</strong> <span className="ml-2">{apiStatus}</span>
                  </div>
                  <div>
                    <strong>Počet rezervací v paměti:</strong> <span className="ml-2">{appointments.length}</span>
                  </div>
                  <div>
                    <strong>Backend URL:</strong>{" "}
                    <span className="ml-2">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}</span>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Zobrazit raw data rezervací</summary>
                    <pre className="mt-2 p-4 bg-stone-100 rounded text-xs overflow-auto max-h-64">
                      {JSON.stringify(appointments, null, 2)}
                    </pre>
                  </details>
                  <div className="text-sm text-amber-700">
                    <strong>Jak ověřit data v databázi:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Otevřete Developer Tools (F12) → Network tab</li>
                      <li>Vytvořte novou rezervaci a sledujte POST request na /api/reservations</li>
                      <li>Zkontrolujte response - měl by obsahovat ID z databáze</li>
                      <li>Klikněte "Obnovit z DB" pro načtení dat z databáze</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and View Controls */}
          <Card className="border-stone-200 bg-white/80 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-medium text-stone-700">Filtry:</span>
                  </div>

                  <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Vyberte terapeuta" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          {therapist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Vyberte místnost" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-stone-700">Zobrazení:</span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={viewType === "day" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewType("day")}
                      className={viewType === "day" ? "bg-amber-700 hover:bg-amber-800" : ""}
                    >
                      Den
                    </Button>
                    <Button
                      variant={viewType === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewType("week")}
                      className={viewType === "week" ? "bg-amber-700 hover:bg-amber-800" : ""}
                    >
                      Týden
                    </Button>
                    <Button
                      variant={viewType === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewType("month")}
                      className={viewType === "month" ? "bg-amber-700 hover:bg-amber-800" : ""}
                    >
                      Měsíc
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card className="border-stone-200 bg-white/80">
            <CardContent className="p-6">
              <CalendarView
                appointments={filteredAppointments}
                viewType={viewType}
                onAppointmentClick={(appointment) => {
                  console.log("Clicked appointment:", appointment)
                }}
                onTimeSlotClick={(date) => {
                  setSelectedDate(date)
                  setIsBookingModalOpen(true)
                }}
              />
            </CardContent>
          </Card>
        </main>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedDate(null)
          }}
          selectedDate={selectedDate}
          onBookingCreate={async (booking) => {
            try {
              const newAppointment = {
                id: `booking-${Date.now()}`,
                title: `${booking.clientName} - ${booking.serviceName}`,
                start: booking.startTime,
                end: booking.endTime,
                clientId: booking.clientId,
                therapistId: booking.therapistId,
                serviceId: booking.serviceId,
                status: "confirmed" as const,
                notes: booking.notes || "",
              }

              // Save to database
              const savedAppointment = await saveAppointmentToDatabase(newAppointment)

              // Update local state with database response
              setAppointments([
                ...appointments,
                {
                  ...newAppointment,
                  id: savedAppointment.id, // Use database ID
                },
              ])

              setIsBookingModalOpen(false)
              setSelectedDate(null)
            } catch (error) {
              // If database save fails, still add to local state for demo purposes
              console.error("[v0] Database save failed, adding to local state only")
              const newAppointment = {
                id: `local-${Date.now()}`,
                title: `${booking.clientName} - ${booking.serviceName}`,
                start: booking.startTime,
                end: booking.endTime,
                clientId: booking.clientId,
                therapistId: booking.therapistId,
                serviceId: booking.serviceId,
                status: "confirmed" as const,
                notes: booking.notes || "",
              }
              setAppointments([...appointments, newAppointment])
              setIsBookingModalOpen(false)
              setSelectedDate(null)
            }
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
