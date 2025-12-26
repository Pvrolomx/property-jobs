import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: {
      property: true,
      worker: true,
      jobType: true,
    },
    orderBy: { datetime: 'desc' },
  });
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const data = await request.json();
  const job = await prisma.job.create({
    data: {
      propertyId: data.propertyId,
      workerId: data.workerId,
      jobTypeId: data.jobTypeId,
      datetime: new Date(data.datetime),
      status: 'pending',
      checklist: data.checklist || '[]',
      notes: data.notes || null,
    },
    include: {
      property: true,
      worker: true,
      jobType: true,
    },
  });
  return NextResponse.json(job);
}
