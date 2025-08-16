import { apiClient } from "./client"
import type { Client, CreateClientDto, UpdateClientDto } from "./types"

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    return apiClient.get("/clients")
  },

  async getById(id: string): Promise<Client> {
    return apiClient.get(`/clients/${id}`)
  },

  async create(data: CreateClientDto): Promise<Client> {
    return apiClient.post("/clients", data)
  },

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    return apiClient.patch(`/clients/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/clients/${id}`)
  },

  async search(query: string): Promise<Client[]> {
    return apiClient.get(`/clients/search?q=${encodeURIComponent(query)}`)
  },

  async getReservations(id: string): Promise<any[]> {
    return apiClient.get(`/clients/${id}/reservations`)
  },
}
