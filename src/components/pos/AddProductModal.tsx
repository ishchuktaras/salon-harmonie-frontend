//src/components/pos/AddProductModal.tsx

"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Product, TransactionItem } from "@/lib/api/types"
import { apiClient } from "@/lib/api/client"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (product: TransactionItem) => void
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [products, setProducts] = React.useState<Product[]>([])

  React.useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          const data = await apiClient.get<Product[]>("/products")
          setProducts(data)
        } catch (error) {
          console.error("Failed to fetch products:", error)
        }
      }
      fetchProducts()
    }
  }, [isOpen])

  const handleSelectProduct = (product: Product) => {
    onAddProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: 'product',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Přidat produkt</DialogTitle>
          <DialogDescription>Vyberte produkt, který chcete přidat k transakci.</DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Hledat produkt..." />
          <CommandList>
            <CommandEmpty>Žádný produkt nenalezen.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleSelectProduct(product)}
                  className="flex justify-between"
                >
                  <span>{product.name}</span>
                  <span className="text-muted-foreground">{product.price.toLocaleString()} Kč</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
