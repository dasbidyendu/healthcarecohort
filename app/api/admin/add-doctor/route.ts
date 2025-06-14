import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, specialization } = body;

    if (!name || !email || !password || !specialization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cookieStore = await cookies(); // NOT await
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = await verifyToken(session.value);
    const hospitalId = decoded?.hospitalId;
    console.log('Hospital ID from session:', hospitalId);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!decoded?.hospitalId) {
  return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
}

const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role: 'DOCTOR',
    hospitalId: decoded.hospitalId // now TypeScript knows it's a string ✅
  }
});

    // Create Doctor next
    const doctor = await prisma.doctor.create({
      data: {
        specialization,
        userId: user.id,
        hospitalId: decoded.hospitalId // now TypeScript knows it's a string ✅
        ,
      },
    });

    return NextResponse.json({ message: 'Doctor created successfully', doctor });

  } catch (err) {
    console.error('Add Doctor Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
