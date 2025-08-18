// src/components/crm/client-modal.tsx

"use client"

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
import { Input } from "@/components/ui/input"

// Schéma pro validaci formuláře
const formSchema = z.object({
  firstName: z.string().min(1, "Jméno je povinné."),
  lastName: z.string().min(1, "Příjmení je povinné."),
  email: z.string().email("Neplatný formát e-mailu."),
  phone: z.string().optional(),
})

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onClientCreated: () => void // Funkce pro obnovení seznamu klientů
}

export function ClientModal({
  isOpen,
  onClose,
  onClientCreated,
}: ClientModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.post("/clients", values)
      onClientCreated() // Zavoláme funkci pro obnovení seznamu
      onClose() // Zavřeme modal
      form.reset() // Resetujeme formulář
    } catch (error) {
      console.error("Failed to create client:", error)
      // Zde by se mohla zobrazit chybová hláška pro uživatele
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Přidat nového klienta</DialogTitle>
          <DialogDescription>
            Vyplňte údaje pro vytvoření nového klienta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Zrušit
              </Button>
              <Button type="submit">Vytvořit klienta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
