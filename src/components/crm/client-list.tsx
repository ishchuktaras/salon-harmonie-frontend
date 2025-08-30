// soubor: src/components/crm/client-list.tsx - OPRAVENÁ VERZE

"use client";

import { Client } from "@/lib/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

// Definice props, které komponenta přijímá
interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
}

export default function ClientList({ clients, onEdit }: ClientListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno a Příjmení</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{`${client.firstName} ${client.lastName}`}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Upravit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nebyly nalezeny žádné klienty.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}