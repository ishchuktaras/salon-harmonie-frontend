"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Clock,
  User,
  AlertCircle, // OPRAVA: Použita správná ikona
  MessageSquare,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

interface ClientProfileProps {
  client: any
  onBack: () => void
  onEdit: () => void
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
}

export function ClientProfile({ client, onBack, onEdit, getStatusColor, getStatusLabel }: ClientProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na seznam
          </Button>
          <div className="h-6 w-px bg-stone-300" />
          <h1 className="text-3xl font-serif font-bold text-stone-800">Profil klienta</h1>
        </div>
        <Button onClick={onEdit} className="bg-amber-700 hover:bg-amber-800">
          <Edit className="w-4 h-4 mr-2" />
          Upravit
        </Button>
      </div>

      {/* Client Header Card */}
      <Card className="border-stone-200 bg-white/80">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-xl">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-800">{client.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(client.status)}>{getStatusLabel(client.status)}</Badge>
                  <span className="text-sm text-stone-500">
                    Klient od {format(new Date(client.registrationDate), "MMMM yyyy", { locale: cs })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">{client.totalVisits}</div>
                <div className="text-sm text-stone-600">Celkem návštěv</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">{client.totalSpent.toLocaleString()} Kč</div>
                <div className="text-sm text-stone-600">Celkem utraceno</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-2xl font-bold text-amber-700">
                  <Star className="w-6 h-6 mr-1 fill-current" />
                  {client.loyaltyPoints}
                </div>
                <div className="text-sm text-stone-600">Věrnostní body</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="history">Historie návštěv</TabsTrigger>
          <TabsTrigger value="preferences">Preference</TabsTrigger>
          <TabsTrigger value="communications">Komunikace</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="border-stone-200 bg-white/80">
              <CardHeader>
                <CardTitle className="font-serif">Kontaktní údaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-800">{client.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-800">{client.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-800">{client.address || "Neuvedena"}</span>
                </div>
                {client.dateOfBirth && (
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-stone-500" />
                        <span className="text-stone-800">
                        {calculateAge(client.dateOfBirth)} let (
                        {format(new Date(client.dateOfBirth), "d. M. yyyy", { locale: cs })})
                        </span>
                    </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-stone-200 bg-white/80">
              <CardHeader>
                <CardTitle className="font-serif">Poslední aktivita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-stone-800">Poslední návštěva</div>
                    <div className="text-sm text-stone-600">
                      {format(new Date(client.lastVisit), "d. MMMM yyyy", { locale: cs })}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-stone-800">Průměrná útrata za návštěvu</div>
                    <div className="text-sm text-stone-600">
                      {client.totalVisits > 0 ? `${Math.round(client.totalSpent / client.totalVisits).toLocaleString()} Kč` : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="border-stone-200 bg-white/80">
            <CardHeader>
              <CardTitle className="font-serif">Historie návštěv</CardTitle>
              <CardDescription>Kompletní přehled všech návštěv klienta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {client.visitHistory.map((visit: any) => (
                  <div key={visit.id} className="flex items-start space-x-4 p-4 bg-stone-50 rounded-lg">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-stone-800">{visit.service}</h4>
                        <Badge variant="secondary">{visit.price} Kč</Badge>
                      </div>
                      <div className="text-sm text-stone-600 space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>📅 {format(new Date(visit.date), "d. MMMM yyyy", { locale: cs })}</span>
                          <span>👤 {visit.therapist}</span>
                          <span>⏱️ {visit.duration} min</span>
                        </div>
                        {visit.notes && (
                          <div className="mt-2 p-2 bg-white rounded border-l-4 border-amber-200">
                            <span className="text-xs font-medium text-amber-800">Poznámka:</span>
                            <p className="text-sm text-stone-700 mt-1">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-stone-200 bg-white/80">
              <CardHeader>
                <CardTitle className="font-serif">Preference služeb</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-stone-700 mb-1">Preferovaný tlak při masáži</div>
                  <Badge variant="secondary">{client.preferences.massagePressure}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-stone-700 mb-1">Oblíbený terapeut</div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-800">
                      {client.preferences.favoriteTherapist || "Není specifikován"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/80">
              <CardHeader>
                <CardTitle className="font-serif">Zdravotní informace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-stone-700 mb-2">Alergie</div>
                  {client.preferences.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {client.preferences.allergies.map((allergy: string, index: number) => (
                        <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-600 text-sm">Žádné známé alergie</span>
                  )}
                </div>
                {client.preferences.notes && (
                  <div>
                    <div className="text-sm font-medium text-stone-700 mb-2">Poznámky</div>
                    <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-200">
                      <p className="text-sm text-stone-700">{client.preferences.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <Card className="border-stone-200 bg-white/80">
            <CardHeader>
              <CardTitle className="font-serif">Historie komunikace</CardTitle>
              <CardDescription>E-maily, SMS a další komunikace s klientem</CardDescription>
            </CardHeader>
            <CardContent>
              {client.communications.length > 0 ? (
                <div className="space-y-4">
                  {client.communications.map((comm: any) => (
                    <div key={comm.id} className="flex items-start space-x-4 p-4 bg-stone-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-stone-800">{comm.subject}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {comm.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-stone-600">
                          {format(new Date(comm.date), "d. MMMM yyyy 'v' HH:mm", { locale: cs })} •{" "}
                          <span className="capitalize">{comm.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-800 mb-2">Žádná komunikace</h3>
                  <p className="text-stone-600">S tímto klientem zatím nebyla zaznamenána žádná komunikace.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
