// src/app/(app)/clients/page.tsx

"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Users } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Definujeme typ pro klienta podle vašeho Prisma schématu
interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiClient.get<Client[]>("/clients")
      setClients(data)
    } catch (err) {
      console.error("Failed to fetch clients:", err)
      setError("Nepodařilo se načíst data klientů. Zkuste to prosím znovu.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Chyba při načítání klientů
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Button onClick={fetchClients}>Zkusit znovu</Button>
          </div>
        </div>
      )
    }

    if (clients.length === 0) {
      return (
        <div className="text-center py-16">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Žádní klienti
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Začněte tím, že přidáte svého prvního klienta.
          </p>
          <div className="mt-6">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Přidat klienta
            </Button>
          </div>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Vytvořen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                {client.firstName} {client.lastName}
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone || "-"}</TableCell>
              <TableCell>
                {new Date(client.createdAt).toLocaleDateString("cs-CZ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">
            Klienti
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Seznam všech klientů ve vašem systému.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Přidat klienta
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">{renderContent()}</CardContent>
      </Card>
    </div>
  )
}
