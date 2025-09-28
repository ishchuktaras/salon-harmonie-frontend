// Soubor: src/app/api/auth/oauth/callback/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// ... (interface GoogleTokenResponse a GoogleUserInfo zůstávají stejné)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, codeVerifier } = body;

    if (!code || !codeVerifier) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // ---  Adresa musí být stejná jako v auth-provider.tsx ---
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? "https://salon-harmonie-frontend.vercel.app/auth/callback"
        : "http://localhost:3000/auth/callback";

    // Výměna autorizačního kódu za access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // ---  Přidán client_secret a sjednocena redirect_uri ---
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!, // Použití tajného klíče
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri, // Použití sjednocené URI
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Google token exchange failed:", errorData);
      return NextResponse.json({ error: "Failed to exchange token", details: errorData }, { status: 400 });
    }
    const tokenData = await tokenResponse.json();

    // Získání informací o uživateli od Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to get user information" }, { status: 400 });
    }
    const googleUser = await userResponse.json();

    // Volání našeho NestJS backendu pro vytvoření/přihlášení uživatele
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: googleUser.email,
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
        }),
    });

    if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Backend login failed:", errorData);
        return NextResponse.json({ error: "Backend login failed", details: errorData }, { status: 500 });
    }
    
    const { access_token, user } = await backendResponse.json();

    cookies().set("token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
    });

    return NextResponse.json({
        success: true,
        user: { ...user, avatar: googleUser.picture },
    });

  } catch (error) {
    console.error("[OAuth Callback Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}