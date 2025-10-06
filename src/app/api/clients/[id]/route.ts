// src/app/api/clients/[id]/route.ts

import { NextResponse } from 'next/server';
import { getClientById, updateClient, deleteClient } from '@/lib/services/clientService';

interface Params {
  params: { id: string };
}

// Handler pro GET /api/clients/{id}
export async function GET(req: Request, { params }: Params) {
  try {
    const client = await getClientById(Number(params.id));
    if (!client) {
      return NextResponse.json({ message: "Klient nenalezen." }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ message: "Chyba při načítání klienta." }, { status: 500 });
  }
}

// Handler pro PATCH /api/clients/{id}
export async function PATCH(req: Request, { params }: Params) {
  try {
    const data = await req.json();
    const updatedClient = await updateClient(Number(params.id), data);
    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json({ message: "Chyba při aktualizaci klienta." }, { status: 500 });
  }
}

// Handler pro DELETE /api/clients/{id}
export async function DELETE(req: Request, { params }: Params) {
  try {
    await deleteClient(Number(params.id));
    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    return NextResponse.json({ message: "Chyba při mazání klienta." }, { status: 500 });
  }
}