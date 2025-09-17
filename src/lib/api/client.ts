import axios from "axios"
import Cookies from "js-cookie"

const getApiBaseUrl = () => {
  // In development, use the proxy route to avoid CORS
  if (process.env.NODE_ENV === "development") {
    return "/api"
  }
  // In production, use the full API URL
  return process.env.NEXT_PUBLIC_API_URL || "https://salon-harmonie-backend.onrender.com"
}

// Vytvoříme centrální instanci axiosu
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Toto je nejdůležitější část: Interceptor (zachytávač)
// Tento kód se spustí PŘED KAŽDÝM odchozím požadavkem.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Zkusíme načíst token z cookies.
    const token = Cookies.get("token")

    // Diagnostický log: Vypíšeme, jestli jsme token našli.
    console.log("Interceptor: Načten token z cookie:", token ? `...${token.slice(-6)}` : "Žádný token nenalezen")

    // 2. Pokud token existuje, přidáme ho do hlavičky 'Authorization'.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (process.env.NODE_ENV === "development") {
      console.log(` API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    }

    // 3. Vrátíme upravenou konfiguraci a požadavek může pokračovat.
    return config
  },
  (error) => {
    // V případě chyby ji jen pošleme dál.
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        ` API Success: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      )
    }
    return response
  },
  (error) => {
    console.log(` API Error:`, error.message, error.response?.status)

    // Handle network errors (CORS, connection issues)
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error(" Network error - možná CORS problém nebo server není dostupný")

      const isDevelopment = process.env.NODE_ENV === "development"
      const errorMessage = isDevelopment
        ? "Síťová chyba: Zkontrolujte, zda backend server běží na správném portu"
        : "Síťová chyba: Server není dostupný"

      return Promise.reject(new Error(errorMessage))
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.log("[ 401 Unauthorized - clearing token and redirecting")
      // Clear invalid token
      Cookies.remove("token")

      // Redirect to login if not already there
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
