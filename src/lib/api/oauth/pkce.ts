/**
 * PKCE (Proof Key for Code Exchange) utility functions for OAuth 2.0
 * Used for secure OAuth flows in public clients (frontend applications)
 */

/**
 * Generates a cryptographically secure random code verifier
 * @returns Base64URL-encoded random string
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

/**
 * Generates a code challenge from a code verifier using SHA256
 * @param codeVerifier The code verifier to hash
 * @returns Base64URL-encoded SHA256 hash of the code verifier
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return base64URLEncode(new Uint8Array(digest))
}

/**
 * Base64URL-encode a Uint8Array
 * @param array The array to encode
 * @returns Base64URL-encoded string
 */
function base64URLEncode(array: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...Array.from(array)))
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export const PKCEStorage = {
  /**
   * Store PKCE parameters in localStorage with timestamp
   */
  store: (codeVerifier: string, state: string, provider: string): void => {
    try {
      const timestamp = Date.now().toString()
      localStorage.setItem("oauth_code_verifier", codeVerifier)
      localStorage.setItem("oauth_state", state)
      localStorage.setItem("oauth_provider", provider)
      localStorage.setItem("oauth_timestamp", timestamp)

      // Verify storage immediately
      const stored = localStorage.getItem("oauth_code_verifier")
      if (!stored || stored !== codeVerifier) {
        throw new Error("Failed to store PKCE parameters")
      }

      console.log("[v0] PKCE parameters stored successfully:", {
        codeVerifierStored: !!stored,
        codeVerifierLength: stored?.length,
        state,
        provider,
        timestamp,
      })
    } catch (error) {
      console.error("[v0] Failed to store PKCE parameters:", error)
      throw new Error("Nepodařilo se uložit PKCE parametry")
    }
  },

  /**
   * Retrieve PKCE parameters from localStorage
   */
  retrieve: (): { codeVerifier: string; state: string; provider: string; timestamp: string } | null => {
    try {
      const codeVerifier = localStorage.getItem("oauth_code_verifier")
      const state = localStorage.getItem("oauth_state")
      const provider = localStorage.getItem("oauth_provider")
      const timestamp = localStorage.getItem("oauth_timestamp")

      console.log("[v0] Retrieving PKCE parameters:", {
        codeVerifier: !!codeVerifier,
        codeVerifierLength: codeVerifier?.length,
        state: !!state,
        provider,
        timestamp,
      })

      if (!codeVerifier || !state || !provider || !timestamp) {
        console.error("[v0] Missing PKCE parameters:", {
          codeVerifier: !!codeVerifier,
          state: !!state,
          provider: !!provider,
          timestamp: !!timestamp,
        })
        return null
      }

      // Check if parameters are too old (10 minutes)
      const age = Date.now() - Number.parseInt(timestamp)
      if (age > 10 * 60 * 1000) {
        console.error("[v0] PKCE parameters are too old, clearing...")
        PKCEStorage.clear()
        return null
      }

      return { codeVerifier, state, provider, timestamp }
    } catch (error) {
      console.error("[v0] Failed to retrieve PKCE parameters:", error)
      return null
    }
  },

  /**
   * Clear PKCE parameters from localStorage
   */
  clear: (): void => {
    try {
      localStorage.removeItem("oauth_code_verifier")
      localStorage.removeItem("oauth_state")
      localStorage.removeItem("oauth_provider")
      localStorage.removeItem("oauth_timestamp")
      console.log("[v0] PKCE parameters cleared from localStorage")
    } catch (error) {
      console.error("[v0] Failed to clear PKCE parameters:", error)
    }
  },
}
