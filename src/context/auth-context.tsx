// Soubor: src/context/auth-context.tsx
// Popis: Ujišťujeme se, že všechny potřebné typy jsou exportovány.

'use client'; 
import { createContext } from 'react';
import { User, UserRole } from '@/lib/api/types';

// Ujistíme se, že je tento typ exportován.
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>; 
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

