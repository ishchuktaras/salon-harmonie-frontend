"use client"
import { createContext } from "react"
import type { User, UserRole } from "@/lib/api/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    role: UserRole
  }
}

export type OAuthProvider = "google" | "apple"

export interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>
  logout: () => void
  isLoading: boolean
  getRoleBasedRedirectPath: (role: UserRole) => string
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
