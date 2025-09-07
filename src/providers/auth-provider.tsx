// Soubor: src/providers/auth-provider.tsx
// Popis: Toto je "motor" autentizace. Komponenta AuthProvider obsahuje veškerou logiku:
// - Uchovává stav přihlášeného uživatele.
// - Načítá uživatele z localStorage, aby zůstal přihlášený i po obnovení stránky.
// - Poskytuje stav a funkce (login, logout) zbytku aplikace.

'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, LoginResponse } from '@/context/auth-context';
import { User } from '@/lib/api/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Stav pro uchování dat o přihlášeném uživateli.
  const [user, setUser] = useState<User | null>(null);
  // Stav, který sleduje, zda se ještě načítá počáteční stav z localStorage.
  const [isLoading, setIsLoading] = useState(true);

  // Tento efekt se spustí jen jednou na klientovi po prvním načtení.
  useEffect(() => {
    try {
      // Pokusíme se načíst data uživatele z paměti prohlížeče.
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // Pokud data existují, nastavíme je do stavu.
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Nepodařilo se zpracovat uživatele z localStorage", error);
      localStorage.removeItem('user'); // Pokud jsou data poškozená, odstraníme je.
    } finally {
      // Ať už to dopadlo jakkoliv, načítání je dokončeno.
      setIsLoading(false);
    }
  }, []); // Prázdné pole závislostí znamená, že se efekt spustí jen jednou.

  // Funkce pro přihlášení uživatele.
  const login = (loginResponseData: LoginResponse) => {
    const userToStore: User = {
      ...loginResponseData.user,
      token: loginResponseData.token, 
    };
    
    // Uložíme data do localStorage pro trvalé přihlášení.
    localStorage.setItem('user', JSON.stringify(userToStore));
    // Aktualizujeme stav v aplikaci.
    setUser(userToStore);
  };

  // Funkce pro odhlášení uživatele.
  const logout = () => {
    // Odstraníme data z localStorage.
    localStorage.removeItem('user');
    // Odstraníme data ze stavu aplikace.
    setUser(null);
  };

  // Vytvoříme objekt 'value', který bude poskytnut všem komponentám uvnitř Provideru.
  const value = { user, login, logout, isLoading };
  
  // DŮLEŽITÉ: Zabráníme zobrazení obsahu, dokud se nenačte stav přihlášení.
  // Tímto předcházíme chybám hydratace.
  if (isLoading) {
    return null; // Zde může být případně načítací animace (spinner).
  }

  // Komponenta Provider, která "obalí" aplikaci a předá jí hodnoty.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

