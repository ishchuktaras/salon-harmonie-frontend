"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { CalendarIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  onBookingCreate: (booking: BookingData) => void
}

interface BookingData {
  clientId: string
  clientName: string
  therapistId: string
  serviceId: string
  serviceName: string
  startTime: Date
  endTime: Date
  notes?: string
}

const mockClients = [
  { id: "client-1", name: "Jana Nováková", phone: "+420 123 456 789", email: "jana@email.cz" },
  { id: "client-2", name: "Petr Svoboda", phone: "+420 987 654 321", email: "petr@email.cz" },
  { id: "client-3", name: "Marie Dvořáková", phone: "+420 555 123 456", email: "marie@email.cz" },
]

const mockTherapists = [
  { id: "therapist-1", name: "Anna Krásná", specialization: "Masáže" },
  { id: "therapist-2", name: "Pavel Wellness", specialization: "Kosmetika" },
  { id: "therapist-3", name: "Lucie Harmonie", specialization: "Wellness" },
]

const mockServices = [
  { id: "service-1", name: "Relaxační masáž", duration: 60, price: 800 },
  { id: "service-2", name: "Kosmetické ošetření", duration: 90, price: 1200 },
  { id: "service-3", name: "Sauna", duration: 60, price: 300 },
  { id: "service-4", name: "Aromaterapie", duration: 45, price: 600 },
]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]

export function BookingModal({ isOpen, onClose, selectedDate, onBookingCreate }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [bookingDate, setBookingDate] = useState<Date | undefined>(selectedDate || undefined)
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [isNewClient, setIsNewClient] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      setBookingDate(selectedDate)
    }
  }, [selectedDate])

  const resetForm = () => {
    setStep(1)
    setSelectedClient("")
    setSelectedTherapist("")
    setSelectedService("")
    setSelectedTime("")
    setNotes("")
    setNewClientName("")
    setNewClientPhone("")
    setNewClientEmail("")
    setIsNewClient(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

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
    if (!bookingDate || !selectedTime || !selectedService) return

    const service = mockServices.find((s) => s.id === selectedService)
    const client = isNewClient
      ? { id: `new-${Date.now()}`, name: newClientName }
      : mockClients.find((c) => c.id === selectedClient)

    if (!service || !client) return

    const [hours, minutes] = selectedTime.split(":").map(Number)
    const startTime = new Date(bookingDate)
    startTime.setHours(hours, minutes, 0, 0)

    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + service.duration)

    const bookingData: BookingData = {
      clientId: client.id,
      clientName: client.name,
      therapistId: selectedTherapist,
      serviceId: selectedService,
      serviceName: service.name,
      startTime,
      endTime,
      notes,
    }

    onBookingCreate(bookingData)
    resetForm()
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingDate && selectedService
      case 2:
        return selectedTherapist
      case 3:
        return selectedTime
      case 4:
        return isNewClient ? newClientName && newClientPhone : selectedClient
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Nová rezervace</DialogTitle>
          <DialogDescription>Krok {step} ze 4: Vytvořte novou rezervace pro klienta</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i <= step ? "bg-amber-700 text-white" : "bg-stone-200 text-stone-600",
                )}
              >
                {i}
              </div>
            ))}
          </div>

          {/* Step 1: Service and Date */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Služba</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte službu" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <span className="text-sm text-stone-500 ml-2">
                            {service.duration} min • {service.price} Kč
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? format(bookingDate, "PPP", { locale: cs }) : "Vyberte datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Step 2: Therapist */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="therapist">Terapeut</Label>
                <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte terapeuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTherapists.map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div>{therapist.name}</div>
                            <div className="text-sm text-stone-500">{therapist.specialization}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Čas</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
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

          {/* Step 4: Client */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant={!isNewClient ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsNewClient(false)}
                  className={!isNewClient ? "bg-amber-700 hover:bg-amber-800" : ""}
                >
                  Existující klient
                </Button>
                <Button
                  variant={isNewClient ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsNewClient(true)}
                  className={isNewClient ? "bg-amber-700 hover:bg-amber-800" : ""}
                >
                  Nový klient
                </Button>
              </div>

              {isNewClient ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="newClientName">Jméno a příjmení</Label>
                    <Input
                      id="newClientName"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Zadejte jméno klienta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newClientPhone">Telefon</Label>
                    <Input
                      id="newClientPhone"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      placeholder="+420 123 456 789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newClientEmail">E-mail</Label>
                    <Input
                      id="newClientEmail"
                      type="email"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      placeholder="klient@email.cz"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="client">Klient</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte klienta" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div>
                            <div>{client.name}</div>
                            <div className="text-sm text-stone-500">{client.phone}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={step === 1 ? handleClose : handlePrevious}>
              {step === 1 ? "Zrušit" : "Zpět"}
            </Button>
            <Button
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={!canProceed()}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {step === 4 ? "Vytvořit rezervaci" : "Další"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
