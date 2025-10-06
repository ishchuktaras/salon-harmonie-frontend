// src/app/api/clients/route.ts

import { NextResponse } from 'next/server';
import { getAllClients, createClient } from '@/lib/services/clientService';

// Handler pro GET /api/clients
export async function GET() {
  try {
    const clients = await getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ message: "Chyba při načítání klientů." }, { status: 500 });
  }
}

// Handler pro POST /api/clients
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Zde můžeme přidat validaci dat, pokud je potřeba
    const newClient = await createClient(data);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Chyba při vytváření klienta." }, { status: 500 });
  }
}