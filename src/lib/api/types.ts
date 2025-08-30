// Tento soubor definuje TypeScript typy pro data přicházející z našeho API.
// Měl by být v souladu s Prisma schématem na backendu.

// Uživatel systému (zaměstnanec)
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // Např. 'ADMIN', 'TERAPEUT', atd.
}

// Klient salonu
export interface Client {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  pohodaId: string | null; // ID z účetního systému
  createdAt: string; // ISO 8601 string
}

// Služba nabízená salonem
export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number; // v minutách
}

// Rezervace termínu
export interface Reservation {
  id: number;
  startTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
  status: string;
  notes: string | null;
  clientId: number;
  serviceId: number;
  therapistId: number;
  client?: Client;
  service?: Service;
  therapist?: User; // Terapeut je také User
}

// Produkt k prodeji
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  pohodaId: string | null;
}

// Položka na účtence (transakci)
export interface TransactionItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  productId?: number;
  serviceId?: number;
}

// Transakce (účtenka/prodejka)
export interface Transaction {
  id: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string; // ISO 8601 string
  clientId: number;
  pohodaId: string | null; // ID z účetního systému
  reservationId: number | null;
  items: TransactionItem[];
  client?: Client;
}

// --- Data Transfer Objects (DTOs) ---
// Objekty pro vytváření nových záznamů

export interface CreateClientDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreateReservationDto {
  startTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
  clientId: number;
  serviceId: number;
  therapistId: number;
  notes?: string;
}

export interface CreateTransactionItemDto {
  name: string;
  price: number;
  quantity: number;
  productId?: number;
  serviceId?: number;
}

export interface CreateTransactionDto {
  total: number;
  paymentMethod: string;
  clientId: number;
  reservationId?: number;
  items: CreateTransactionItemDto[];
}
