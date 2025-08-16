"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, Edit, Phone, Mail, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  lastVisit: string
  totalVisits: number
  totalSpent: number
  loyaltyPoints: number
  status: string
}

interface ClientListProps {
  clients: Client[]
  onClientSelect: (clientId: string) => void
  onClientEdit: (clientId: string) => void
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
}

export function ClientList({ clients, onClientSelect, onClientEdit, getStatusColor, getStatusLabel }: ClientListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      {clients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-stone-400 mb-4">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-stone-800 mb-2">Žádní klienti nenalezeni</h3>
          <p className="text-stone-600">Zkuste změnit vyhledávací kritéria nebo přidat nového klienta.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Klient</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Poslední návštěva</TableHead>
              <TableHead>Návštěvy</TableHead>
              <TableHead>Utraceno</TableHead>
              <TableHead>Body</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-stone-50 cursor-pointer">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-amber-100 text-amber-800 font-medium">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-stone-800">{client.name}</div>
                      <div className="text-sm text-stone-500">ID: {client.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-stone-600">
                      <Mail className="w-3 h-3 mr-1" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-stone-600">
                      <Phone className="w-3 h-3 mr-1" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(client.status)}>{getStatusLabel(client.status)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-stone-800">
                    {format(new Date(client.lastVisit), "d. M. yyyy", { locale: cs })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-stone-800">{client.totalVisits}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-stone-800">{client.totalSpent.toLocaleString()} Kč</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-amber-700">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {client.loyaltyPoints}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onClientSelect(client.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Zobrazit profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onClientEdit(client.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Upravit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
