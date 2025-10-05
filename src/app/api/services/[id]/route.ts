// src/app/api/services/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/lib/services/serviceService';

interface Params {
  params: { id: string };
}

// Handler pro GET /api/services/{id}
export async function GET(req: Request, { params }: Params) {
  try {
    const service = await getServiceById(Number(params.id));
    if (!service) {
      return NextResponse.json({ message: "Služba nenalezena." }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ message: "Chyba při načítání služby." }, { status: 500 });
  }
}

// Handler pro PATCH /api/services/{id}
export async function PATCH(req: Request, { params }: Params) {
  try {
    const data = await req.json();
    const updatedService = await updateService(Number(params.id), data);
    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json({ message: "Chyba při aktualizaci služby." }, { status: 500 });
  }
}

// Handler pro DELETE /api/services/{id}
export async function DELETE(req: Request, { params }: Params) {
  try {
    await deleteService(Number(params.id));
    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    return NextResponse.json({ message: "Chyba při mazání služby." }, { status: 500 });
  }
}