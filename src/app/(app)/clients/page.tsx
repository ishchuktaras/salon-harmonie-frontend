"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClientList from "@/components/crm/client-list"
import { CreateClientModal } from "@/components/crm/client-modal"

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  // Klíč pro re-renderování seznamu klientů po přidání nového
  const [clientListKey, setClientListKey] = React.useState(0)

  const handleClientCreated = () => {
    setClientListKey(prevKey => prevKey + 1)
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <div className="flex flex-col w-full">
            <CardTitle className="font-serif">Klienti</CardTitle>
            <CardDescription>Seznam všech klientů ve vašem systému.</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Přidat klienta
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <ClientList key={clientListKey} />
        </CardContent>
      </Card>
      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleClientCreated}
      />
    </div>
  )
}
