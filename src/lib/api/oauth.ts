import apiClient from "./client"
import { type User } from "./types"

interface HandleCallbackParams {
  code: string
  codeVerifier: string
  provider: string
}

// This is similar to LoginResponse but defined here to avoid potential
// circular dependencies with auth-provider/auth-context.
interface OAuthCallbackResponse {
  access_token: string
  user: Omit<User, "token">
}

export interface OAuthProviderInfo {
  id: string
  name: string
  authUrl: string
  scopes: string[]
}

interface GetProvidersResponse {
  providers: OAuthProviderInfo[]
}

export const oauthApi = {
  async getProviders(): Promise<GetProvidersResponse> {
    const response = await apiClient.get<GetProvidersResponse>("/auth/oauth/providers")
    return response.data
  },

  async handleCallback(params: HandleCallbackParams): Promise<OAuthCallbackResponse> {
    const response = await apiClient.post<OAuthCallbackResponse>("/auth/oauth/callback", params)
    return response.data
  },

  async logout(): Promise<void> {
    // This request is often fire-and-forget
    await apiClient.post("/auth/logout")
  },
}