// src/app/login/page.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@salon-harmonie.cz") // Demo data
  const [password, setPassword] = useState("admin123") // Demo data
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth() 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Použijeme naši novou login funkci z AuthProvider
      const success = await login(email, password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Neplatné přihlašovací údaje")
      }
    } catch (err) {
      setError("Chyba při přihlašování. Zkuste to znovu.")
    } finally {
      setIsLoading(false)
    }
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl">
              <Leaf className="w-7 h-7 text-amber-700" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-serif font-bold text-stone-800">Salon Harmonie</h1>
              <p className="text-sm text-stone-600">Wellness Management</p>
            </div>
          </Link>
        </div>
        <Card className="border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-stone-800">Přihlášení</CardTitle>
            <CardDescription className="text-stone-600">Přihlaste se do systému pro správu salonu</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">E-mailová adresa</Label>
                <Input
                  id="email" type="email" placeholder="vas.email@salon-harmonie.cz"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required className="border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700">Heslo</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPassword ? "text" : "password"} placeholder="Zadejte heslo"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required className="border-stone-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                  />
                  <Button
                    type="button" variant="ghost" size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-stone-400" /> : <Eye className="h-4 w-4 text-stone-400" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white" disabled={isLoading}>
                {isLoading ? "Přihlašování..." : "Přihlásit se"}
              </Button>
              <div className="text-center text-sm text-stone-600">
                <Link href="/forgot-password" className="hover:text-amber-700 transition-colors">
                  Zapomněli jste heslo?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}