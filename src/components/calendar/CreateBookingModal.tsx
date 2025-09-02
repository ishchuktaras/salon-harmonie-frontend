'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useApi } from '@/hooks/useApi'
import { Client, Service, Therapist, CreateReservationDto, User } from '@/lib/api/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingCreated: () => void
  initialData?: { startTime: Date }
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  onBookingCreated,
  initialData,
}: CreateBookingModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  // OPRAVA: Typ stavu byl změněn z User[] na Therapist[], aby odpovídal načítaným datům.
  const [therapists, setTherapists] = useState<Therapist[]>([])

  const [selectedClient, setSelectedClient] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedTherapist, setSelectedTherapist] = useState<string>('')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const api = useApi()

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const [clientsData, servicesData, therapistsData] = await Promise.all([
            api.apiFetch<Client[]>('/clients'),
            api.apiFetch<Service[]>('/services'),
            api.apiFetch<Therapist[]>('/therapists'), // Tento endpoint vrací Therapist[]
          ])
          setClients(clientsData)
          setServices(servicesData)
          setTherapists(therapistsData)
        } catch (err) {
          setError('Nepodařilo se načíst data pro formulář.')
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isOpen, api])

  const handleSubmit = async () => {
    if (!selectedClient || !selectedService || !selectedTherapist || !initialData) {
      setError('Všechna pole jsou povinná.')
      return
    }

    setLoading(true)
    setError(null)

    const service = services.find(s => s.id === parseInt(selectedService));
    if (!service) {
      setError("Vybraná služba nebyla nalezena.");
      setLoading(false);
      return;
    }

    const reservationData: CreateReservationDto = {
      clientId: parseInt(selectedClient),
      serviceId: parseInt(selectedService),
      therapistId: parseInt(selectedTherapist),
      startTime: initialData.startTime.toISOString(),
      notes: notes,
    }

    try {
      await api.apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData),
      })
      onBookingCreated()
      onClose()
    } catch (err) {
      setError('Vytvoření rezervace selhalo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vytvořit novou rezervaci</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Client Select */}
          <div className="space-y-2">
            <Label htmlFor="client">Klient</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Vyberte klienta" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.firstName} {client.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Select */}
          <div className="space-y-2">
            <Label htmlFor="service">Služba</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Vyberte službu" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Therapist Select */}
          <div className="space-y-2">
            <Label htmlFor="therapist">Terapeut</Label>
            <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
              <SelectTrigger id="therapist">
                <SelectValue placeholder="Vyberte terapeuta" />
              </SelectTrigger>
              <SelectContent>
                {therapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={String(therapist.id)}>
                    {therapist.firstName} {therapist.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zde můžete přidat poznámky k rezervaci..."
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Chyba</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Zrušit
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Vytváření...' : 'Vytvořit rezervaci'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

