// Soubor: frontend/src/lib/api/types.ts

// --- Uživatelé a Terapeuté ---
// OPRAVA: Sjednoceno s backend odpovědí (obsahuje firstName a lastName)
export interface User {
  id: number
  email: string
  role: string
  firstName: string
  lastName: string
}

export interface Therapist {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type CreateTherapistDto = Omit<User, 'id'>
export type UpdateTherapistDto = Partial<CreateTherapistDto>

// --- Klienti ---
export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  pohodaId: string | null
  createdAt: string
}

export interface CreateClientDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
}
export type UpdateClientDto = Partial<CreateClientDto>

// --- Služby ---
export interface Service {
  id: number
  name: string
  description: string | null
  price: number
  duration: number // v minutách
  therapists: User[]
}

export interface CreateServiceDto {
  name: string
  description?: string
  price: number
  duration: number
  therapistIds?: number[]
}
export type UpdateServiceDto = Partial<CreateServiceDto>

// --- Rezervace ---
export interface Reservation {
  id: number
  startTime: string
  endTime: string
  status: string
  notes: string | null
  client?: Client
  service?: Service
  therapist?: User
}

export interface CreateReservationDto {
  clientId: number
  serviceId: number
  therapistId: number
  startTime: string
  notes?: string
}
export type UpdateReservationDto = Partial<Omit<CreateReservationDto, 'clientId'>>

// --- Transakce a Produkty ---
export interface Product {
  id: number
  name: string
  price: number
  stockQuantity: number
}

export interface TransactionItem {
  id: number
  name: string
  price: number
  quantity: number
  serviceId: number | null
  productId: number | null
}

export interface Transaction {
  id: number
  total: number
  paymentMethod: string
  status: string
  createdAt: string
  items: TransactionItem[]
  client: Client
  pohodaId: string | null
}

