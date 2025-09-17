// src/lib/api/use-api.ts

import { useAuth } from './use-auth';
import { useCallback } from 'react';

// You would define your API configuration here
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useApi() {
  const { user } = useAuth() // Assuming you need auth state

  const apiFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}): Promise<any> => {
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
        return null
      }

      return response.json()
    },
    [user?.token],
  )

  return { apiFetch }
}
