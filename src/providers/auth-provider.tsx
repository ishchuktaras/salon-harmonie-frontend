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
      const token = Cookies.get("token")
      if (token) {
        try {
          const userProfile = await apiClient.get<Omit<User, "token">>("/auth/profile")
          const completeUser: User = { ...userProfile.data, token: token }
          setUser(completeUser)
        } catch (error) {
          console.error("Token je neplatný, odhlašuji.", error)
          Cookies.remove("token")
        }
      }
      setIsLoading(false)
    }
    initializeUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    const { access_token, user: userData } = response.data;
    Cookies.set("token", access_token, { expires: 7 });
    const userToStore: User = { ...userData, token: access_token };
    setUser(userToStore);
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await apiClient.post<LoginResponse>("/auth/register", credentials);
    const { access_token, user: userData } = response.data;
    Cookies.set("token", access_token, { expires: 7 });
    const userToStore: User = { ...userData, token: access_token };
    setUser(userToStore);
  };

  const loginWithOAuth = async (provider: OAuthProvider) => {
    const providersResponse = await oauthApi.getProviders();
    const availableProvider = providersResponse.providers.find((p) => p.id === provider);
    if (!availableProvider) throw new Error(`${provider} přihlášení není dostupné.`);

    const redirectUri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/auth/callback"
        : "https://salon-harmonie-frontend.vercel.app/auth/callback";

    const state = Math.random().toString(36).substring(2, 15);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    PKCEStorage.store(codeVerifier, state, provider);

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: availableProvider.scopes.join(" "),
      state: `${state}&provider=${provider}`,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    window.location.href = `${availableProvider.authUrl}?${params.toString()}`;
  };

  const handleOAuthCallback = async (code: string, state: string): Promise<UserRole> => {
    const pkceParams = PKCEStorage.retrieve();
    if (!pkceParams) {
        throw new Error("Chybí PKCE parametry pro ověření.");
    }

    const { codeVerifier, state: storedState } = pkceParams;
    const stateFromUrl = state.includes("&") ? state.split("&")[0] : state;
    if (stateFromUrl !== storedState) {
        throw new Error("Neplatný state parametr.");
    }
    
    const callbackResponse = await oauthApi.handleCallback({
        code,
        codeVerifier,
        provider: 'google',
    });

    PKCEStorage.clear();

    const userWithToken: User = {
        ...callbackResponse.user,
        id: parseInt(String(callbackResponse.user.id), 10),
        token: callbackResponse.access_token,
        
        role: callbackResponse.user.role as UserRole,
    };
    
    setUser(userWithToken);
    
    return userWithToken.role; // Vracíme již správně otypovanou roli
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
      await oauthApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }
    Cookies.remove("token");
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