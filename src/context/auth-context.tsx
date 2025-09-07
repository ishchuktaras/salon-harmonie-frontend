// Soubor: src/context/auth-context.tsx
// Popis: Tento soubor definuje "datovou schránku" (Context) pro autentizaci.
// Určuje, jaké hodnoty (uživatel, funkce login/logout) budou dostupné v celé aplikaci.
// Neobsahuje žádnou logiku, pouze definice.

'use client'; // Tento kontext bude používán v klientských komponentách
import { createContext } from 'react';
import { User, UserRole } from '@/lib/api/types';

// Rozhraní (interface) pro data, která vrací API po úspěšném přihlášení.
// Pomáhá nám udržet typovou bezpečnost.
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

// Rozhraní definující, co všechno náš kontext poskytuje:
// - user: Objekt s daty přihlášeného uživatele, nebo null.
// - login: Funkce pro přihlášení.
// - logout: Funkce pro odhlášení.
// - isLoading: Příznak, který říká, zda se stále zjišťuje stav přihlášení.
export interface AuthContextType {
  user: User | null;
  login: (loginResponseData: LoginResponse) => void; 
  logout: () => void;
  isLoading: boolean;
}

// Vytvoření samotného React Contextu s výchozí hodnotou 'undefined'.
// Komponenty později použijí tento objekt k získání dat.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

