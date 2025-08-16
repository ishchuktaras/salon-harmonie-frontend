import { apiClient } from "./client"
import type { Service, CreateServiceDto, UpdateServiceDto } from "./types"

export const servicesApi = {
  async getAll(): Promise<Service[]> {
    return apiClient.get("/services")
  },

  async getById(id: string): Promise<Service> {
    return apiClient.get(`/services/${id}`)
  },

  async create(data: CreateServiceDto): Promise<Service> {
    return apiClient.post("/services", data)
  },

  async update(id: string, data: UpdateServiceDto): Promise<Service> {
    return apiClient.patch(`/services/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/services/${id}`)
  },

  async getByCategory(category: string): Promise<Service[]> {
    return apiClient.get(`/services?category=${encodeURIComponent(category)}`)
  },

  async getTherapists(): Promise<any[]> {
    // This method fetches therapists from the users endpoint with therapist role
    return apiClient.get("/users?role=therapist")
  },
}
