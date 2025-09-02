import { apiClient } from "./client"
import type { Client, CreateClientDto, UpdateClientDto } from "./types"

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    const response = await apiClient.get<Client[]>("/clients")
    return response
  },

  async getById(id: number): Promise<Client> {
    const response = await apiClient.get<Client>(`/clients/${id}`)
    return response
  },

  async create(data: CreateClientDto): Promise<Client> {
    const response = await apiClient.post<Client>("/clients", data)
    return response
  },

  async update(id: number, data: UpdateClientDto): Promise<Client> {
    const response = await apiClient.patch<Client>(`/clients/${id}`, data)
    return response
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/clients/${id}`)
  },
}
