export interface OAuthCallbackRequest {
  code: string
  codeVerifier: string
  provider: string
}

export interface OAuthCallbackResponse {
  success: boolean
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    name: string
    avatar: string
    role: string
    provider: string
    providerId: string
  }
  access_token: string
  expires_in: number
}

export interface OAuthProvider {
  id: string
  name: string
  enabled: boolean
  authUrl: string
  scopes: string[]
  pkceRequired: boolean
}

export interface OAuthProvidersResponse {
  providers: OAuthProvider[]
}

export const oauthApi = {
  /**
   * Handle OAuth callback with authorization code and PKCE verifier
   */
  handleCallback: async (data: OAuthCallbackRequest): Promise<OAuthCallbackResponse> => {
    const response = await fetch("/api/auth/oauth/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`OAuth callback failed: ${response.status}`)
    }

    return response.json()
  },

  /**
   * Get available OAuth providers
   */
  getProviders: async (): Promise<OAuthProvidersResponse> => {
    const response = await fetch("/api/auth/oauth/providers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get OAuth providers: ${response.status}`)
    }

    return response.json()
  },

  /**
   * Logout user and clear tokens
   */
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`)
    }

    return response.json()
  },
}
