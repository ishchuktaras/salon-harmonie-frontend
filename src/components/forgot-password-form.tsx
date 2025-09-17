"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import apiClient from "@/lib/api/client"

const forgotPasswordSchema = z.object({
  email: z.string().email("Neplatná emailová adresa"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await apiClient.post("/auth/forgot-password", { email: data.email })

      setIsEmailSent(true)
      toast.success("Email s odkazem pro obnovení hesla byl odeslán!")
    } catch (error: any) {
      console.error("Forgot password error:", error)

      if (error.response?.status === 404) {
        toast.error("Uživatel s tímto emailem nebyl nalezen.")
      } else if (error.response?.status >= 500) {
        toast.error("Chyba serveru. Zkuste to prosím později.")
      } else {
        toast.error("Chyba při odesílání emailu. Zkuste to prosím znovu.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-[#6A5F5A]/20 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-[#6A5F5A]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#3C3633] mb-2">Email byl odeslán!</h3>
          <p className="text-[#6A5F5A] text-sm">
            Zkontrolujte svou emailovou schránku a klikněte na odkaz pro obnovení hesla.
          </p>
        </div>
        <Button
          onClick={() => setIsEmailSent(false)}
          variant="ghost"
          className="text-[#6A5F5A] hover:text-[#3C3633] hover:bg-[#A4907C]/20"
        >
          Odeslat znovu
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#3C3633] font-medium">
          Emailová adresa
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="vas@email.cz"
          className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/70 focus:border-[#6A5F5A] focus:ring-[#6A5F5A]"
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#6A5F5A] hover:bg-[#3C3633] text-[#E1D7C6] font-medium py-2 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Odesílám...
          </div>
        ) : (
          "Odeslat odkaz pro obnovení"
        )}
      </Button>
    </form>
  )
}
