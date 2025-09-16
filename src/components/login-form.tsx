"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({
    message: "Prosím zadejte platnou e-mailovou adresu.",
  }),
  password: z.string().min(1, {
    message: "Prosím zadejte heslo.",
  }),
})

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setLoading(true)
    try {
      await login(values)
      router.push("/dashboard")
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Neplatný e-mail nebo heslo. Zkuste to prosím znovu.")
      } else {
        setError("Došlo k neznámé chybě. Zkuste to prosím znovu.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-medium">Chyba přihlášení</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#3C3633] font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="vase@email.com"
                  {...field}
                  disabled={loading}
                  className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/60 focus:border-[#6A5F5A] focus:ring-[#6A5F5A]/20 transition-all duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-[#3C3633] font-medium">Heslo</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#6A5F5A] hover:text-[#3C3633] hover:underline transition-colors"
                >
                  Zapomněli jste heslo?
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={loading}
                  className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/60 focus:border-[#6A5F5A] focus:ring-[#6A5F5A]/20 transition-all duration-200"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#6A5F5A] text-[#E1D7C6] hover:bg-[#3C3633] font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Přihlašuji..." : "Přihlásit se"}
        </Button>
      </form>
    </Form>
  )
}
