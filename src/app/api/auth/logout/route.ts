// src/app/api/auth/logout/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().set("token", "", { httpOnly: true, expires: new Date(0) });
  return NextResponse.json({ message: "Odhlášení úspěšné" });
}
