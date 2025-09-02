"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TransactionItem } from "@/lib/api/types" 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// 1. Nahradili jsme `null` za `undefined`.
// 2. Odebrali jsme vlastnost `type`, která v typu neexistuje.
const mockItems: Omit<TransactionItem, 'transactionId'>[] = [
    { id: 1, name: "Relaxační masáž", price: 1200, quantity: 1, serviceId: 1, productId: undefined },
    { id: 2, name: "Hydratační krém", price: 850, quantity: 1, serviceId: undefined, productId: 1 },
];

export default function PosPage() {
  const [currentTransactionItems, setCurrentTransactionItems] = React.useState<TransactionItem[]>([]);

  const total = currentTransactionItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddItem = (value: string) => {
    const selected = mockItems.find(item => item.id.toString() === value);
    if (selected) {
        
        // 3. Odebrali jsme `transactionId`, které v typu neexistuje.
        const newItem: TransactionItem = { 
            ...selected,
            // ID generujeme unikátní pro klíč v Reactu, v reálné aplikaci by ho přiřadila databáze
            id: Date.now(), 
        };
        setCurrentTransactionItems(prev => [...prev, newItem]);
    }
  }

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
              {currentTransactionItems.length === 0 ? (
                <p className="text-muted-foreground text-center">Žádné položky v transakci.</p>
              ) : (
                currentTransactionItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {item.price.toLocaleString()} Kč
                      </p>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} Kč</p>
                  </div>
                ))
              )}
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
              <label htmlFor="search-item" className="text-sm font-medium">Přidat položku</label>
              <Select onValueChange={handleAddItem}>
                <SelectTrigger id="search-item" className="mt-2">
                  <SelectValue placeholder="Vybrat službu nebo produkt..." />
                </SelectTrigger>
                <SelectContent>
                  {mockItems.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} - {item.price} Kč
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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

