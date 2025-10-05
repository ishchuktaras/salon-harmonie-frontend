// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/services/userService';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: 'Chybí povinné údaje.' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'Uživatel s tímto e-mailem již existuje.' }, { status: 409 });
    }

    const newUser = await createUser({
      email,
      passwordHash: password,
      firstName,
      lastName,
      role: Role.KLIENT,
    });
    
    // Zde bychom rovnou vytvořili a nastavili JWT cookie, stejně jako v login
    // Pro jednoduchost teď jen vrátíme úspěch
    const { passwordHash, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    return NextResponse.json({ message: 'Interní chyba serveru' }, { status: 500 });
  }
}