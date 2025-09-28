"use client"
import { createContext, type Dispatch, type SetStateAction } from "react"
import type { User, UserRole } from "@/lib/api/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
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
  register: (credentials: RegisterCredentials) => Promise<void>
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>
  handleOAuthCallback: (code: string, state: string) => Promise<UserRole>; 
  logout: () => void
  isLoading: boolean
  getRoleBasedRedirectPath: (role: UserRole) => string
  setUser: Dispatch<SetStateAction<User | null>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
