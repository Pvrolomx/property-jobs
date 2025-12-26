import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const workers = await prisma.user.findMany({
    where: { canAssign: false },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(workers);
}
