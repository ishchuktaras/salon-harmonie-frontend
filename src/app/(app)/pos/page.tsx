// src/app/(app)/pos/page.tsx

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, PlusCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { TransactionItem } from "@/lib/api/types"

export default function PosPage() {
  // Testovací data pro zobrazení
  const [items, setItems] = React.useState<TransactionItem[]>([
    { id: "1", name: "Relaxační masáž", price: 1200, quantity: 1, type: 'service' },
    { id: "2", name: "Hydratační krém", price: 850, quantity: 1, type: 'product' },
  ]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid flex-1 grid-cols-1 md:grid-cols-3 gap-8 p-4">
      {/* Levá část - Účtenka */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Aktuální transakce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {item.price.toLocaleString()} Kč
                    </p>
                  </div>
                  <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} Kč</p>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="flex justify-between items-center font-bold text-lg">
              <p>Celkem k úhradě</p>
              <p>{total.toLocaleString()} Kč</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pravá část - Ovládací prvky */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Možnosti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="search-reservation" className="text-sm font-medium">Načíst z rezervace</label>
              <div className="flex gap-2 mt-2">
                <Input id="search-reservation" placeholder="Hledat klienta..." />
                <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
              </div>
            </div>

            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Přidat produkt
            </Button>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Dokončit platbu</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg">Hotově</Button>
                <Button size="lg">Kartou</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
