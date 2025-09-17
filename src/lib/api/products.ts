import apiClient from "./client"
import type { Product } from "./types"

interface CreateProductDto {
  name: string
  price: number
  stockQuantity: number
}

type UpdateProductDto = Partial<CreateProductDto>

export const productsApi = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>("/products")
    return response.data
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>("/products", data)
    return response.data
  },

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  },

  async updateStock(id: number, quantity: number): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}/stock`, { stockQuantity: quantity })
    return response.data
  },
}
