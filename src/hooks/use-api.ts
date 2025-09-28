// Soubor: src/hooks/use-api.ts

import { useAuth } from "@/hooks/use-auth";
import { useCallback } from "react";

export const useApi = () => {
  const { user, logout } = useAuth();

  const request = useCallback(
    async <T = any>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> => {
      const headers = new Headers(options.headers || {});

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          ...options,
          headers,
        }
      );

      if (response.status === 401) {
        // Token je neplatný nebo vypršel, odhlásíme uživatele
        logout();
        throw new Error("Neautorizovaný přístup");
      }

      if (!response.ok) {
        throw new Error(`API chyba: ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    },
    [logout] 
  );

  return { request };
};
