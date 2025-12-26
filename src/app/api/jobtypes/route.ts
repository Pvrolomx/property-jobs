import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const jobTypes = await prisma.jobType.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(jobTypes);
}
