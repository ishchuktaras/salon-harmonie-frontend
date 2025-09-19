// Soubor: frontend/src/lib/api/types.ts

// --- Enumy pro lepší typovou bezpečnost ---
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  TERAPEUT = "TERAPEUT",
  RECEPCNI = "RECEPCNI",
  ASISTENT = "ASISTENT",
  KOORDINATOR = "KOORDINATOR",
  MASER = "MASER",
  MANAGER = "MANAGER",
  ESHOP_SPRAVCE = "ESHOP_SPRAVCE",
  CLIENT = "CLIENT", // Added missing CLIENT role for customer registration
}

export enum ReservationStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
}

export enum TransactionStatus {
  Paid = "PAID",
  Unpaid = "UNPAID",
}

export enum TimeBlockType {
  BREAK = "BREAK",
  VACATION = "VACATION",
  SICK_LEAVE = "SICK_LEAVE",
  OTHER = "OTHER",
}

// --- Uživatelé ---
export interface User {
  id: number
  email: string
  role: UserRole
  firstName: string
  lastName: string
  token: string
}

export type CreateTherapistDto = Omit<User, "id" | "token">
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
  status: ReservationStatus // NÁVRH: Použití enumu
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
export type UpdateReservationDto = Partial<Omit<CreateReservationDto, "clientId">> & {
  endTime?: string
}

// --- Časové bloky ---
export interface TimeBlock {
  id: number
  startTime: string
  endTime: string
  type: TimeBlockType
  reason: string | null
  therapist?: User
}

export interface CreateTimeBlockDto {
  therapistId: number
  startTime: string
  endTime: string
  type: TimeBlockType
  reason?: string
}

export type UpdateTimeBlockDto = Partial<CreateTimeBlockDto>

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
  status: TransactionStatus // NÁVRH: Použití enumu
  createdAt: string
  items: TransactionItem[]
  client: Client
  pohodaId: string | null
}
