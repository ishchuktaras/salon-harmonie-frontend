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

      const redirectUri =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/auth/callback"
          : "https://salon-harmonie-frontend.vercel.app/auth/callback"

      const state = Math.random().toString(36).substring(2, 15)

      // Store state in sessionStorage for verification
      sessionStorage.setItem("oauth_state", state)
      sessionStorage.setItem("oauth_provider", provider)

      // Construct OAuth URL based on provider
      let oauthUrl: string

      if (provider === "google") {
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        if (!googleClientId) {
          throw new Error("Google OAuth není nakonfigurováno. Kontaktujte administrátora.")
        }

        const params = new URLSearchParams({
          client_id: googleClientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid email profile",
          state: `${state}&provider=google`,
          access_type: "offline",
          prompt: "consent",
        })

        oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
      } else {
        /* else if (provider === "apple") {
        const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID
        if (!appleClientId) {
          throw new Error("Apple OAuth není nakonfigurováno. Kontaktujte administrátora.")
        }

        const params = new URLSearchParams({
          client_id: appleClientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "name email",
          state: `${state}&provider=apple`,
          response_mode: "form_post",
        })

        oauthUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`
      } */
        throw new Error(
          `${provider} přihlášení není momentálně dostupné. Zkuste to prosím později nebo použijte email a heslo.`,
        )
      }

      console.log(`[v0] Redirecting to ${provider} OAuth...`)

      // Redirect to OAuth provider
      window.location.href = oauthUrl
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
