'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Service } from '@/lib/api/types'
import { useApi } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton'

// Mock data pro lokální vývoj, pokud API ještě neběží
const mockServices: Service[] = [
  {
    id: 1,
    name: 'Relaxační masáž',
    description: 'Uvolňující masáž pro celé tělo.',
    duration: 60,
    price: 1200,
    therapists: [], 
  },
  {
    id: 2,
    name: 'Sportovní masáž',
    description: 'Intenzivní masáž zaměřená na svalovou regeneraci.',
    duration: 45,
    price: 1000,
    therapists: [], 
  },
  {
    id: 3,
    name: 'Lymfatická drenáž',
    description: 'Jemná technika pro podporu lymfatického systému.',
    duration: 90,
    price: 1500,
    therapists: [], 
  },
]


export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const api = useApi()

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        // Přepnuto na reálné volání API
        const data = await api.apiFetch<Service[]>('/services');
        setServices(data);
        
      } catch (error) {
        console.error('Failed to fetch services:', error)
        // V případě chyby API se zobrazí mock data, aby stránka fungovala
        setServices(mockServices)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [api]) // Přidána závislost na `api` hooku

  // Vylepšený stav načítání pomocí "skeleton" komponent
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Naše Služby</h1>
          <Button disabled>Přidat novou službu</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Skeleton className="h-10 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Naše Služby</h1>
        <Button>Přidat novou službu</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Délka:</strong> {service.duration} minut
              </p>
              <p>
                <strong>Cena:</strong> {service.price.toLocaleString('cs-CZ')} Kč
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">Upravit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

