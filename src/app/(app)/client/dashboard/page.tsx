"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Phone, Star, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ClientDashboard() {
  const { user } = useAuth()

  const upcomingAppointments = [
    {
      id: "1",
      service: "Relaxační masáž",
      therapist: "Anna Krásná",
      date: "2024-01-20",
      time: "14:00",
      duration: "60 min",
      status: "confirmed",
    },
    {
      id: "2",
      service: "Sportovní masáž",
      therapist: "Anna Krásná",
      date: "2024-01-25",
      time: "16:30",
      duration: "50 min",
      status: "pending",
    },
  ]

  const recentVisits = [
    {
      id: "1",
      service: "Lymfatická masáž",
      therapist: "Anna Krásná",
      date: "2024-01-10",
      rating: 5,
    },
    {
      id: "2",
      service: "Relaxační masáž",
      therapist: "Anna Krásná",
      date: "2024-01-05",
      rating: 4,
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#3C3633]">Vítejte, {user?.firstName}!</h1>
        <p className="text-[#6A5F5A] mt-2">Přehled vašich rezervací a historie návštěv</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#6A5F5A]" />
              Rychlé akce
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-[#6A5F5A] hover:bg-[#3C3633] text-[#E1D7C6]">Rezervovat termín</Button>
            <Button variant="outline" className="w-full bg-transparent">
              Zobrazit služby
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Kontaktovat salon
            </Button>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#6A5F5A]" />
              Můj profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Jméno:</strong> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Celkem návštěv:</strong> 12
            </p>
            <p>
              <strong>Věrnostní body:</strong> 240
            </p>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#6A5F5A]" />
              Kontakt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+420 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                Wellness Harmonie
                <br />
                Praha 1, Náměstí 123
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Nadcházející rezervace</CardTitle>
            <CardDescription>Vaše plánované návštěvy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{appointment.service}</h3>
                    <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                      {appointment.status === "confirmed" ? "Potvrzeno" : "Čeká na potvrzení"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6A5F5A] mb-1">Terapeut: {appointment.therapist}</p>
                  <div className="flex items-center gap-4 text-sm text-[#6A5F5A]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.time} ({appointment.duration})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Nedávné návštěvy</CardTitle>
            <CardDescription>Historie vašich posledních návštěv</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{visit.service}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < visit.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#6A5F5A] mb-1">Terapeut: {visit.therapist}</p>
                  <div className="flex items-center gap-1 text-sm text-[#6A5F5A]">
                    <Calendar className="h-4 w-4" />
                    {visit.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
