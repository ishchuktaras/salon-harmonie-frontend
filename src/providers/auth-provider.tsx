// src/providers/auth-provider.tsx

"use client"

import { useState, useEffect, type ReactNode, useCallback } from "react"
import { AuthContext, type LoginCredentials, type RegisterCredentials, type OAuthProvider } from "@/context/auth-context"
import { type User, UserRole } from "@/lib/api/types"
import apiClient from "@/lib/api/client"
import { generateCodeVerifier, generateCodeChallenge, PKCEStorage } from "@/lib/api/oauth/pkce"
import { oauthApi } from "@/lib/api/oauth"
import { useRouter } from "next/navigation"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUserProfile = useCallback(async () => {
    try {
      const userProfile = await apiClient.get<User>("/auth/profile");
      setUser(userProfile.data);
      return userProfile.data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchUserProfile().finally(() => setIsLoading(false));
  }, [fetchUserProfile]);

  const login = async (credentials: LoginCredentials) => {
    await apiClient.post("/auth/login", credentials);
    await fetchUserProfile();
  };

  const register = async (credentials: RegisterCredentials) => {
    await apiClient.post("/auth/register", credentials);
    // Po registraci by měl backend uživatele rovnou přihlásit (nastavit cookie)
    await fetchUserProfile();
  };

  const loginWithOAuth = async (provider: OAuthProvider) => {
    // Tato logika je již správná a zůstává beze změny
    const providersResponse = await oauthApi.getProviders();
    const availableProvider = providersResponse.providers.find((p) => p.id === provider);
    if (!availableProvider) throw new Error(`${provider} přihlášení není dostupné.`);

    const redirectUri = window.location.origin + "/auth/callback";
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
    if (!pkceParams) throw new Error("Chybí PKCE parametry.");

    const { codeVerifier, state: storedState } = pkceParams;
    const stateFromUrl = state.includes("&") ? state.split("&")[0] : state;
    if (stateFromUrl !== storedState) throw new Error("Neplatný state parametr.");
    
    // Voláme náš vlastní Next.js API endpoint
    await apiClient.post("/auth/oauth/callback", { code, codeVerifier });
    
    PKCEStorage.clear();

    const userData = await fetchUserProfile();
    return userData.role;
  };
  
  const getRoleBasedRedirectPath = (role: UserRole): string => {
    // ... implementace zůstává stejná
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    loginWithOAuth,
    handleOAuthCallback,
    getRoleBasedRedirectPath,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider as default };