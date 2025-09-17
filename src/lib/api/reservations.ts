import apiClient from "./client"
import type { Reservation, CreateReservationDto, UpdateReservationDto } from "./types"

// Objekt, který seskupuje všechny funkce pro práci s rezervacemi.
export const reservationsApi = {
  async getAll(): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>("/reservations")
    return response.data
  },

  async getById(id: number): Promise<Reservation> {
    const response = await apiClient.get<Reservation>(`/reservations/${id}`)
    return response.data
  },

  async create(data: CreateReservationDto): Promise<Reservation> {
    const response = await apiClient.post<Reservation>("/reservations", data)
    return response.data
  },

  async update(id: number, data: UpdateReservationDto): Promise<Reservation> {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/reservations/${id}`)
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>(`/reservations?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },

  async getByClient(clientId: number): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>(`/reservations?clientId=${clientId}`)
    return response.data
  },

  async getByTherapist(therapistId: number): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>(`/reservations?therapistId=${therapistId}`)
    return response.data
  },
}
