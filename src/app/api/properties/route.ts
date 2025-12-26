import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const properties = await prisma.property.findMany({
    include: { client: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // Create or find client
  let client = await prisma.client.findFirst({
    where: { name: data.clientName }
  });
  
  if (!client) {
    client = await prisma.client.create({
      data: { name: data.clientName, phone: data.clientPhone || null }
    });
  }
  
  const property = await prisma.property.create({
    data: {
      name: data.name,
      address: data.address,
      clientId: client.id,
      notes: data.notes || null,
    },
    include: { client: true },
  });
  return NextResponse.json(property);
}
