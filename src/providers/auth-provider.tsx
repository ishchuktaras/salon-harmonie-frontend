// Soubor: src/providers/auth-provider.tsx

"use client";

import React, { useState, useEffect, ReactNode } from "react";
import {
  AuthContext,
  LoginResponse,
  LoginCredentials,
} from "@/context/auth-context";
import { User } from "@/lib/api/types";
import apiClient from "@/lib/api/client";
import Cookies from "js-cookie";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const userProfile = await apiClient.get<Omit<User, "token">>(
            "/auth/profile"
          );
          const completeUser: User = { ...userProfile.data, token: token };
          setUser(completeUser);
        } catch (error) {
          console.error(
            "Token je neplatný nebo se nepodařilo načíst data uživatele, odhlašuji.",
            error
          );
          Cookies.remove("token");
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      const loginResponseData = response.data;

      Cookies.set("token", loginResponseData.access_token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      const userToStore: User = {
        ...loginResponseData.user,
        token: loginResponseData.access_token,
      };
      setUser(userToStore);
    } catch (error) {
      console.error("Chyba při přihlašování:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  const value = { user, login, logout, isLoading };

  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
