// app/api/patient/list/route.ts
import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const user = getUserFromSession(req);

  if (!user || user.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const patients = await prisma.patient.findMany({
    where: { hospitalId: user.hospitalId },
    select: { id: true, name: true },
  });

  return NextResponse.json({ patients });
}
