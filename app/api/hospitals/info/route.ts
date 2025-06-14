// app/api/hospital/details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken, verifyTokenFromCookies } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = getPrisma();

export async function GET() {
    try {
      const cookieStore =await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No session token found' }, { status: 401 });
        }
    // Parse the session cookie
        const hospitalId = verifyToken(token)?.hospitalId ;

    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital not authenticated' }, { status: 401 });
    }

    // Fetch hospital details with related data
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
        doctors: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        patients: true,
        appointments: true,
      },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('[GET_HOSPITAL_DETAILS]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
