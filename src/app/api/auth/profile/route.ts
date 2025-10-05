// src/app/api/auth/profile/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ message: 'Neautorizovaný přístup' }, { status: 401 });
  }
  
  return NextResponse.json(session.user);
}