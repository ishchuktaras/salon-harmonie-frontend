'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PlusCircle } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Definice typu pro službu, měla by odpovídat backendu
interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number; // v minutách
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- OPRAVA ZDE ---
        const data = await api.request<Service[]>('/services');
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
        setError("Nepodařilo se načíst služby.");
        toast.error("Chyba při načítání služeb.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); // Závislost na `api` není nutná, pokud se nemění

  const formatCurrency = (value: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(value);
  
  return (
    <>
      <PageHeader
        title="Správa služeb"
        description="Zde můžete spravovat veškeré služby nabízené v salonu."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Přidat novou službu
        </Button>
      </PageHeader>
      <div className="p-4 md:p-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-red-500">{error}</div>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.duration} minut</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg">{formatCurrency(service.price)}</p>
                <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}