"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { UserRole } from "@/lib/api/types"

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
    lastName: z.string().min(2, "Příjmení musí mít alespoň 2 znaky"),
    email: z.string().email("Neplatná emailová adresa"),
    password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole, {
      message: "Vyberte prosím roli",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hesla se neshodují",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      toast.success("Registrace byla úspěšná!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Chyba při registraci. Zkuste to prosím znovu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#3C3633] font-medium">
            Jméno
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Vaše jméno"
            className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/70 focus:border-[#6A5F5A] focus:ring-[#6A5F5A]"
            {...registerField("firstName")}
          />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#3C3633] font-medium">
            Příjmení
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Vaše příjmení"
            className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/70 focus:border-[#6A5F5A] focus:ring-[#6A5F5A]"
            {...registerField("lastName")}
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#3C3633] font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="vas@email.cz"
          className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/70 focus:border-[#6A5F5A] focus:ring-[#6A5F5A]"
          {...registerField("email")}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-[#3C3633] font-medium">
          Role
        </Label>
        <Select onValueChange={(value) => setValue("role", value as UserRole)}>
          <SelectTrigger className="bg-white/80 border-[#A4907C] text-[#3C3633] focus:border-[#6A5F5A] focus:ring-[#6A5F5A]">
            <SelectValue placeholder="Vyberte svou roli" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.ADMIN}>Administrátor</SelectItem>
            <SelectItem value={UserRole.TERAPEUT}>Terapeut</SelectItem>
            <SelectItem value={UserRole.RECEPCNI}>Recepční</SelectItem>
            <SelectItem value={UserRole.MASER}>Masér</SelectItem>
            <SelectItem value={UserRole.MANAGER}>Manažer</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#3C3633] font-medium">
          Heslo
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Vaše heslo"
            className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/70 focus:border-[#6A5F5A] focus:ring-[#6A5F5A] pr-10"
            {...registerField("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-[#6A5F5A]" /> : <Eye className="h-4 w-4 text-[#6A5F5A]" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[#3C3633] font-medium">
          Potvrdit heslo
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Potvrďte heslo"
            className="bg-white/80 border-[#A4907C] text-[#3C3633] placeholder:text-[#6A5F5A]/70 focus:border-[#6A5F5A] focus:ring-[#6A5F5A] pr-10"
            {...registerField("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-[#6A5F5A]" />
            ) : (
              <Eye className="h-4 w-4 text-[#6A5F5A]" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#6A5F5A] hover:bg-[#3C3633] text-[#E1D7C6] font-medium py-2 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Registruji...
          </div>
        ) : (
          "Zaregistrovat se"
        )}
      </Button>
    </form>
  )
}
