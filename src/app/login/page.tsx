"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth/auth-provider"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client" // Import našeho API klienta

export default function LoginPage() {
  const [email, setEmail] = useState("admin@harmonie.cz") // Předvyplněno pro pohodlí
  const [password, setPassword] = useState("password") // Předvyplněno pro pohodlí
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      // Volání skutečného backend endpointu pro přihlášení
      const response = await apiClient.post<{ access_token: string; user: any }>('/auth/login', {
        email,
        password,
      });

      if (response.access_token && response.user) {
        // Uložení skutečného tokenu a dat o uživateli
        login(response.access_token, response.user);
        router.push('/dashboard'); // Přesměrování na dashboard
      } else {
        throw new Error("Odpověď z API neobsahuje token nebo uživatelská data.");
      }

    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Přihlášení se nezdařilo. Zkontrolujte údaje.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Přihlášení</CardTitle>
          <CardDescription>
            Zadejte své přihlašovací údaje pro vstup do systému
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jmeno@priklad.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Heslo</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Přihlásit se
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
