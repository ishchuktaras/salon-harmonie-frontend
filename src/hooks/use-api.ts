"use client"

// src/lib/api/use-api.ts

import { useAuth } from "./use-auth"
import { useCallback } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export function useApi() {
  const { user } = useAuth() 

  const apiFetch = useCallback(
    async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const headers = new Headers(options.headers || {})
      if (user?.token) {
        headers.set("Authorization", `Bearer ${user.token}`)
      }
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(errorData.message || "An API error occurred")
      }

      // Handle cases with no response body (e.g., 204 No Content)
      if (response.status === 204) {
        return null as T
      }

      return response.json()
    },
    [user?.token],
  )

  return { apiFetch }
}
