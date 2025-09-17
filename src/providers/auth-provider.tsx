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
      const response = await apiClient.post<LoginResponse>("/auth/register", credentials)
      const registerResponseData = response.data

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
    } catch (error) {
      console.error("Chyba při registraci:", error)
      throw error
    }
  }

  const loginWithOAuth = async (provider: OAuthProvider) => {
    try {
      const isDevelopment = process.env.NODE_ENV === "development"
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://salon-harmonie-backend.onrender.com"

      const providerName = provider === "google" ? "Google" : "Apple"

      if (isDevelopment) {
        console.log(`[v0] OAuth ${provider} requested in development mode`)
        throw new Error(
          `${providerName} přihlášení není momentálně dostupné. Backend neobsahuje potřebné OAuth endpointy. Použijte prosím email a heslo pro přihlášení.`,
        )
      }

      const authUrl = `${baseUrl}/auth/${provider}`

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(authUrl, {
          method: "HEAD",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`OAuth endpoint returned ${response.status}`)
        }

        console.log(`[v0] Redirecting to OAuth: ${authUrl}`)
        window.location.href = authUrl
      } catch (error) {
        console.log(`[v0] OAuth endpoint not available for ${provider}`)
        throw new Error(
          `${providerName} přihlášení není momentálně dostupné. Zkuste to prosím později nebo použijte email a heslo.`,
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
    register, // Added register to context value
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
