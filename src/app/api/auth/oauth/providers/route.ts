import { NextResponse } from "next/server"

export async function GET() {
  try {
    const providers = [
      {
        id: "google",
        name: "Google",
        enabled: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        scopes: ["openid", "email", "profile"],
        pkceRequired: true,
      },
      // Add more providers as needed
      // {
      //   id: "apple",
      //   name: "Apple",
      //   enabled: !!process.env.APPLE_CLIENT_ID,
      //   authUrl: "https://appleid.apple.com/auth/authorize",
      //   scopes: ["name", "email"],
      //   pkceRequired: true,
      // },
    ]

    return NextResponse.json({
      providers: providers.filter((provider) => provider.enabled),
    })
  } catch (error) {
    console.error("[v0] OAuth providers API error:", error)
    return NextResponse.json({ error: "Failed to get OAuth providers" }, { status: 500 })
  }
}
