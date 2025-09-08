import  apiClient  from "./client"
import type { Reservation, CreateReservationDto, UpdateReservationDto } from "./types"

// Objekt, který seskupuje všechny funkce pro práci s rezervacemi.
// Je to přehlednější a lépe se to bude udržovat.
export const reservationsApi = {
  async getAll(): Promise<Reservation[]> {
    return apiClient.get("/reservations")
  },

  async getById(id: string): Promise<Reservation> {
    return apiClient.get(`/reservations/${id}`)
  },

  async create(data: CreateReservationDto): Promise<Reservation> {
    return apiClient.post("/reservations", data)
  },

  async update(id: string, data: UpdateReservationDto): Promise<Reservation> {
    return apiClient.patch(`/reservations/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/reservations/${id}`)
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Reservation[]> {
    return apiClient.get(`/reservations?startDate=${startDate}&endDate=${endDate}`)
  },

  async getByClient(clientId: string): Promise<Reservation[]> {
    return apiClient.get(`/reservations?clientId=${clientId}`)
  },

  async getByTherapist(therapistId: string): Promise<Reservation[]> {
    return apiClient.get(`/reservations?therapistId=${therapistId}`)
  },
}
