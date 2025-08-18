// src/components/calendar/booking-modal.tsx

"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// OPRAVA 1: Správný název ikony je 'Calendar'
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Definice typů pro data z API
interface Client {
  id: number
  firstName: string
  lastName: string
}
interface Service {
  id: number
  name: string
  duration: number
}
interface Therapist {
  id: number
  firstName: string
  lastName: string
}

// Schéma pro validaci formuláře
const formSchema = z.object({
  clientId: z.string().min(1, "Klient je povinný."),
  serviceId: z.string().min(1, "Služba je povinná."),
  therapistId: z.string().min(1, "Terapeut je povinný."),
  // OPRAVA 2: Správný způsob, jak nastavit validační hlášku pro datum
  startTime: z.date().min(new Date("1900-01-01"), {
    message: "Datum a čas začátku je povinný.",
  }),
  notes: z.string().optional(),
})

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingCreated: () => void // Funkce pro obnovení dat v kalendáři
}

export function BookingModal({
  isOpen,
  onClose,
  onBookingCreated,
}: BookingModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [therapists, setTherapists] = useState<Therapist[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // Načtení dat pro select boxy, když se modal otevře
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [clientsData, servicesData, therapistsData] = await Promise.all([
            apiClient.get<Client[]>("/clients"),
            apiClient.get<Service[]>("/services"),
            apiClient.get<Therapist[]>("/users"),
          ])
          setClients(clientsData)
          setServices(servicesData)
          const filteredTherapists = therapistsData.filter(
            (u: any) => u.role === "TERAPEUT" || u.role === "MASER",
          )
          setTherapists(filteredTherapists)
        } catch (error) {
          console.error("Failed to fetch data for booking modal:", error)
        }
      }
      fetchData()
    }
  }, [isOpen])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedService = services.find((s) => s.id === +values.serviceId)
      if (!selectedService) {
        throw new Error("Služba nebyla nalezena")
      }

      const endTime = new Date(
        values.startTime.getTime() + selectedService.duration * 60000,
      )

      await apiClient.post("/reservations", {
        clientId: parseInt(values.clientId),
        serviceId: parseInt(values.serviceId),
        therapistId: parseInt(values.therapistId),
        startTime: values.startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: values.notes,
      })

      onBookingCreated()
      onClose()
      form.reset()
    } catch (error) {
      console.error("Failed to create reservation:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nová rezervace</DialogTitle>
          <DialogDescription>
            Vyplňte údaje pro vytvoření nové rezervace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte klienta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem
                          key={client.id}
                          value={String(client.id)}
                        >
                          {client.firstName} {client.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Služba</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte službu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={String(service.id)}
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terapeut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte terapeuta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem
                          key={therapist.id}
                          value={String(therapist.id)}
                        >
                          {therapist.firstName} {therapist.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Datum a čas začátku</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Vyberte datum</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poznámky</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Volitelné poznámky k rezervaci..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Zrušit
              </Button>
              <Button type="submit">Vytvořit rezervaci</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
