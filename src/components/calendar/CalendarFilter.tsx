"use client"

import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import apiClient from "@/lib/api/client"
import { type User, TimeBlockType } from "@/lib/api/types"
import { timeBlocksApi } from "@/lib/api/time-blocks"

const blockSchema = z
  .object({
    therapistId: z.string().min(1, "Terapeut je povinný."),
    startTime: z.date({
      message: "Datum a čas začátku je povinný.",
    }),
    endTime: z.date({
      message: "Datum a čas konce je povinný.",
    }),
    type: z.nativeEnum(TimeBlockType, {
      message: "Typ blokace je povinný.",
    }),
    reason: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Čas konce musí být po času začátku.",
    path: ["endTime"],
  })

type BlockFormValues = z.infer<typeof blockSchema>

interface CreateBlockModalProps {
  isOpen: boolean
  onClose: () => void
  onBlockCreated: () => void
  initialData?: Partial<BlockFormValues>
}

export default function CreateBlockModal({ isOpen, onClose, onBlockCreated, initialData }: CreateBlockModalProps) {
  const [therapists, setTherapists] = useState<User[]>([])

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      reason: "",
      ...initialData,
    },
  })

  useEffect(() => {
    if (isOpen) {
      apiClient.get<User[]>("/users?role=TERAPEUT,MASER").then((response) => setTherapists(response.data))
    }
  }, [isOpen])

  const onSubmit: SubmitHandler<BlockFormValues> = async (data) => {
    try {
      const payload = {
        therapistId: Number(data.therapistId),
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        type: data.type,
        reason: data.reason,
      }

      await timeBlocksApi.create(payload)
      onBlockCreated()
      onClose()
      form.reset()
    } catch (error) {
      console.error("Nepodařilo se vytvořit časový blok:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vytvořit časový blok</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="therapistId">Terapeut</Label>
            <Controller
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
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
              )}
            />
            {form.formState.errors.therapistId && (
              <p className="text-sm text-red-500">{form.formState.errors.therapistId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Typ blokace</Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ blokace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TimeBlockType.BREAK}>Přestávka</SelectItem>
                    <SelectItem value={TimeBlockType.VACATION}>Dovolená</SelectItem>
                    <SelectItem value={TimeBlockType.SICK_LEAVE}>Nemocenská</SelectItem>
                    <SelectItem value={TimeBlockType.OTHER}>Jiné</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.type && <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Začátek</Label>
              <Controller
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP HH:mm", { locale: cs }) : <span>Vyberte datum</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      <div className="p-2 border-t">
                        <Input
                          type="time"
                          defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            if (!field.value) return
                            const [hours, minutes] = e.target.value.split(":").map(Number)
                            const newDate = new Date(field.value)
                            newDate.setHours(hours, minutes)
                            field.onChange(newDate)
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Konec</Label>
              <Controller
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP HH:mm", { locale: cs }) : <span>Vyberte datum</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      <div className="p-2 border-t">
                        <Input
                          type="time"
                          defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            if (!field.value) return
                            const [hours, minutes] = e.target.value.split(":").map(Number)
                            const newDate = new Date(field.value)
                            newDate.setHours(hours, minutes)
                            field.onChange(newDate)
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.endTime && (
                <p className="text-sm text-red-500">{form.formState.errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Důvod (volitelné)</Label>
            <Controller
              control={form.control}
              name="reason"
              render={({ field }) => <Textarea {...field} placeholder="Zadejte důvod blokace..." rows={3} />}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button type="submit">Vytvořit blok</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
