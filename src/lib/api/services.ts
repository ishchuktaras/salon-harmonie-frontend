import apiClient from "./client";
import type {
  Reservation,
  CreateReservationDto,
  UpdateReservationDto,
} from "./types";

// Objekt, který seskupuje všechny funkce pro práci s rezervacemi.
export const reservationsApi = {
  async getAll(): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>("/reservations");

    return response.data;
  },

  async getById(id: number): Promise<Reservation> {
    const response = await apiClient.get<Reservation>(`/reservations/${id}`);

    return response.data;
  },

  async create(data: CreateReservationDto): Promise<Reservation> {
    const response = await apiClient.post<Reservation>("/reservations", data);

    return response.data;
  },

  async update(id: number, data: UpdateReservationDto): Promise<Reservation> {
    const response = await apiClient.patch<Reservation>(
      `/reservations/${id}`,
      data
    );

    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/reservations/${id}`);
  },
};
