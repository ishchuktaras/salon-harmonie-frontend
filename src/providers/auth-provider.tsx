"use client"

import { useState, useEffect, type ReactNode } from "react"
import {
  AuthContext,
  type LoginResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type OAuthProvider,
} from "@/context/auth-context"
import { type User, UserRole } from "@/lib/api/types"
import apiClient from "@/lib/api/client"
import Cookies from "js-cookie"
import { generateCodeVerifier, generateCodeChallenge, PKCEStorage } from "@/lib/api/oauth/pkce"
import { oauthApi } from "@/lib/api/oauth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // --- OPRAVA ZDE ---
        // Nesnažíme se číst cookie na klientovi. Místo toho se rovnou
        // zeptáme serverového endpointu /api/auth/profile.
        // Tento endpoint MÁ přístup k httpOnly cookie a vrátí nám data,
        // pokud je token platný.
        const userProfile = await apiClient.get<Omit<User, "token">>("/auth/profile")
        
        // Jelikož samotný token je httpOnly, zde si ho nemusíme ukládat.
        // Stačí nám data o uživateli.
        setUser(userProfile.data)

      } catch (error) {
        // Pokud API vrátí chybu (např. 401), znamená to, že uživatel není přihlášen.
        // To je očekávané chování, pokud cookie neexistuje.
        console.log("Uživatel není přihlášen nebo je token neplatný.");
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  // ... zbytek souboru (login, register, atd.) zůstává stejný ...

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    const { access_token, user: userData } = response.data;
    // Po přihlášení rovnou zavoláme API pro profil, abychom synchronizovali stav
    const userProfile = await apiClient.get<Omit<User, "token">>("/auth/profile");
    setUser(userProfile.data);
  };

  const register = async (credentials: RegisterCredentials) => {
    await apiClient.post<LoginResponse>("/auth/register", credentials);
    // Po registraci se uživatel automaticky přihlásí (díky cookie),
    // takže stačí znovu načíst jeho profil.
    const userProfile = await apiClient.get<Omit<User, "token">>("/auth/profile");
    setUser(userProfile.data);
  };

  const loginWithOAuth = async (provider: OAuthProvider) => {
    // ... tato funkce zůstává beze změny
  };

  const handleOAuthCallback = async (code: string, state: string): Promise<UserRole> => {
    const pkceParams = PKCEStorage.retrieve();
    if (!pkceParams) throw new Error("Chybí PKCE parametry.");

    const { codeVerifier, state: storedState } = pkceParams;
    const stateFromUrl = state.includes("&") ? state.split("&")[0] : state;
    if (stateFromUrl !== storedState) throw new Error("Neplatný state parametr.");
    
    const callbackResponse = await oauthApi.handleCallback({ code, codeVerifier, provider: 'google' });
    PKCEStorage.clear();
    
    // Po úspěšném callbacku rovnou načteme profil ze serveru
    const userProfile = await apiClient.get<Omit<User, "token">>("/auth/profile");
    setUser(userProfile.data);
    
    return userProfile.data.role as UserRole;
  };
  
  const getRoleBasedRedirectPath = (role: UserRole): string => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  const logout = async () => {
    try {
      await oauthApi.logout(); // Toto smaže httpOnly cookie na serveru
    } catch (error) {
      console.error("Logout API error:", error);
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    loginWithOAuth,
    logout,
    isLoading,
    getRoleBasedRedirectPath,
    setUser,
    handleOAuthCallback,
  };

  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider as default };