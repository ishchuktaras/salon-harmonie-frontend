"use client"

import { Sparkles } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function LoginPage() {
  const { loginWithOAuth } = useAuth()

  const handleAppleLogin = async () => {
    try {
      await loginWithOAuth("apple")
    } catch (error) {
      console.error("Apple login error:", error)
      toast.error(error instanceof Error ? error.message : "Chyba při Apple přihlašování")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithOAuth("google")
    } catch (error) {
      console.error("Google login error:", error)
      toast.error(error instanceof Error ? error.message : "Chyba při Google přihlašování")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C3633] via-[#6A5F5A] to-[#A4907C] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#E1D7C6]/95 border-[#A4907C] backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 self-center font-semibold text-xl text-[#3C3633]"
          >
            <div className="bg-[#6A5F5A] text-[#E1D7C6] flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-5" />
            </div>
            <span className="font-serif">Salon Harmonie</span>
          </Link>
          <div>
            <CardTitle className="text-2xl font-serif font-bold text-[#3C3633] mb-2">Vítejte zpět</CardTitle>
            <CardDescription className="text-[#6A5F5A] font-medium">
              Přihlaste se do vašeho účtu a pokračujte v péči o vaši krásu
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {/* <Button
              variant="outline"
              className="w-full bg-[#A4907C]/20 border-[#A4907C] text-[#3C3633] hover:bg-[#A4907C]/30 transition-all duration-200"
              onClick={handleAppleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Přihlásit se přes Apple
            </Button> */}
            <Button
              variant="outline"
              className="w-full bg-[#A4907C]/20 border-[#A4907C] text-[#3C3633] hover:bg-[#A4907C]/30 transition-all duration-200"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Přihlásit se přes Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#A4907C]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#E1D7C6] px-2 text-[#6A5F5A] font-medium">Nebo pokračujte s</span>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Sign up link */}
          <div className="text-center text-sm text-[#6A5F5A]">
            Nemáte účet?{" "}
            <Link
              href="/register"
              className="text-[#3C3633] hover:text-[#6A5F5A] font-medium hover:underline transition-colors"
            >
              Zaregistrujte se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
