// src/app/admin/clients/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Client } from "@/types/client";
import { ClientTable } from "@/components/ClientTable";
import { Modal } from "@/components/Modal";
import { AddClientForm } from "@/components/AddClientForm";

export default function ClientsPage() {
  const { token, logout } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    async function fetchClients() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          setError("Vaše přihlášení vypršelo. Prosím, přihlaste se znovu.");
          setTimeout(() => logout(), 3000);
          return;
        }

        if (!response.ok) {
          throw new Error("Nepodařilo se načíst data o klientech");
        }

        const data: Client[] = await response.json();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Neznámá chyba");
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, [token, logout]);

  const handleClientAdded = (newClient: Client) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="pb-6 flex justify-between items-center">
          <h1 className="font-serif text-3xl font-bold text-brand-primary">
            Správa Klientů
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-md bg-brand-primary text-brand-accent hover:bg-brand-muted transition-colors"
          >
            + Přidat klienta
          </button>
        </div>

        {isLoading && <p className="text-brand-muted">Načítám klienty...</p>}
        {error && <p className="text-red-600">Chyba: {error}</p>}

        {!isLoading && !error && <ClientTable clients={clients} />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Přidat nového klienta"
      >
        <AddClientForm
          onClientAdded={handleClientAdded}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
