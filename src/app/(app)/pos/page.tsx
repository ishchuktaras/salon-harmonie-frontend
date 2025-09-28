'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, X } from 'lucide-react';
import AddProductModal from '@/components/pos/AddProductModal';
import { useApi } from '@/hooks/use-api';
import { toast } from 'sonner';

// Typy musí odpovídat tomu, co používáme v komponentách
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const api = useApi();

  // --- OPRAVA ZDE ---
  // Funkce nyní přijímá 'product' a 'quantity', přesně jak to posílá AddProductModal
  const handleAddItem = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id);
      if (existingItem) {
        // Pokud položka již existuje, jen zvýšíme počet kusů
        return prevCart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Jinak přidáme novou položku
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
        };
        return [...prevCart, newItem];
      }
    });
    toast.success(`${product.name} byl přidán do prodeje.`);
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      toast.error("Nelze dokončit prodej s prázdným košíkem.");
      return;
    }
    
    // Zde bude logika pro vytvoření transakce přes API
    console.log("Finalizing sale with items:", cart);
    toast.success("Prodej byl úspěšně dokončen!");
    setCart([]); // Vyčistíme košík
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(value);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pokladní systém</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Přidat produkt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktuální prodej</CardTitle>
          <CardDescription>Položky přidané k prodeji.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Množství</TableHead>
                <TableHead className="text-right">Cena za kus</TableHead>
                <TableHead className="text-right">Celkem</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {cart.length === 0 && (
            <p className="text-center text-muted-foreground p-4">Žádné položky v prodeji.</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end items-center gap-4">
        <div className="text-xl font-bold">
          Celkem: {formatCurrency(calculateTotal())}
        </div>
        <Button size="lg" onClick={handleFinalizeSale} disabled={cart.length === 0}>
          Dokončit prodej
        </Button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddItem}
      />
    </div>
  );
}