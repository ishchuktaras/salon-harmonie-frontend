import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()

    // Clear the authentication cookie
    cookieStore.delete("token")

    return NextResponse.json({
      success: true,
      message: "Successfully logged out",
    })
  } catch (error) {
    console.error("[v0] Logout API error:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
