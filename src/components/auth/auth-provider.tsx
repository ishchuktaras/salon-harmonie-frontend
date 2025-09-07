"use client";

import React, { createContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  access_token: string;
  user: { id: number; email: string; name: string; role: string; }
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  useEffect(() => {
    const tokenFromCookie = Cookies.get('token');
    const storedUser = localStorage.getItem('authUser');
    if (tokenFromCookie && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(tokenFromCookie);
      } catch (e) {
        console.error("Failed to parse user data, logging out.", e);
        logout();
      }
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', { email, password: pass });
      const { access_token, user: userData } = response;
      
      Cookies.set('token', access_token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      localStorage.setItem('authUser', JSON.stringify({ name: userData.name, email: userData.email, role: userData.role }));
      setUser({ name: userData.name, email: userData.email, role: userData.role });
      setToken(access_token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const value = { isAuthenticated: !!user, user, token, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};