"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/api/client"
import Cookies from "js-cookie"
import type { User, UserRole } from "@/lib/api/types"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getRoleBasedRedirectPath } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Zpracovávám přihlášení...")

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const provider = searchParams.get("provider") || "google"
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`OAuth chyba: ${error}`)
        }

        if (!code) {
          throw new Error("Chybí autorizační kód")
        }

        setMessage("Ověřuji přihlášení...")

        const response = await apiClient.post("/auth/oauth/callback", {
          code,
          state,
          provider,
        })

        const { access_token, user } = response.data

        Cookies.set("token", access_token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        })

        const completeUser: User = {
          ...user,
          token: access_token,
        }

        setStatus("success")
        setMessage("Přihlášení úspěšné! Přesměrovávám...")
        toast.success("Úspěšně přihlášeno")

        const redirectPath = getRoleBasedRedirectPath(user.role as UserRole)

        setTimeout(() => {
          router.push(redirectPath)
        }, 1500)
      } catch (error) {
        console.error("OAuth callback error:", error)
        setStatus("error")
        setMessage("Chyba při přihlašování. Zkuste to znovu.")
        toast.error("Chyba při přihlašování")

        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, getRoleBasedRedirectPath])

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-8 w-8 animate-spin text-[#6A5F5A]" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case "error":
        return <XCircle className="h-8 w-8 text-red-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C3633] via-[#6A5F5A] to-[#A4907C] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#E1D7C6]/95 border-[#A4907C] backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 font-semibold text-xl text-[#3C3633]">
            <div className="bg-[#6A5F5A] text-[#E1D7C6] flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-5" />
            </div>
            <span className="font-serif">Salon Harmonie</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-serif font-bold text-[#3C3633] mb-2">Přihlašování</CardTitle>
            <CardDescription className="text-[#6A5F5A] font-medium">Dokončuji váš vstup do systému</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            <p className="text-center text-[#3C3633] font-medium">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
