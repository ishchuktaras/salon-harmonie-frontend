"use client"

import { useState, useEffect, type ReactNode } from "react"
import {
  AuthContext,
  type LoginResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type OAuthProvider,
} from "@/context/auth-context"
import { type User, UserRole } from "@/lib/api/types"
import apiClient from "@/lib/api/client"
import Cookies from "js-cookie"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: () => void
          renderButton: (element: HTMLElement, config: any) => void
        }
      }
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get("token")
      if (token) {
        try {
          const userProfile = await apiClient.get<Omit<User, "token">>("/auth/profile")
          const completeUser: User = { ...userProfile.data, token: token }
          setUser(completeUser)
        } catch (error) {
          console.error("Token je neplatný nebo se nepodařilo načíst data uživatele, odhlašuji.", error)
          Cookies.remove("token")
        }
      }
      setIsLoading(false)
    }

    initializeUser()
  }, [])

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        })
      }
    }

    // Load Google Identity Services script
    if (!window.google) {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.head.appendChild(script)
    } else {
      initializeGoogleSignIn()
    }
  }, [])

  const handleGoogleSignIn = async (response: any) => {
    try {
      console.log("[v0] Processing Google Sign-In response...")

      // Decode JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split(".")[1]))

      // Create user object from Google data
      const googleUser: User = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        role: UserRole.CLIENT,
        token: response.credential, // Use Google JWT as token for demo
      }

      // Store token in cookies
      const cookieOptions = {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
      }

      Cookies.set("token", response.credential, cookieOptions)
      setUser(googleUser)

      console.log("[v0] Google Sign-In successful")

      // Redirect to appropriate dashboard
      const redirectPath = getRoleBasedRedirectPath(googleUser.role)
      window.location.href = redirectPath
    } catch (error) {
      console.error("Google Sign-In error:", error)
      throw new Error("Chyba při Google přihlášení")
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials)
      const loginResponseData = response.data

      const cookieOptions = {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
      }

      Cookies.set("token", loginResponseData.access_token, cookieOptions)

      const userToStore: User = {
        ...loginResponseData.user,
        token: loginResponseData.access_token,
      }
      setUser(userToStore)
    } catch (error) {
      console.error("Chyba při přihlašování:", error)
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      console.log("[v0] Starting registration process...")

      const response = await apiClient.post<LoginResponse>("/auth/register", credentials)
      const registerResponseData = response.data

      console.log("[v0] Registration successful, setting up user session...")

      const cookieOptions = {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
      }

      Cookies.set("token", registerResponseData.access_token, cookieOptions)

      const userToStore: User = {
        ...registerResponseData.user,
        token: registerResponseData.access_token,
      }
      setUser(userToStore)

      console.log("[v0] User registration and login completed successfully")
    } catch (error) {
      console.error("Chyba při registraci:", error)

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          throw new Error("Registrace trvá příliš dlouho. Zkuste to prosím později.")
        } else if (error.message.includes("Network Error") || error.message.includes("Síťová chyba")) {
          throw new Error("Problém s připojením k serveru. Zkontrolujte internetové připojení.")
        }
      }

      throw error
    }
  }

  const loginWithOAuth = async (provider: OAuthProvider) => {
    try {
      console.log(`[v0] Starting OAuth ${provider} login...`)

      if (provider === "google") {
        if (!window.google) {
          throw new Error("Google Sign-In není načteno. Zkuste to prosím znovu.")
        }

        // Trigger Google Sign-In popup
        window.google.accounts.id.prompt()
      } else {
        throw new Error(
          `${provider} přihlášení není momentálně dostupné. Zkuste to prosím později nebo použijte email a heslo.`,
        )
      }
    } catch (error) {
      console.error(`Chyba při ${provider} přihlašování:`, error)
      throw error
    }
  }

  const getRoleBasedRedirectPath = (role: UserRole): string => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return "/admin/dashboard"
      case UserRole.MANAGER:
        return "/manager/dashboard"
      case UserRole.TERAPEUT:
      case UserRole.MASER:
        return "/therapist/dashboard"
      case UserRole.RECEPCNI:
        return "/reception/dashboard"
      case UserRole.KOORDINATOR:
        return "/coordinator/dashboard"
      case UserRole.ASISTENT:
        return "/assistant/dashboard"
      case UserRole.ESHOP_SPRAVCE:
        return "/eshop/dashboard"
      case UserRole.CLIENT:
        return "/client/dashboard"
      default:
        return "/dashboard"
    }
  }

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    loginWithOAuth,
    logout,
    isLoading,
    getRoleBasedRedirectPath,
  }

  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider as default }
