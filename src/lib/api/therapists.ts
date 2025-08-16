import { apiClient } from "./client"
import type { Therapist, CreateTherapistDto, UpdateTherapistDto } from "./types"

export const therapistsApi = {
  async getAll(): Promise<Therapist[]> {
    return apiClient.get("/users?role=therapist")
  },

  async getById(id: string): Promise<Therapist> {
    return apiClient.get(`/users/${id}`)
  },

  async create(data: CreateTherapistDto): Promise<Therapist> {
    return apiClient.post("/users", { ...data, role: "therapist" })
  },

  async update(id: string, data: UpdateTherapistDto): Promise<Therapist> {
    return apiClient.patch(`/users/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`)
  },

  async getAvailability(therapistId: string, date: string): Promise<any[]> {
    return apiClient.get(`/calendar/availability?therapistId=${therapistId}&date=${date}`)
  },
}
