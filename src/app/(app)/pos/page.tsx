'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PlusCircle, Trash2 } from 'lucide-react'
import AddProductModal from '@/components/pos/AddProductModal'
import { TransactionItem } from '@/lib/api/types'


const mockItems: Omit<TransactionItem, 'transactionId'>[] = [
  { id: 1, name: "Relaxační masáž", price: 1200, quantity: 1, serviceId: 1, productId: null },
  { id: 2, name: "Hydratační krém", price: 850, quantity: 1, serviceId: null, productId: 1 },
];


export default function POSPage() {
  const [items, setItems] = useState<Omit<TransactionItem, 'transactionId'>[]>(mockItems)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleAddItem = (newItem: Omit<TransactionItem, 'id' | 'transactionId'>) => {
    // Prozatím přidáváme s dočasným ID, v reálu by ID přiřadila databáze
    setItems([...items, { ...newItem, id: Math.random() }])
  }

  const handleRemoveItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Položky účtu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.price.toLocaleString('cs-CZ')} Kč
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-16 h-8 text-center"
                      min="1"
                    />
                    <span>x</span>
                  </div>
                  <p className="w-24 text-right font-semibold">
                    {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Přidat produkt
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Platba</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Celkem:</span>
              <span>{total.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <div className="space-y-2">
              <Button size="lg" className="w-full">
                Hotově
              </Button>
              <Button size="lg" className="w-full">
                Kartou
              </Button>
              <Button size="lg" variant="secondary" className="w-full">
                Rozdělit platbu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddItem}
      />
    </div>
  )
}

