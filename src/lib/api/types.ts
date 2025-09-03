// Tento soubor definuje datové struktury (typy) používané napříč frontendovou aplikací
// pro komunikaci s API. Zajišťuje, že frontend a backend "mluví stejným jazykem".

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
  email:string
  phone?: string | null
  pohodaId?: string | null
  createdAt: string
}

// DTO (Data Transfer Object) pro vytváření nového klienta.
export interface CreateClientDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

// DTO pro aktualizaci klienta. `Partial` znamená, že všechny vlastnosti jsou nepovinné.
export type UpdateClientDto = Partial<CreateClientDto>

export interface Therapist {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateTherapistDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}
export type UpdateTherapistDto = Partial<Omit<CreateTherapistDto, 'password' | 'role'>>


export interface Service {
  id: number
  name: string
  description?: string | null
  duration: number // v minutách
  price: number
  therapists: Therapist[]
}

export interface CreateServiceDto {
  name: string
  description?: string
  price: number
  duration: number
}

export type UpdateServiceDto = Partial<CreateServiceDto>


export interface Reservation {
  id: number
  clientId: number
  serviceId: number
  therapistId: number
  startTime: string
  endTime: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  notes?: string | null
  client?: Client
  service?: Service
  therapist?: Therapist
}

export interface CreateReservationDto {
  clientId: number;
  serviceId: number;
  therapistId: number;
  startTime: string;
  notes?: string;
}

// OPRAVA: Doplněn chybějící typ pro aktualizaci rezervace
export type UpdateReservationDto = Partial<Omit<CreateReservationDto, 'clientId'>> & {
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
};


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
  items: TransactionItem[]
  total: number
  paymentMethod: 'CASH' | 'CARD'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  pohodaId?: string | null
  createdAt: string
}

