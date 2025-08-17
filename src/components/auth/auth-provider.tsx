"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"

interface User {
  email: string
  role: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        try {
          apiClient.setToken(token)
          const userData = await apiClient.get<User>("/auth/profile")
          setUser(userData)
        } catch (error) {
          console.error("Token verification failed:", error)
          localStorage.removeItem("auth_token")
          apiClient.setToken(null)
        }
      }
      setIsLoading(false)
    }

    verifyToken()
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ access_token: string; user: User }>("/auth/login", {
        email,
        password,
        role,
      })

      apiClient.setToken(response.access_token)
      setUser(response.user)

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    apiClient.setToken(null)
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
