"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, User, Scissors } from "lucide-react"
import { servicesApi } from "@/lib/api/services"
import { clientsApi } from "@/lib/api/clients"
import { therapistsApi } from "@/lib/api/therapists"
import type { Service, Client, Therapist } from "@/lib/api/types"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  onBookingCreate: (booking: {
    clientId: string
    serviceId: string
    therapistId: string
    startTime: Date
    endTime?: Date
    notes?: string
  }) => Promise<void>
}

export function BookingModal({ isOpen, onClose, selectedDate, onBookingCreate }: BookingModalProps) {
  const [services, setServices] = useState<Service[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [selectedService, setSelectedService] = useState("")
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState("")
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [duration, setDuration] = useState("60")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (isOpen) {
      loadData()
      resetForm()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      setLoading(true)
      const [servicesData, clientsData, therapistsData] = await Promise.all([
        servicesApi.getAll(),
        clientsApi.getAll(),
        therapistsApi.getAll(),
      ])

      setServices(servicesData)
      setClients(clientsData)
      setTherapists(therapistsData)
    } catch (error) {
      console.error("[v0] Error loading booking modal data:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedService("")
    setSelectedClient("")
    setSelectedTherapist("")
    setSelectedTime("09:00")
    setDuration("60")
    setNotes("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService || !selectedClient || !selectedTherapist || !selectedDate) {
      return
    }

    try {
      setSubmitting(true)

      // Create start time by combining selected date with selected time
      const [hours, minutes] = selectedTime.split(":").map(Number)
      const startTime = new Date(selectedDate)
      startTime.setHours(hours, minutes, 0, 0)

      // Calculate end time based on duration
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + Number.parseInt(duration))

      console.log("[v0] Creating booking with data:", {
        clientId: selectedClient,
        serviceId: selectedService,
        therapistId: selectedTherapist,
        startTime,
        endTime,
        notes,
      })

      await onBookingCreate({
        clientId: selectedClient,
        serviceId: selectedService,
        therapistId: selectedTherapist,
        startTime,
        endTime,
        notes,
      })

      onClose()
    } catch (error) {
      console.error("[v0] Error creating booking:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleDateString("cs-CZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-stone-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-amber-700" />
            Nová rezervace
          </DialogTitle>
          {selectedDate && <p className="text-sm text-stone-600 mt-2">{formatDate(selectedDate)}</p>}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-medium text-stone-700 flex items-center">
                <Scissors className="w-4 h-4 mr-2" />
                Služba
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService} required>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte službu" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.price} Kč ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-medium text-stone-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Klient
              </Label>
              <Select value={selectedClient} onValueChange={setSelectedClient} required>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte klienta" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} - {client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Therapist Selection */}
            <div className="space-y-2">
              <Label htmlFor="therapist" className="text-sm font-medium text-stone-700">
                Terapeut
              </Label>
              <Select value={selectedTherapist} onValueChange={setSelectedTherapist} required>
                <SelectTrigger>
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
            </div>

            {/* Time and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-stone-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Čas
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-stone-700">
                  Délka (min)
                </Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minut</SelectItem>
                    <SelectItem value="60">60 minut</SelectItem>
                    <SelectItem value="90">90 minut</SelectItem>
                    <SelectItem value="120">120 minut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-stone-700">
                Poznámky
              </Label>
              <Textarea
                id="notes"
                placeholder="Dodatečné informace o rezervaci..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                Zrušit
              </Button>
              <Button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800"
                disabled={submitting || !selectedService || !selectedClient || !selectedTherapist}
              >
                {submitting ? "Ukládám..." : "Vytvořit rezervaci"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
