"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { PKCEStorage } from "@/lib/api/oauth/pkce"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleOAuthCallback, getRoleBasedRedirectPath } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Zpracovávám přihlášení...")

  // Ref pro sledování, zda byl callback již spuštěn, aby se zabránilo dvojitému spuštění
  const callbackCalled = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`OAuth chyba: ${error}`);
        }

        if (!code || !state) {
          throw new Error("Chybí autorizační kód nebo state parametr.");
        }

        setMessage("Ověřuji přihlášení...");

        // handleOAuthCallback nyní vrací roli uživatele
        const userRole = await handleOAuthCallback(code, state);

        setStatus("success");
        setMessage("Přihlášení úspěšné! Přesměrovávám...");
        toast.success("Úspěšně přihlášeno");

        const redirectPath = getRoleBasedRedirectPath(userRole);

        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);

      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage("Chyba při přihlašování. Zkuste to znovu.");
        toast.error("Chyba při přihlašování");
        
        PKCEStorage.clear();

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    // Spustíme logiku pouze jednou
    if (!callbackCalled.current) {
      callbackCalled.current = true;
      processCallback();
    }
  }, [searchParams, router, handleOAuthCallback, getRoleBasedRedirectPath]);

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