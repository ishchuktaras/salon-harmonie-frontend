// Soubor: src/providers/auth-provider.tsx
// Popis: Finální verze s opravenými importy z knihovny React.

'use client';

// OPRAVA ZDE: Doplnili jsme chybějící `useEffect` a `ReactNode` do importu.
import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, LoginResponse, LoginCredentials } from '@/context/auth-context';
import { User } from '@/lib/api/types';
import apiClient from '@/lib/api/client';
import Cookies from 'js-cookie';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await apiClient.get<Omit<User, 'token'>>('/auth/me');
          const userProfile = response.data;
          const completeUser: User = { ...userProfile, token: token };
          setUser(completeUser);
        } catch (error) {
          console.error("Token je neplatný nebo se nepodařilo načíst data uživatele, odhlašuji.", error);
          Cookies.remove('token');
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      const loginResponseData = response.data;
      Cookies.set('token', loginResponseData.token, { expires: 7, secure: true });
      const userToStore: User = { ...loginResponseData.user, token: loginResponseData.token };
      setUser(userToStore);
    } catch (error) {
      console.error("Chyba při přihlašování:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const value = { user, login, logout, isLoading };
  
  if (isLoading) {
    return null; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}