// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/services/userService';
import { encrypt } from '@/lib/auth';
import * as bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: 'Neplatné přihlašovací údaje.' }, { status: 401 });
    }

    const { passwordHash, ...userPayload } = user;
    
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hodina
    const session = await encrypt({ user: userPayload, expires });

    cookies().set('token', session, { httpOnly: true, expires });
    
    return NextResponse.json(userPayload);
  } catch (error) {
    return NextResponse.json({ message: 'Interní chyba serveru' }, { status: 500 });
  }
}