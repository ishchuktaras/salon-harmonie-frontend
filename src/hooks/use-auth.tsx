// Soubor: src/hooks/use-auth.ts
// Popis: Toto je vlastní "Hook", který zjednodušuje přístup k autentizačnímu kontextu.
// Místo psaní `useContext(AuthContext)` v každé komponentě stačí zavolat `useAuth()`.
// Zajišťuje také, že kontext je používán správně.

'use client';
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context/auth-context';

export function useAuth(): AuthContextType {
  // Použijeme vestavěný React Hook `useContext` k přečtení hodnot z našeho AuthContextu.
  const context = useContext(AuthContext);

  // Pokud je kontext 'undefined', znamená to, že se komponenta nachází mimo AuthProvider.
  // V takovém případě vyhodíme chybu, abychom na to vývojáře upozornili.
  if (context === undefined) {
    throw new Error('useAuth musí být použit uvnitř AuthProvider');
  }

  // Pokud je vše v pořádku, vrátíme data a funkce z kontextu.
  return context;
}

