// Tento soubor vytvoříš v: frontend/src/app/admin/clients/[id]/page.tsx
// Díky [id] v názvu složky bude Next.js vědět, že se jedná o dynamickou stránku.

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// --- Definice typů dat ---
interface OrderItem {
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

// --- Hlavní komponenta stránky ---
export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Tento token budeme v budoucnu získávat z přihlášení
        const tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QubWFuYXplckBleGFtcGxlLmNvbSIsInN1YiI6Miwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTUxMDc1MjIsImV4cCI6MTc1NTExMTEyMn0.SqJb6KT0XfYviH4hvROPC6DnKZpEVDTEca5GMi2XHsM";

        // Stáhneme data o klientovi a jeho objednávkách najednou
        const [clientResponse, ordersResponse] = await Promise.all([
          fetch(`http://localhost:3000/clients/${clientId}`, {
            headers: { Authorization: `Bearer ${tempToken}` },
          }),
          fetch(`http://localhost:3000/clients/${clientId}/orders`, {
            headers: { Authorization: `Bearer ${tempToken}` },
          }),
        ]);

        if (!clientResponse.ok || !ordersResponse.ok) {
          throw new Error("Nepodařilo se načíst data z API.");
        }

        const clientData: Client = await clientResponse.json();
        const ordersData: Order[] = await ordersResponse.json();

        setClient(clientData);
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Neznámá chyba");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [clientId]);

  if (isLoading)
    return (
      <p className="p-6" style={{ color: "#6A5F5A" }}>
        Načítám data klienta...
      </p>
    );
  if (error) return <p className="p-6 text-red-600">Chyba: {error}</p>;
  if (!client) return <p className="p-6">Klient nenalezen.</p>;

  return (
    <div className="p-8">
      {/* Informace o klientovi */}
      <div
        className="mb-8 p-6 rounded-lg shadow"
        style={{ backgroundColor: "white" }}
      >
        <h1
          className="font-serif text-3xl font-bold mb-2"
          style={{ color: "#3C3633" }}
        >
          {client.firstName} {client.lastName}
        </h1>
        <p style={{ color: "#6A5F5A" }}>{client.email}</p>
        <p style={{ color: "#6A5F5A" }}>{client.phone || "Telefon neuveden"}</p>
      </div>

      {/* Historie objednávek */}
      <div>
        <h2
          className="font-serif text-2xl font-bold mb-4"
          style={{ color: "#3C3633" }}
        >
          Historie nákupů v e-shopu
        </h2>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: "white", borderColor: "#A4907C" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold" style={{ color: "#3C3633" }}>
                    Objednávka č. {order.id}
                  </h3>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#6A5F5A" }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("cs-CZ")}
                  </span>
                </div>
                <ul>
                  {order.items.map((item) => (
                    <li
                      key={item.product.name}
                      className="flex justify-between text-sm"
                      style={{ color: "#6A5F5A" }}
                    >
                      <span>
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span>
                        {((item.price * item.quantity) / 100).toFixed(2)} Kč
                      </span>
                    </li>
                  ))}
                </ul>
                <p
                  className="text-right font-bold mt-2"
                  style={{ color: "#3C3633" }}
                >
                  Celkem: {(order.total / 100).toFixed(2)} Kč
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "#6A5F5A" }}>
              Klient zatím nemá žádné objednávky.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
