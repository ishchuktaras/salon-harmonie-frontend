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
import { reservationsApi } from "@/lib/api/reservations"
import { servicesApi } from "@/lib/api/services"
import { clientsApi } from "@/lib/api/clients"
import { therapistsApi } from "@/lib/api/therapists"
import type { Reservation, Service, Client, Therapist } from "@/lib/api/types"

const rooms = [
  { id: "all", name: "Všechny místnosti" },
  { id: "room-1", name: "Masérna 1" },
  { id: "room-2", name: "Masérna 2" },
  { id: "room-3", name: "Kosmetika" },
  { id: "room-4", name: "Sauna" },
]

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Reservation[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [viewType, setViewType] = useState<"day" | "week" | "month">("week")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setApiStatus("Načítám data...")

      // Load all data in parallel
      const [reservationsData, servicesData, clientsData] = await Promise.all([
        reservationsApi.getAll(),
        servicesApi.getAll(),
        clientsApi.getAll(),
      ])

      setAppointments(reservationsData)
      setServices(servicesData)
      setClients(clientsData)

      // Load therapists from therapists API
      if (servicesData.length > 0) {
        const therapistsData = await therapistsApi.getAll()
        setTherapists([
          {
            id: "all",
            firstName: "Všichni",
            lastName: "terapeuti",
            email: "",
            phone: "",
            specializations: [],
            isActive: true,
            workingHours: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...therapistsData,
        ])
      }

      setApiStatus(
        `✅ Načteno ${reservationsData.length} rezervací, ${servicesData.length} služeb, ${clientsData.length} klientů`,
      )
    } catch (error) {
      console.error("[v0] Error loading initial data:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setApiStatus(`❌ Chyba při načítání: ${errorMessage}`)

      // Fallback to mock data if API fails
      setAppointments([])
      setServices([])
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const saveAppointmentToDatabase = async (appointmentData: any) => {
    try {
      console.log("[v0] Saving appointment to database:", appointmentData)
      setApiStatus("Ukládám do databáze...")

      const savedReservation = await reservationsApi.create({
        clientId: appointmentData.clientId,
        serviceId: appointmentData.serviceId,
        therapistId: appointmentData.therapistId,
        startTime: appointmentData.start.toISOString(),
        endTime: appointmentData.end
          ? appointmentData.end.toISOString()
          : new Date(appointmentData.start.getTime() + 60 * 60 * 1000).toISOString(), // Default to 1 hour if no end time
        notes: appointmentData.notes,
      })

      console.log("[v0] Appointment saved successfully:", savedReservation)
      setApiStatus(`✅ Rezervace uložena do databáze (ID: ${savedReservation.id})`)
      return savedReservation
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

      const dbReservations = await reservationsApi.getAll()

      console.log("[v0] Loaded appointments from database:", dbReservations)
      setApiStatus(`✅ Načteno ${dbReservations.length} rezervací z databáze`)

      setAppointments(dbReservations)
    } catch (error) {
      console.error("[v0] Error loading appointments:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setApiStatus(`❌ Chyba při načítání: ${errorMessage}`)
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedTherapist !== "all" && appointment.therapistId !== selectedTherapist) {
      return false
    }
    return true
  })

  const todayStats = {
    total: appointments.filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.startTime)
      return aptDate.toDateString() === today.toDateString()
    }).length,
    confirmed: appointments.filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.startTime)
      return aptDate.toDateString() === today.toDateString() && apt.status === "confirmed"
    }).length,
    pending: appointments.filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.startTime)
      return aptDate.toDateString() === today.toDateString() && apt.status === "pending"
    }).length,
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
                <p className="text-stone-600">Načítám kalendář...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
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
                <div className="text-2xl font-bold text-stone-800">{therapists.length - 1}</div>
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
                    <strong>Počet rezervací:</strong> <span className="ml-2">{appointments.length}</span>
                  </div>
                  <div>
                    <strong>Počet služeb:</strong> <span className="ml-2">{services.length}</span>
                  </div>
                  <div>
                    <strong>Počet klientů:</strong> <span className="ml-2">{clients.length}</span>
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
                          {therapist.firstName} {therapist.lastName}
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
                appointments={filteredAppointments.map((apt) => ({
                  id: apt.id,
                  title: `${apt.client?.firstName || "Neznámý"} ${apt.client?.lastName || "klient"} - ${apt.service?.name || "Neznámá služba"}`,
                  start: new Date(apt.startTime),
                  end: new Date(apt.endTime),
                  clientId: apt.clientId,
                  therapistId: apt.therapistId,
                  serviceId: apt.serviceId,
                  status: apt.status,
                  notes: apt.notes || "",
                }))}
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
              const newReservationData = {
                clientId: booking.clientId,
                serviceId: booking.serviceId,
                therapistId: booking.therapistId,
                start: booking.startTime,
                end: booking.endTime || new Date(booking.startTime.getTime() + 60 * 60 * 1000), // Default to 1 hour
                notes: booking.notes || "",
              }

              // Save to database
              const savedReservation = await saveAppointmentToDatabase(newReservationData)

              await loadInitialData()

              setIsBookingModalOpen(false)
              setSelectedDate(null)
            } catch (error) {
              console.error("[v0] Failed to create reservation:", error)
              // Modal will show error message
            }
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
