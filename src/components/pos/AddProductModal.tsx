'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState, useEffect } from 'react'
import { Product, TransactionItem } from '@/lib/api/types'
import { useApi } from '@/hooks/useApi'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (item: Omit<TransactionItem, 'id' | 'transactionId'>) => void
}

export default function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
}: AddProductModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const api = useApi()

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          // Nahraďte endpointem pro získání produktů
          const data = await api.apiFetch<Product[]>('/products')
          setProducts(data)
        } catch (error) {
          console.error('Failed to fetch products:', error)
        }
      }
      fetchProducts()
    }
  }, [isOpen, api])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (product: Product) => {
    onAddProduct({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      // Pole 'type' zde nepatří, protože není v definici TransactionItem v types.ts
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Přidat produkt k prodeji</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Hledat produkt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="h-72 mt-4">
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span>{product.name}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddProduct(product)}
                  >
                    Přidat
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Zavřít
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

