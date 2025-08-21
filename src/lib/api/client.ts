import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
    });

    // Toto je klíčová část: "interceptor", který se spustí před každým požadavkem
    this.client.interceptors.request.use((config) => {
      // Získáme token z cookies
      const token = Cookies.get('token');
      // Pokud token existuje, přidáme ho do hlavičky 'Authorization'
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      // Zpracování chyby při odesílání požadavku
      return Promise.reject(error);
    });
  }

  async get<T>(url: string, params = {}) {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data: any) {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any) {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
