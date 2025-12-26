import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const jobs = await prisma.job.findMany({
    where: {
      datetime: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      property: true,
      worker: true,
      jobType: true,
    },
    orderBy: { datetime: 'asc' },
  });
  return NextResponse.json(jobs);
}
