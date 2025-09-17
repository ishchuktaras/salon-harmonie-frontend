import apiClient from "./client"
import type { Service, CreateServiceDto, UpdateServiceDto } from "./types"

export const servicesApi = {
  async getAll(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>("/services")
    return response.data
  },

  async getById(id: number): Promise<Service> {
    const response = await apiClient.get<Service>(`/services/${id}`)
    return response.data
  },

  async create(data: CreateServiceDto): Promise<Service> {
    const response = await apiClient.post<Service>("/services", data)
    return response.data
  },

  async update(id: number, data: UpdateServiceDto): Promise<Service> {
    const response = await apiClient.patch<Service>(`/services/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/services/${id}`)
  },
}
