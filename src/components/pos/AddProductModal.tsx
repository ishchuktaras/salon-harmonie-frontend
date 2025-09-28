'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/use-api';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product, quantity: number) => void;
}

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const api = useApi();

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          // --- OPRAVA ZDE ---
          const data = await api.request<Product[]>('/products');
          setProducts(data);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      };
      fetchProducts();
    }
  }, [isOpen]); // Závislost na `api` není nutná

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Přidat produkt k prodeji</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Hledat produkt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="max-h-64 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-2 hover:bg-muted rounded-md"
            >
              <span>{product.name} - {product.price} Kč</span>
              <Button
                size="sm"
                onClick={() => {
                  // Předpokládáme přidání jednoho kusu, pro složitější logiku by zde byl input na množství
                  onAddProduct(product, 1);
                  onClose();
                }}
              >
                Přidat
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Zavřít
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}