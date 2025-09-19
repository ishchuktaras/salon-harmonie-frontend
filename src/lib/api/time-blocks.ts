import apiClient from "./client"
import type { TimeBlock, CreateTimeBlockDto, UpdateTimeBlockDto } from "./types"

export const timeBlocksApi = {
  async getAll(): Promise<TimeBlock[]> {
    const response = await apiClient.get<TimeBlock[]>("/time-blocks")
    return response.data
  },

  async getById(id: number): Promise<TimeBlock> {
    const response = await apiClient.get<TimeBlock>(`/time-blocks/${id}`)
    return response.data
  },

  async create(data: CreateTimeBlockDto): Promise<TimeBlock> {
    const response = await apiClient.post<TimeBlock>("/time-blocks", data)
    return response.data
  },

  async update(id: number, data: UpdateTimeBlockDto): Promise<TimeBlock> {
    const response = await apiClient.patch<TimeBlock>(`/time-blocks/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/time-blocks/${id}`)
  },

  async getByTherapist(therapistId: number): Promise<TimeBlock[]> {
    const response = await apiClient.get<TimeBlock[]>(`/time-blocks?therapistId=${therapistId}`)
    return response.data
  },

  async getByDateRange(startDate: string, endDate: string): Promise<TimeBlock[]> {
    const response = await apiClient.get<TimeBlock[]>(`/time-blocks?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },
}
