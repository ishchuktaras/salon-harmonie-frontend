import { useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const useApi = () => {
  const { token } = useAuth()

  const apiFetch = useCallback(
    async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      } as Record<string, string>

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          ...options,
          headers,
        },
      )

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
      }

      if (
        response.headers.get('Content-Length') === '0' ||
        response.status === 204
      ) {
        return null as T
      }

      return response.json()
    },
    [token],
  )

  return { apiFetch }
}
