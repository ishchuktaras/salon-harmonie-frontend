// src/components/crm/client-modal.tsx

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import  apiClient  from "@/lib/api/client"
import { Client } from "@/lib/api/types";

const clientFormSchema = z.object({
  firstName: z.string().min(1, { message: "Jméno je povinné." }),
  lastName: z.string().min(1, { message: "Příjmení je povinné." }),
  email: z.string().email({ message: "Neplatný formát emailu." }),
  phone: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientModalProps { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  client: Client | null 
}

export default function ClientModal({ isOpen, onClose, onSuccess, client }: ClientModalProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = async (values: ClientFormValues) => {
    try {
      await apiClient.post("/clients", values)
      onSuccess() // Zavolá funkci pro obnovení seznamu
      onClose()   // Zavře modální okno
      form.reset()
    } catch (error) {
      console.error("Failed to create client:", error)
      // Zde by se mohla zobrazit chybová notifikace
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Přidat nového klienta</DialogTitle>
          <DialogDescription>
            Vyplňte údaje pro vytvoření nového klienta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Jméno</FormLabel>
                    <FormControl>
                        <Input placeholder="Jan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Příjmení</FormLabel>
                    <FormControl>
                        <Input placeholder="Novák" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jan.novak@email.cz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon (volitelné)</FormLabel>
                  <FormControl>
                    <Input placeholder="+420 123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>Zrušit</Button>
                <Button type="submit">Vytvořit klienta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
