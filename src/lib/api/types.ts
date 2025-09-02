// src/lib/api/types.ts

export interface User {
  id: number
  email: string
  role: string
  firstName?: string
  lastName?: string
}

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  createdAt: string
  pohodaId: string | null
}

export interface Service {
  id: number
  name: string
  description: string | null
  duration: number // v minutách
  price: number
  therapists: User[]
}

export interface Reservation {
  id: number
  startTime: string
  endTime: string
  status: string
  notes: string | null
  clientId: number
  serviceId: number
  therapistId: number
  client?: Client
  service?: Service
  therapist?: User
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stockQuantity: number
}

export interface TransactionItem {
  id: number
  name: string
  price: number
  quantity: number
  productId: number | null
  serviceId: number | null
}

export interface Transaction {
  id: number
  total: number
  paymentMethod: string
  status: string
  createdAt: string
  clientId: number
  pohodaId: string | null
  items: TransactionItem[]
  client: Client
}

// --- DTOs (Data Transfer Objects) ---

export interface CreateClientDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface CreateReservationDto {
  clientId: number
  serviceId: number
  therapistId: number
  startTime: string
  endTime: string
  notes?: string
}

export interface UpdateReservationDto extends Partial<Omit<CreateReservationDto, 'clientId'>> {
  status?: string
}

