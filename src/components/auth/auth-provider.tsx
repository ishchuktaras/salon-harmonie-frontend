// src/components/auth/auth-provider.tsx

"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProfileApiResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

interface User extends ProfileApiResponse {
  name: string
}

interface AuthContextType {
  user: User | null
  login: (userData: { user: ProfileApiResponse; accessToken: string }) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setUser(null)
    if (pathname !== "/login") {
      router.push("/login")
    }
  }, [router, pathname])

  useEffect(() => {
    const verifyUserOnLoad = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        try {
          const profile = await apiClient.get<ProfileApiResponse>("/auth/profile")
          setUser({
            ...profile,
            name: `${profile.firstName} ${profile.lastName}`,
          })
        } catch (error) {
          console.error("Token verification failed, logging out:", error)
          logout()
        }
      }
      setIsLoading(false)
    }
    verifyUserOnLoad()
  }, [logout])

  const login = (userData: { user: ProfileApiResponse; accessToken: string }) => {
    localStorage.setItem("auth_token", userData.accessToken)
    setUser({
      ...userData.user,
      name: `${userData.user.firstName} ${userData.user.lastName}`,
    })
    router.push("/dashboard")
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
