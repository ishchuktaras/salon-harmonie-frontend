"use client"

import { Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { PKCEStorage } from "@/lib/api/oauth/pkce"
import { oauthApi } from "@/lib/api/oauth"
import type { UserRole } from "@/lib/api/types"
import { useEffect, useState } from 'react';

// The actual logic is moved to this component
function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getRoleBasedRedirectPath, setUser } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Zpracovávám přihlášení...")

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const provider = searchParams.get("provider") || "google"
        const error = searchParams.get("error")

        console.log("[v0] OAuth callback started with params:", { code: !!code, state, provider, error })

        if (error) {
          throw new Error(`OAuth chyba: ${error}`)
        }

        if (!code) {
          throw new Error("Chybí autorizační kód")
        }

        setMessage("Ověřuji přihlášení...")

        await new Promise((resolve) => setTimeout(resolve, 100))

        const pkceParams = PKCEStorage.retrieve()

        if (!pkceParams) {
          console.error("[v0] PKCE code verifier not found in localStorage")
          throw new Error("Chybí PKCE code verifier")
        }

        const { codeVerifier, state: storedState } = pkceParams;

        if (state && storedState) {
          const stateFromUrl = state.includes("&") ? state.split("&")[0] : state
          if (stateFromUrl !== storedState) {
            console.error("[v0] State parameter mismatch:", {
              received: stateFromUrl,
              stored: storedState,
              fullState: state,
            })
            throw new Error("Neplatný state parametr")
          }
        }

        setMessage("Dokončuji přihlášení...")

        const callbackResponse = await oauthApi.handleCallback({
          code,
          codeVerifier,
          provider,
        })

        PKCEStorage.clear()

        const userWithToken = {
          ...callbackResponse.user,
          id: Number.parseInt(callbackResponse.user.id, 10),
          token: callbackResponse.access_token,
          role: callbackResponse.user.role as UserRole,
        }

        if (setUser) {
          setUser(userWithToken)
        }

        setStatus("success")
        setMessage("Přihlášení úspěšné! Přesměrovávám...")
        toast.success("Úspěšně přihlášeno")

        const redirectPath = getRoleBasedRedirectPath(callbackResponse.user.role as any)

        setTimeout(() => {
          router.push(redirectPath)
        }, 1500)
      } catch (error) {
        console.error("OAuth callback error:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Chyba při přihlašování. Zkuste to znovu.")
        toast.error("Chyba při přihlašování")

        PKCEStorage.clear()

        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, getRoleBasedRedirectPath, setUser])

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
  );
}


// The main page component now wraps the logic in Suspense
export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C3333] via-[#6A5F5A] to-[#A4907C] flex items-center justify-center p-4">
        <Suspense fallback={<LoadingState />}>
            <AuthCallbackContent />
        </Suspense>
    </div>
  )
}

// A simple loading state to show while the page is loading
function LoadingState() {
    return (
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
                    <Loader2 className="h-8 w-8 animate-spin text-[#6A5F5A]" />
                    <p className="text-center text-[#3C3633] font-medium">Načítání...</p>
                </div>
            </CardContent>
        </Card>
    )
}
