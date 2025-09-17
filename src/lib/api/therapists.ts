// src/frontend/src/lib/api/therapists.ts

import apiClient from "./client";
import type { User, CreateTherapistDto, UpdateTherapistDto } from "./types";

export const therapistsApi = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/users/therapists");

    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);

    return response.data;
  },

  // Funkce vrací jednoho uživatele (User)
  async create(data: CreateTherapistDto): Promise<User> {
    const response = await apiClient.post<User>("/users", data);

    return response.data;
  },

  async update(id: number, data: UpdateTherapistDto): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);

    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
