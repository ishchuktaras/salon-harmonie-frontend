// Tento soubor definuje, jak vypadají data, se kterými pracujeme.
// Díky tomu máme jistotu, že frontend a backend si rozumí.

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  address?: string
  notes?: string
  loyaltyPoints: number
  preferences?: string[]
  allergies?: string[]
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number // in minutes
  price: number
  category: string
  isActive: boolean
  therapistIds?: string[]
  createdAt: string
  updatedAt: string
}

export interface Reservation {
  id: string
  clientId: string
  serviceId: string
  therapistId?: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  client?: Client
  service?: Service
  therapist?: Therapist
}

export interface CreateClientDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  address?: string
  notes?: string
  preferences?: string[]
  allergies?: string[]
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface CreateReservationDto {
  clientId: string
  serviceId: string
  therapistId?: string
  startTime: string
  endTime: string
  notes?: string
}

export interface UpdateReservationDto extends Partial<CreateReservationDto> {
  status?: "pending" | "confirmed" | "cancelled" | "completed"
}

export interface CreateServiceDto {
  name: string
  description?: string
  duration: number
  price: number
  category: string
  therapistIds?: string[]
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {
  isActive?: boolean
}

export interface Therapist {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specializations: string[]
  isActive: boolean
  workingHours?: {
    [key: string]: { start: string; end: string }
  }
  createdAt: string
  updatedAt: string
}

export interface CreateTherapistDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  specializations: string[]
  workingHours?: {
    [key: string]: { start: string; end: string }
  }
}

export interface UpdateTherapistDto extends Partial<CreateTherapistDto> {
  isActive?: boolean
}

// Nové typy pro POS
export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export interface TransactionItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: 'service' | 'product';
}

export interface Transaction {
    id: string;
    items: TransactionItem[];
    total: number;
    paymentMethod: 'cash' | 'card';
    createdAt: string;
}
