"use client"

import { Sparkles, ArrowLeft } from "lucide-react"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
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
            <CardTitle className="text-2xl font-serif font-bold text-[#3C3633] mb-2">Zapomenuté heslo</CardTitle>
            <CardDescription className="text-[#6A5F5A] font-medium">
              Zadejte svou emailovou adresu a pošleme vám odkaz pro obnovení hesla
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Forgot Password Form */}
          <ForgotPasswordForm />

          {/* Back to login link */}
          <div className="text-center">
            <Link href="/login">
              <Button variant="ghost" className="text-[#6A5F5A] hover:text-[#3C3633] hover:bg-[#A4907C]/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zpět na přihlášení
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
