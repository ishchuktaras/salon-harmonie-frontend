// src/app/api/services/route.ts

import { NextResponse } from 'next/server';
import { getAllServices, createService } from '@/lib/services/serviceService';

// Handler pro GET /api/services
export async function GET() {
  try {
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ message: "Chyba při načítání služeb." }, { status: 500 });
  }
}

// Handler pro POST /api/services
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newService = await createService(data);
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Chyba při vytváření služby." }, { status: 500 });
  }
}