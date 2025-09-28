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
import { generateCodeVerifier, generateCodeChallenge, PKCEStorage } from "@/lib/api/oauth/pkce"
import { oauthApi } from "@/lib/api/oauth"

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

      const providersResponse = await oauthApi.getProviders()
      const availableProvider = providersResponse.providers.find((p) => p.id === provider)

      if (!availableProvider) {
        throw new Error(`${provider} přihlášení není momentálně dostupné.`)
      }

      const redirectUri =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/auth/callback"
          : "https://salon-harmonie-frontend.vercel.app/auth/callback"

      const state = Math.random().toString(36).substring(2, 15)

      console.log("[v0] Generating PKCE parameters...")
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      console.log("[v0] PKCE parameters generated successfully")

      console.log("[v0] Storing PKCE parameters with enhanced verification...")

      // Clear any existing data first
      PKCEStorage.clear()

      // Store parameters
      PKCEStorage.store(codeVerifier, state, provider)

      // Multiple verification attempts with delays
      let verificationAttempts = 0
      let storedParams = null

      while (verificationAttempts < 3 && !storedParams) {
        await new Promise((resolve) => setTimeout(resolve, 50)) // Small delay
        storedParams = PKCEStorage.retrieve()
        verificationAttempts++

        if (!storedParams) {
          console.warn(`[v0] PKCE verification attempt ${verificationAttempts} failed, retrying...`)
          // Re-store parameters
          PKCEStorage.store(codeVerifier, state, provider)
        }
      }

      if (!storedParams) {
        throw new Error("Failed to store PKCE parameters after multiple attempts")
      }

      console.log("[v0] PKCE parameters storage verified successfully after", verificationAttempts, "attempts")

      // Additional verification - check localStorage directly
      const directCheck = {
        codeVerifier: localStorage.getItem("oauth_code_verifier"),
        state: localStorage.getItem("oauth_state"),
        provider: localStorage.getItem("oauth_provider"),
        timestamp: localStorage.getItem("oauth_timestamp"),
      }

      console.log("[v0] Direct localStorage verification:", directCheck)

      if (!directCheck.codeVerifier || !directCheck.state || !directCheck.provider) {
        throw new Error("Direct localStorage verification failed")
      }

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
          scope: availableProvider.scopes.join(" "),
          state: `${state}&provider=google`,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        })

        oauthUrl = `${availableProvider.authUrl}?${params.toString()}`
      } else {
        throw new Error(
          `${provider} přihlášení není momentálně dostupné. Zkuste to prosím později nebo použijte email a heslo.`,
        )
      }

      console.log(`[v0] Final localStorage check before redirect:`)
      console.log(`[v0] Available keys:`, Object.keys(localStorage))
      console.log(`[v0] PKCE keys exist:`, {
        codeVerifier: !!localStorage.getItem("oauth_code_verifier"),
        state: !!localStorage.getItem("oauth_state"),
        provider: !!localStorage.getItem("oauth_provider"),
        timestamp: !!localStorage.getItem("oauth_timestamp"),
      })

      console.log(`[v0] Redirecting to ${provider} OAuth...`)

      await new Promise((resolve) => setTimeout(resolve, 200))

      // Redirect to OAuth provider
      window.location.href = oauthUrl
    } catch (error) {
      console.error(`Chyba při ${provider} přihlašování:`, error)
      PKCEStorage.clear()
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

  const logout = async () => {
    try {
      await oauthApi.logout()
    } catch (error) {
      console.error("Logout API error:", error)
      // Continue with local logout even if API fails
    }

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
    setUser,
  }

  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider as default }
