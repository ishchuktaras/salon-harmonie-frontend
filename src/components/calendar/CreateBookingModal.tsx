// src/components/calendar/CreateBookingModal.tsx

'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { apiClient } from '@/lib/api/client'
import { Reservation, Client, Service, User } from '@/lib/api/types'

// Schéma pro validaci formuláře
const bookingSchema = z.object({
  clientId: z.string().min(1, 'Klient je povinný.'),
  serviceId: z.string().min(1, 'Služba je povinná.'),
  therapistId: z.string().min(1, 'Terapeut je povinný.'),
  startTime: z.date({ required_error: 'Datum a čas začátku je povinný.' }),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

// OPRAVA: Rozšíření props o `existingReservation`
export interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingCreated: () => void
  initialData?: Partial<BookingFormData>
  existingReservation?: Reservation
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  onBookingCreated,
  initialData,
  existingReservation,
}: CreateBookingModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [therapists, setTherapists] = useState<User[]>([])
  
  const isEditing = !!existingReservation

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      notes: '',
      ...initialData,
    },
  })

  // Předvyplnění formuláře při editaci
  useEffect(() => {
    if (isEditing && existingReservation) {
      form.reset({
        clientId: String(existingReservation.clientId),
        serviceId: String(existingReservation.serviceId),
        therapistId: String(existingReservation.therapistId),
        startTime: new Date(existingReservation.startTime),
        notes: existingReservation.notes || '',
      })
    } else if (initialData) {
       form.reset({
        ...form.getValues(),
        ...initialData,
        startTime: initialData.startTime ? new Date(initialData.startTime) : new Date(),
      })
    }
  }, [isEditing, existingReservation, initialData, form])

  // Načtení dat pro select boxy
  useEffect(() => {
    if(isOpen) {
      apiClient.get<Client[]>('/clients').then(setClients);
      apiClient.get<Service[]>('/services').then(setServices);
      apiClient.get<User[]>('/users').then(setTherapists); // V budoucnu filtrovat jen terapeuty
    }
  }, [isOpen]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const duration = services.find(s => s.id === Number(data.serviceId))?.duration || 60;
      const endTime = new Date(data.startTime.getTime() + duration * 60000);

      const payload = {
        ...data,
        clientId: Number(data.clientId),
        serviceId: Number(data.serviceId),
        therapistId: Number(data.therapistId),
        endTime: endTime.toISOString(),
        startTime: data.startTime.toISOString(),
      };
      
      if (isEditing) {
        // Logika pro úpravu
        await apiClient.patch(`/reservations/${existingReservation.id}`, payload);
      } else {
        // Logika pro vytvoření
        await apiClient.post('/reservations', payload);
      }
      onBookingCreated();
      onClose();
    } catch (error) {
      console.error('Failed to save reservation:', error);
      // Zde můžete přidat zobrazení chyby uživateli
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Upravit rezervaci' : 'Vytvořit novou rezervaci'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Client Select */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Klient</Label>
            <Controller
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Vyberte klienta" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.clientId && <p className="text-sm text-red-500">{form.formState.errors.clientId.message}</p>}
          </div>

           {/* Service Select */}
          <div className="space-y-2">
            <Label htmlFor="serviceId">Služba</Label>
             <Controller
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Vyberte službu" /></SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={String(service.id)}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.serviceId && <p className="text-sm text-red-500">{form.formState.errors.serviceId.message}</p>}
          </div>

           {/* Therapist Select */}
           <div className="space-y-2">
            <Label htmlFor="therapistId">Terapeut</Label>
             <Controller
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Vyberte terapeuta" /></SelectTrigger>
                  <SelectContent>
                    {therapists.map(therapist => (
                      <SelectItem key={therapist.id} value={String(therapist.id)}>
                        {therapist.firstName} {therapist.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.therapistId && <p className="text-sm text-red-500">{form.formState.errors.therapistId.message}</p>}
          </div>

          {/* Start Time */}
          <div className="space-y-2">
             <Label htmlFor="startTime">Datum a čas</Label>
              <Controller
                control={form.control}
                name="startTime"
                render={({ field }) => (
                   <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP HH:mm', { locale: cs }) : <span>Vyberte datum</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                         {/* Jednoduchý výběr času */}
                        <div className="p-2 border-t">
                            <Input 
                                type="time"
                                defaultValue={field.value ? format(field.value, 'HH:mm') : ''}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                    const newDate = new Date(field.value);
                                    newDate.setHours(hours, minutes);
                                    field.onChange(newDate);
                                }}
                            />
                        </div>
                      </PopoverContent>
                    </Popover>
                )}
              />
               {form.formState.errors.startTime && <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>}
          </div>
        
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Zrušit</Button>
            <Button type="submit">{isEditing ? 'Uložit změny' : 'Vytvořit rezervaci'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}