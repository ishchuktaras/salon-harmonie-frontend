"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Service } from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/card";

export default function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);

  React.useEffect(() => {
    // Simulace načítání dat
    setServices([
      {
        id: 1,
        name: "Relaxační masáž",
        description:
          "Hluboce relaxační masáž celého těla s použitím přírodních olejů",
        duration: 60,
        price: 1200,
      },
      {
        id: 2,
        name: "Sportovní masáž",
        description:
          "Intenzivní masáž zaměřená na uvolnění svalového napětí po sportovním výkonu",
        duration: 45,
        price: 950,
      },
      {
        id: 3,
        name: "Kosmetické ošetření pleti",
        description: "Kompletní péče o pleť včetně čištění, masky a hydratace",
        duration: 75,
        price: 1500,
      },
    ]);
  }, []);

  return (
    <>
      <PageHeader
        title="Správa služeb"
        description="Přehled a editace nabízených služeb a procedur."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Přidat novou službu
        </Button>
      </PageHeader>
      <div className="p-4">
        <Card>
          <CardContent className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Název služby</TableHead>

                  <TableHead>Doba trvání (min)</TableHead>
                  <TableHead className="text-right">Cena (Kč)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>

                    <TableCell>{service.duration}</TableCell>
                    <TableCell className="text-right">
                      {service.price.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
