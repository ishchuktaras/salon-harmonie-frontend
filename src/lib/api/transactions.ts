import apiClient from "./client"
import type { Transaction } from "./types"

interface CreateTransactionDto {
  items: {
    id: string
    type: "service" | "product"
    quantity: number
  }[]
  paymentMethod: "cash" | "card"
  clientId?: number
}

export const transactionsApi = {
  async getAll(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>("/transactions")
    return response.data
  },

  async getById(id: number): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>("/transactions", data)
    return response.data
  },

  async getByClient(clientId: number): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>(`/transactions?clientId=${clientId}`)
    return response.data
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>(`/transactions?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },
}
