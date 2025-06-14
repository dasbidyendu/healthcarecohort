import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      console.warn('No session cookie found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyToken(sessionCookie.value);

    if (!session || session.role !== 'HOSPITAL_ADMIN') {
      console.warn('Invalid session or not a HOSPITAL_ADMIN');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patients = await prisma.patient.findMany({
      where: { hospitalId: session.hospitalId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        phone: true,
        createdAt: true,
        createdBy: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ patients }, { status: 200 });

  } catch (err) {
    console.error('Fetch Patients Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
