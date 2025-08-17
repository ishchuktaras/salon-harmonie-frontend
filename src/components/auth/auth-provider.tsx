// src/components/auth/auth-provider.tsx

"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  name: string // Spojené jméno
}

interface AuthContextType {
  user: User | null
  login: (userData: { user: User; accessToken: string }) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        try {
          const profile = await apiClient.get<User>("/auth/profile")
          setUser({ ...profile, name: `${profile.firstName} ${profile.lastName}` })
        } catch (error) {
          console.error("Token verification failed, logging out:", error)
          logout()
        }
      }
      setIsLoading(false)
    }
    verifyToken()
  }, [])

  const login = (userData: { user: User; accessToken: string }) => {
    localStorage.setItem("auth_token", userData.accessToken)
    setUser({ ...userData.user, name: `${userData.user.firstName} ${userData.user.lastName}` })
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
