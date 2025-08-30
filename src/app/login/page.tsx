// soubor: src/app/login/page.tsx

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth/auth-provider"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import Image from "next/image" 
import Link from "next/link"
import { Leaf } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@salon.cz")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const response = await apiClient.post<{ access_token: string; user: any }>('/auth/login', {
        email,
        password,
      });

      if (response.access_token && response.user) {
        login(response.access_token, response.user);
        router.push('/dashboard');
      } else {
        throw new Error("Odpověď z API neobsahuje token nebo uživatelská data.");
      }

    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Přihlášení se nezdařilo. Zkontrolujte údaje.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Levá část s formulářem */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="h-7 w-7 text-primary" />
                <h1 className="text-3xl font-bold font-serif">Salon Harmonie</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Zadejte svůj email pro přihlášení do systému
            </p>
          </div>
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
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Heslo</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Zapomněli jste heslo?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Probíhá přihlašování..." : "Přihlásit se"}
            </Button>
          </form>
        </div>
      </div>
      {/* Pravá část s obrázkem */}
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Obrázek interiéru salonu"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}