import axios from 'axios';
import Cookies from 'js-cookie';

// Vytvoříme centrální instanci axiosu
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Toto je nejdůležitější část: Interceptor (zachytávač)
// Tento kód se spustí PŘED KAŽDÝM odchozím požadavkem.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Zkusíme načíst token z cookies.
    const token = Cookies.get('token');
    
    // Diagnostický log: Vypíšeme, jestli jsme token našli.
    console.log('Interceptor: Načten token z cookie:', token ? `...${token.slice(-6)}` : 'Žádný token nenalezen');

    // 2. Pokud token existuje, přidáme ho do hlavičky 'Authorization'.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Vrátíme upravenou konfiguraci a požadavek může pokračovat.
    return config;
  },
  (error) => {
    // V případě chyby ji jen pošleme dál.
    return Promise.reject(error);
  }
);

export default apiClient;
