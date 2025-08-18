// src/app/booking/page.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Leaf, Clock, User, CheckCircle, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import Link from "next/link"

const services = [
  {
    id: "massage",
    name: "Relaxační masáž",
    duration: 60,
    price: 800,
    description: "Uvolňující masáž celého těla s aromatickými oleji",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "facial",
    name: "Kosmetické ošetření",
    duration: 90,
    price: 1200,
    description: "Kompletní péče o pleť s čištěním a hydratací",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "sauna",
    name: "Sauna",
    duration: 60,
    price: 300,
    description: "Relaxace v tradiční finské sauně",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "aromatherapy",
    name: "Aromaterapie",
    duration: 45,
    price: 600,
    description: "Terapie s esenciálními oleji pro tělo i duši",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const therapists = [
  { id: "anna", name: "Anna Krásná", specialization: "Masáže a wellness" },
  { id: "pavel", name: "Pavel Wellness", specialization: "Kosmetika a péče o pleť" },
  { id: "lucie", name: "Lucie Harmonie", specialization: "Aromaterapie a relaxace" },
]

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    // TODO: Submit booking to backend
    setIsSubmitted(true)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService
      case 2:
        return selectedTherapist
      case 3:
        return selectedDate && selectedTime
      case 4:
        return clientName && clientPhone && clientEmail
      default:
        return false
    }
  }

  const getSelectedService = () => services.find((s) => s.id === selectedService)
  const getSelectedTherapist = () => therapists.find((t) => t.id === selectedTherapist)

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif text-stone-800">Rezervace potvrzena!</CardTitle>
            <CardDescription>Vaše rezervace byla úspěšně vytvořena</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-stone-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-600">Služba:</span>
                <span className="font-medium">{getSelectedService()?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Terapeut:</span>
                <span className="font-medium">{getSelectedTherapist()?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Datum:</span>
                <span className="font-medium">{selectedDate && format(selectedDate, "PPP", { locale: cs })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Čas:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Cena:</span>
                <span className="font-medium">{getSelectedService()?.price} Kč</span>
              </div>
            </div>
            <p className="text-sm text-stone-600 text-center">Potvrzovací e-mail byl odeslán na adresu {clientEmail}</p>
            <div className="flex space-x-2">
              <Button asChild className="flex-1 bg-amber-700 hover:bg-amber-800">
                <Link href="/">Zpět na hlavní stránku</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
              <Leaf className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-stone-800">Salon Harmonie</h1>
              <p className="text-sm text-stone-600">Online rezervace</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[
              { step: 1, label: "Služba" },
              { step: 2, label: "Terapeut" },
              { step: 3, label: "Datum & Čas" },
              { step: 4, label: "Kontakt" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    item.step <= step ? "bg-amber-700 text-white" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {item.step}
                </div>
                <span className="ml-2 text-sm font-medium text-stone-700">{item.label}</span>
                {index < 3 && <ArrowRight className="w-4 h-4 text-stone-400 mx-4" />}
              </div>
            ))}
          </div>

          <Card className="border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-stone-800">
                {step === 1 && "Vyberte službu"}
                {step === 2 && "Vyberte terapeuta"}
                {step === 3 && "Vyberte datum a čas"}
                {step === 4 && "Kontaktní údaje"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Jakou službu si přejete rezervovat?"}
                {step === 2 && "Který terapeut by se vám líbil?"}
                {step === 3 && "Kdy byste chtěli přijít?"}
                {step === 4 && "Zadejte své kontaktní údaje pro potvrzení"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedService === service.id ? "ring-2 ring-amber-500 bg-amber-50" : ""
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-serif font-semibold text-stone-800">{service.name}</h3>
                          <Badge variant="secondary">{service.price} Kč</Badge>
                        </div>
                        <p className="text-sm text-stone-600 mb-2">{service.description}</p>
                        <div className="flex items-center text-sm text-stone-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration} minut
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 2: Therapist Selection */}
              {step === 2 && (
                <div className="grid md:grid-cols-3 gap-4">
                  {therapists.map((therapist) => (
                    <Card
                      key={therapist.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTherapist === therapist.id ? "ring-2 ring-amber-500 bg-amber-50" : ""
                      }`}
                      onClick={() => setSelectedTherapist(therapist.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-8 h-8 text-stone-600" />
                        </div>
                        <h3 className="font-serif font-semibold text-stone-800 mb-2">{therapist.name}</h3>
                        <p className="text-sm text-stone-600">{therapist.specialization}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 3: Date and Time Selection */}
              {step === 3 && (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Vyberte datum</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border border-stone-200"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-4 block">Dostupné časy</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className={selectedTime === time ? "bg-amber-700 hover:bg-amber-800" : ""}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Information */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Jméno a příjmení *</Label>
                      <Input
                        id="name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Vaše jméno"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+420 123 456 789"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="vas.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Poznámky (volitelné)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Speciální požadavky, alergie, preference..."
                      rows={3}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-stone-50 p-4 rounded-lg">
                    <h3 className="font-serif font-semibold text-stone-800 mb-3">Shrnutí rezervace</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Služba:</span>
                        <span className="font-medium">{getSelectedService()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Terapeut:</span>
                        <span className="font-medium">{getSelectedTherapist()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Datum:</span>
                        <span className="font-medium">
                          {selectedDate && format(selectedDate, "PPP", { locale: cs })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Čas:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between border-t border-stone-200 pt-2">
                        <span className="text-stone-600">Celková cena:</span>
                        <span className="font-bold text-lg">{getSelectedService()?.price} Kč</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6 border-t border-stone-200">
                <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                  Zpět
                </Button>
                <Button
                  onClick={step === 4 ? handleSubmit : handleNext}
                  disabled={!canProceed()}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  {step === 4 ? "Potvrdit rezervaci" : "Další"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
