import { useAuth } from '@/app/(app)/auth/AuthContext';

// Definuje základní URL pro API, aby se nemuselo opakovat
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Vlastní hook pro provádění API požadavků s automatickým přidáním autorizačního tokenu.
 * Obaluje nativní `fetch` a zjednodušuje práci s API v komponentách.
 */
export const useApi = () => {
  const { token, logout } = useAuth();

  const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const { headers, ...restOptions } = options;

    // Vytvoření hlaviček a přidání autorizačního tokenu, pokud existuje
    const requestHeaders = new Headers(headers);
    requestHeaders.append('Content-Type', 'application/json');
    if (token) {
      requestHeaders.append('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers: requestHeaders,
      });

      // Pokud je odpověď 401 Unauthorized, znamená to neplatný token, odhlásíme uživatele
      if (response.status === 401) {
        logout();
        throw new Error('Neautorizovaný přístup');
      }

      if (!response.ok) {
        // Pokusíme se získat chybovou zprávu z těla odpovědi
        const errorData = await response.json().catch(() => ({ message: 'Došlo k neznámé chybě' }));
        throw new Error(errorData.message || `Chyba ${response.status}`);
      }
      
      // Pokud je odpověď úspěšná, ale bez obsahu (např. status 204)
      if (response.status === 204) {
        return null as T;
      }

      return await response.json() as T;

    } catch (error) {
      console.error('API fetch error:', error);
      // Předáme chybu dál, aby ji mohla komponenta zpracovat
      throw error;
    }
  };

  return { apiFetch };
};
