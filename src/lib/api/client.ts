import axios from "axios"
import Cookies from "js-cookie"

const getApiBaseUrl = () => {
  // In development, use the proxy route to avoid CORS
  if (process.env.NODE_ENV === "development") {
    return "/api"
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://salon-harmonie-backend.onrender.com/api"
}

// Vytvoříme centrální instanci axiosu
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
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
      console.log(`[v0] API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
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
        `[v0] API Success: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      )
    }
    return response
  },
  (error) => {
    console.log(`[v0] API Error:`, error.message, error.response?.status)

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.error("[v0] Request timeout - server took too long to respond")
      const errorMessage = "Server neodpovídá. Zkuste to prosím později nebo zkontrolujte připojení k internetu."
      return Promise.reject(new Error(errorMessage))
    }

    // Handle network errors (CORS, connection issues)
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("[v0] Network error - možná CORS problém nebo server není dostupný")

      const isDevelopment = process.env.NODE_ENV === "development"
      const errorMessage = isDevelopment
        ? "Síťová chyba: Zkontrolujte, zda backend server běží na správném portu"
        : "Síťová chyba: Server není dostupný"

      return Promise.reject(new Error(errorMessage))
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.log("[v0] 401 Unauthorized - clearing token and redirecting")
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
