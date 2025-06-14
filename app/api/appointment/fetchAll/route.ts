// /app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyTokenFromCookies } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const hospitalId = verifyTokenFromCookies(req);
  if (!hospitalId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: { hospitalId },
      include: {
        doctor: { include: { user: true } },
        patient: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
