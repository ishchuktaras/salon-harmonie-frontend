// src/frontend/src/lib/api/clients.ts

import apiClient from "./client"; 
import type { Client, CreateClientDto, UpdateClientDto } from "./types";

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    const response = await apiClient.get<Client[]>("/clients");
    
    return response.data;
  },

  async getById(id: number): Promise<Client> {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    
    return response.data;
  },

  async create(data: CreateClientDto): Promise<Client> {
    const response = await apiClient.post<Client>("/clients", data);
   
    return response.data;
  },

  async update(id: number, data: UpdateClientDto): Promise<Client> {
    const response = await apiClient.patch<Client>(`/clients/${id}`, data);
    
    return response.data;
  },

  async delete(id: number): Promise<void> {
    
    await apiClient.delete(`/clients/${id}`);
  },
};

    
