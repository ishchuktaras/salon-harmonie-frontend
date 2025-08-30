// súbor: src/app/(app)/clients/page.tsx - OPRAVENÁ VERZIA

"use client";

import { useState, useEffect, useCallback } from "react";
import { Client } from "@/lib/api/types";
import { clientsApi } from "@/lib/api/clients";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ClientList from "@/components/crm/client-list";
import ClientModal from "@/components/crm/client-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (error) {
      console.error("Nepodarilo sa načítať klientov:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleCreateClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    fetchClients(); // Znovu načítať dáta po úspešnej operácii
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title="Správa klientov"
        description="Prehľad všetkých klientov vo vašom systéme."
      >
        <Button onClick={handleCreateClient}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Vytvoriť klienta
        </Button>
      </PageHeader>

      <ClientList clients={clients} onEdit={handleEditClient} />

      
      {/* Modálne okno je teraz vždy v DOMe, iba sa mení jeho viditeľnosť */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        client={selectedClient}
      />
    </>
  );
}