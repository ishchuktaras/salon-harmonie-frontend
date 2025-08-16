"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Minus, CreditCard, Banknote, Receipt, ShoppingCart, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - v produkci by se načítalo z API
const services = [
  { id: 1, name: "Relaxační masáž", price: 800, duration: 60, category: "Masáže" },
  { id: 2, name: "Kosmetické ošetření", price: 1200, duration: 90, category: "Kosmetika" },
  { id: 3, name: "Sauna", price: 300, duration: 30, category: "Wellness" },
  { id: 4, name: "Aromaterapie", price: 600, duration: 45, category: "Wellness" },
  { id: 5, name: "Manikúra", price: 500, duration: 60, category: "Nehty" },
]

const products = [
  { id: 1, name: "Masážní olej Levandule", price: 450, stock: 12, category: "Masážní oleje" },
  { id: 2, name: "Pleťový krém Anti-age", price: 890, stock: 8, category: "Kosmetika" },
  { id: 3, name: "Aromatická svíčka", price: 320, stock: 15, category: "Aromatherapie" },
  { id: 4, name: "Bambusový ručník", price: 680, stock: 6, category: "Textil" },
  { id: 5, name: "Dárkový poukaz 1000 Kč", price: 1000, stock: 999, category: "Poukazy" },
]

const mockClients = [
  { id: 1, name: "Anna Nováková", phone: "+420 123 456 789", email: "anna@email.cz" },
  { id: 2, name: "Petr Svoboda", phone: "+420 987 654 321", email: "petr@email.cz" },
  { id: 3, name: "Marie Dvořáková", phone: "+420 555 123 456", email: "marie@email.cz" },
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type: "service" | "product"
  duration?: number
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("services")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)

  const addToCart = (item: any, type: "service" | "product") => {
    const cartId = `${type}-${item.id}`
    const existingItem = cart.find((cartItem) => cartItem.id === cartId)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === cartId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([
        ...cart,
        {
          id: cartId,
          name: item.name,
          price: item.price,
          quantity: 1,
          type,
          duration: item.duration,
        },
      ])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const processPayment = () => {
    const transaction = {
      id: Date.now(),
      client: selectedClient,
      items: cart,
      total: getTotalAmount(),
      paymentMethod,
      timestamp: new Date(),
      receiptNumber: `SAL-${Date.now().toString().slice(-6)}`,
    }

    setLastTransaction(transaction)
    setShowReceipt(true)

    // Reset cart and client
    setCart([])
    setSelectedClient(null)
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Pokladní systém</h1>
        <p className="text-stone-600">Správa prodeje služeb a produktů</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Výběr klienta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) => {
                  const client = mockClients.find((c) => c.id.toString() === value)
                  setSelectedClient(client)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte klienta nebo pokračujte bez registrace" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClient && (
                <div className="mt-2 p-2 bg-sage-50 rounded-lg">
                  <p className="font-medium text-sage-800">{selectedClient.name}</p>
                  <p className="text-sm text-sage-600">{selectedClient.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
            <Input
              placeholder="Vyhledat služby nebo produkty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Services and Products Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Služby</TabsTrigger>
              <TabsTrigger value="products">Produkty</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-stone-800">{service.name}</h3>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-sage-700">{service.price} Kč</p>
                          <p className="text-sm text-stone-500">{service.duration} min</p>
                        </div>
                        <Button
                          onClick={() => addToCart(service, "service")}
                          size="sm"
                          className="bg-sage-600 hover:bg-sage-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-stone-800">{product.name}</h3>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-sage-700">{product.price} Kč</p>
                          <p className="text-sm text-stone-500">Skladem: {product.stock} ks</p>
                        </div>
                        <Button
                          onClick={() => addToCart(product, "product")}
                          size="sm"
                          className="bg-sage-600 hover:bg-sage-700"
                          disabled={product.stock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Košík
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Košík je prázdný</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">{item.name}</h4>
                        <p className="text-sm text-stone-500">
                          {item.price} Kč {item.duration && `• ${item.duration} min`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Celkem:</span>
                    <span className="text-sage-700">{getTotalAmount()} Kč</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Platba</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    className="flex items-center gap-2"
                  >
                    <Banknote className="h-4 w-4" />
                    Hotově
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Kartou
                  </Button>
                </div>

                <Button onClick={processPayment} className="w-full bg-sage-600 hover:bg-sage-700" size="lg">
                  <Receipt className="h-4 w-4 mr-2" />
                  Zaplatit {getTotalAmount()} Kč
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Účtenka</DialogTitle>
            <DialogDescription>Transakce byla úspěšně zpracována</DialogDescription>
          </DialogHeader>

          {lastTransaction && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg">Salon Harmonie</h3>
                <p className="text-sm text-stone-600">Jihlava</p>
                <p className="text-sm text-stone-600">Účtenka č. {lastTransaction.receiptNumber}</p>
                <p className="text-sm text-stone-600">{lastTransaction.timestamp.toLocaleString("cs-CZ")}</p>
              </div>

              {lastTransaction.client && (
                <div className="border-b pb-2">
                  <p className="font-medium">{lastTransaction.client.name}</p>
                  <p className="text-sm text-stone-600">{lastTransaction.client.phone}</p>
                </div>
              )}

              <div className="space-y-2">
                {lastTransaction.items.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} ({item.quantity}x)
                    </span>
                    <span>{item.price * item.quantity} Kč</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Celkem:</span>
                  <span>{lastTransaction.total} Kč</span>
                </div>
                <p className="text-sm text-stone-600 mt-1">
                  Platba: {lastTransaction.paymentMethod === "cash" ? "Hotově" : "Kartou"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => window.print()} variant="outline" className="flex-1">
                  Tisknout
                </Button>
                <Button onClick={() => setShowReceipt(false)} className="flex-1 bg-sage-600 hover:bg-sage-700">
                  Zavřít
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
