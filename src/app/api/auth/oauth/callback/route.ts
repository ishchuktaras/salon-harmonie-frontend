import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: string
  id_token?: string
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, codeVerifier, provider = "google" } = body

    console.log("[v0] OAuth callback API called:", { provider, hasCode: !!code, hasCodeVerifier: !!codeVerifier })

    if (!code || !codeVerifier) {
      return NextResponse.json({ error: "Missing required parameters: code and codeVerifier" }, { status: 400 })
    }

    if (provider !== "google") {
      return NextResponse.json({ error: `Provider ${provider} is not supported` }, { status: 400 })
    }

    // Exchange authorization code for access token using PKCE
    const tokenRequestBody = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      code,
      grant_type: "authorization_code",
      redirect_uri:
        process.env.NODE_ENV === "production"
          ? "https://salon-harmonie-frontend.vercel.app/auth/callback"
          : "http://localhost:3000/auth/callback",
      code_verifier: codeVerifier,
    }

    console.log("[v0] Exchanging code for token with Google...")

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(tokenRequestBody),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("[v0] Google token exchange failed:", errorData)
      return NextResponse.json({ error: "Failed to exchange authorization code for token" }, { status: 400 })
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json()
    console.log("[v0] Token exchange successful")

    // Get user information from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error("[v0] Failed to get user info from Google")
      return NextResponse.json({ error: "Failed to get user information" }, { status: 400 })
    }

    const userData: GoogleUserInfo = await userResponse.json()
    console.log("[v0] User info retrieved successfully")

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate your own JWT token
    // 4. Return user data and token

    // For now, we'll create a mock user response
    const user = {
      id: userData.id,
      email: userData.email,
      firstName: userData.given_name,
      lastName: userData.family_name,
      name: userData.name,
      avatar: userData.picture,
      role: "CLIENT", // Default role
      provider: "google",
      providerId: userData.id,
    }

    // In a real implementation, you would generate your own JWT token here
    // For now, we'll use the Google access token (not recommended for production)
    const response = NextResponse.json({
      success: true,
      user,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
    })

    // Set HTTP-only cookie for security
    const cookieStore = cookies()
    cookieStore.set("token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] OAuth callback API error:", error)
    return NextResponse.json({ error: "Internal server error during OAuth callback" }, { status: 500 })
  }
}
