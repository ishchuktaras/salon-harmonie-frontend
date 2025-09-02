import { apiClient } from "./client"
import type { Therapist, CreateTherapistDto, UpdateTherapistDto } from "./types"

export const therapistsApi = {
  async getAll(): Promise<Therapist[]> {
    // Backend endpoint pro terapeuty je pravděpodobně na /users/therapists
    const response = await apiClient.get<Therapist[]>("/users/therapists")
    return response
  },

  async getById(id: number): Promise<Therapist> {
    const response = await apiClient.get<Therapist>(`/users/${id}`)
    return response
  },

  async create(data: CreateTherapistDto): Promise<Therapist> {
    const response = await apiClient.post<Therapist>("/users", data)
    return response
  },

  async update(id: number, data: UpdateTherapistDto): Promise<Therapist> {
    const response = await apiClient.patch<Therapist>(`/users/${id}`, data)
    return response
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },
}
