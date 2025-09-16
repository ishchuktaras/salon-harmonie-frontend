"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AuthContext, type LoginResponse, type LoginCredentials, type OAuthProvider } from "@/context/auth-context"
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

      Cookies.set("token", loginResponseData.access_token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      })

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

  const loginWithOAuth = async (provider: OAuthProvider) => {
    try {
      // Redirect to OAuth provider
      const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`
      window.location.href = authUrl
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
