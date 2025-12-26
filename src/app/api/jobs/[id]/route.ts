import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status, checklist, notes } = await request.json();
  
  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (checklist) updateData.checklist = checklist;
  if (notes !== undefined) updateData.notes = notes;

  const job = await prisma.job.update({
    where: { id: params.id },
    data: updateData,
    include: {
      property: true,
      worker: true,
      jobType: true,
    },
  });
  return NextResponse.json(job);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      property: true,
      worker: true,
      jobType: true,
    },
  });
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
  return NextResponse.json(job);
}
