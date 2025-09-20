/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0
 * Implements RFC 7636 for secure OAuth flows
 */

export interface PKCEParams {
  codeVerifier: string
  state: string
  provider: string
}

/**
 * Generate a cryptographically secure random string for PKCE code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

/**
 * Generate code challenge from code verifier using SHA256
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

/**
 * PKCE Storage utility for managing OAuth parameters in localStorage
 */
export const PKCEStorage = {
  /**
   * Store PKCE parameters in localStorage
   */
  store(codeVerifier: string, state: string, provider: string): void {
    try {
      console.log("[v0] Storing PKCE parameters in localStorage...")

      // Add localStorage availability check
      if (typeof window === "undefined" || !window.localStorage) {
        throw new Error("localStorage is not available")
      }

      // Clear any existing PKCE data first
      this.clear()

      localStorage.setItem("oauth_code_verifier", codeVerifier)
      localStorage.setItem("oauth_state", state)
      localStorage.setItem("oauth_provider", provider)
      localStorage.setItem("oauth_timestamp", Date.now().toString())

      // Enhanced verification with immediate read-back
      const verification = {
        codeVerifier: localStorage.getItem("oauth_code_verifier"),
        state: localStorage.getItem("oauth_state"),
        provider: localStorage.getItem("oauth_provider"),
        timestamp: localStorage.getItem("oauth_timestamp"),
      }

      console.log("[v0] PKCE parameters stored successfully:", {
        codeVerifierLength: verification.codeVerifier?.length,
        codeVerifierMatch: verification.codeVerifier === codeVerifier,
        state: verification.state,
        stateMatch: verification.state === state,
        provider: verification.provider,
        providerMatch: verification.provider === provider,
        timestamp: verification.timestamp,
      })

      // Verify all parameters were stored correctly
      if (!verification.codeVerifier || !verification.state || !verification.provider) {
        throw new Error("Failed to verify PKCE parameters storage")
      }
    } catch (error) {
      console.error("[v0] Failed to store PKCE parameters:", error)
      throw new Error("Nepodařilo se uložit PKCE parametry")
    }
  },

  /**
   * Retrieve PKCE parameters from localStorage
   */
  retrieve(): PKCEParams | null {
    try {
      console.log("[v0] Retrieving PKCE parameters from localStorage...")

      // Add localStorage availability check
      if (typeof window === "undefined" || !window.localStorage) {
        console.error("[v0] localStorage is not available")
        return null
      }

      // Enhanced debugging - show all localStorage contents
      const allKeys = Object.keys(localStorage)
      console.log("[v0] All localStorage keys:", allKeys)

      const allValues: Record<string, string | null> = {}
      allKeys.forEach((key) => {
        allValues[key] = localStorage.getItem(key)
      })
      console.log("[v0] All localStorage values:", allValues)

      const codeVerifier = localStorage.getItem("oauth_code_verifier")
      const state = localStorage.getItem("oauth_state")
      const provider = localStorage.getItem("oauth_provider")
      const timestamp = localStorage.getItem("oauth_timestamp")

      console.log("[v0] Retrieved values:", {
        codeVerifierExists: !!codeVerifier,
        codeVerifierLength: codeVerifier?.length,
        state,
        provider,
        timestamp,
      })

      // Enhanced error reporting
      if (!codeVerifier || !state || !provider) {
        console.error("[v0] Missing PKCE parameters:", {
          codeVerifier: !!codeVerifier,
          state: !!state,
          provider: !!provider,
        })

        // Manual check for debugging
        console.error("[v0] Manual localStorage check:", {
          codeVerifier: localStorage.getItem("oauth_code_verifier"),
          state: localStorage.getItem("oauth_state"),
          provider: localStorage.getItem("oauth_provider"),
          timestamp: localStorage.getItem("oauth_timestamp"),
        })

        return null
      }

      // Check if parameters are not too old (30 minutes max)
      if (timestamp) {
        const age = Date.now() - Number.parseInt(timestamp)
        const maxAge = 30 * 60 * 1000 // 30 minutes
        if (age > maxAge) {
          console.error("[v0] PKCE parameters expired:", { age, maxAge })
          this.clear()
          return null
        }
      }

      console.log("[v0] PKCE parameters retrieved successfully")
      return { codeVerifier, state, provider }
    } catch (error) {
      console.error("[v0] Failed to retrieve PKCE parameters:", error)
      return null
    }
  },

  /**
   * Clear PKCE parameters from localStorage
   */
  clear(): void {
    try {
      console.log("[v0] Clearing PKCE parameters from localStorage...")
      localStorage.removeItem("oauth_code_verifier")
      localStorage.removeItem("oauth_state")
      localStorage.removeItem("oauth_provider")
      localStorage.removeItem("oauth_timestamp")
      console.log("[v0] PKCE parameters cleared successfully")
    } catch (error) {
      console.error("[v0] Failed to clear PKCE parameters:", error)
    }
  },

  /**
   * Check if PKCE parameters exist in localStorage
   */
  exists(): boolean {
    return !!(
      localStorage.getItem("oauth_code_verifier") &&
      localStorage.getItem("oauth_state") &&
      localStorage.getItem("oauth_provider")
    )
  },
}
