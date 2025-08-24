"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Client } from "@/lib/api/types"
import { apiClient } from "@/lib/api/client"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

export default function ClientList() {
  const [clients, setClients] = React.useState<Client[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await apiClient.get<Client[]>("/clients")
        setClients(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch clients:", err)
        setError("Nepodařilo se načíst data klientů.")
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  )

  if (loading) {
    return <div className="text-center p-8">Načítání klientů...</div>
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className="py-4">
        <Input
          placeholder="Hledat podle jména, emailu nebo telefonu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jméno</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Datum registrace</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.firstName} {client.lastName}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell>
                    {format(new Date(client.createdAt), "d. M. yyyy", {
                      locale: cs,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Žádní klienti nenalezeni.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
