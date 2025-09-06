"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import Cookies from "js-cookie";

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<LoginResponse>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    const storedUser = localStorage.getItem("authUser");

    if (tokenFromCookie && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(tokenFromCookie);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem("authUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password: pass,
      });

      const { access_token, user: userData } = response;

      Cookies.set("token", access_token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          name: userData.name,
          email: userData.email,
          role: userData.role,
        })
      );
      setUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      setToken(access_token);

      return response;
    } catch (error: any) {
      if (error.response) {
        console.error("Chyba odpovědi od serveru:", error.response.data);
      } else {
        console.error("Chyba při přihlašování:", error.message);
      }
      throw error;
    }
  };


  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("authUser");
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  const value = {
    isAuthenticated: !!user,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
