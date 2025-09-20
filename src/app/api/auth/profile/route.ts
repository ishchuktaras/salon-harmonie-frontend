import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
    }

    // In a real implementation, you would:
    // 1. Verify the JWT token
    // 2. Get user data from your database
    // 3. Return user profile

    // For now, we'll try to get user info from Google if it's a Google token
    try {
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()

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

        return NextResponse.json({ user })
      }
    } catch (googleError) {
      console.error("[v0] Failed to verify Google token:", googleError)
    }

    // If Google verification fails, return unauthorized
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
