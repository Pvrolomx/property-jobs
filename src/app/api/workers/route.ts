import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const workers = await prisma.user.findMany({
    where: { canAssign: false },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(workers);
}

export async function POST(request: Request) {
  const data = await request.json();
  const worker = await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      canAssign: false,
    },
  });
  return NextResponse.json(worker);
}
