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
