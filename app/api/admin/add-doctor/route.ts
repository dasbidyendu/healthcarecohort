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

    console.log('Received body:', { name, email, specialization });

    if (!name || !email || !password || !specialization) {
      console.warn('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cookieStore = await cookies(); // no await needed
    const session = cookieStore.get('session');

    if (!session) {
      console.warn('No session cookie found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(session.value);
    const hospitalId = decoded?.hospitalId;

    console.log('Decoded session:', decoded);
    console.log('Hospital ID from session:', hospitalId);

    if (!hospitalId) {
      console.warn('Invalid session: missing hospitalId');
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'DOCTOR',
        hospitalId
      }
    });

    console.log('User created:', user);

    // Create Doctor
    const doctor = await prisma.doctor.create({
      data: {
        specialization,
        userId: user.id,
        hospitalId:hospitalId,
      }
    });

    console.log('Doctor created:', doctor);

    return NextResponse.json({ message: 'Doctor created successfully', doctor });

  } catch (err) {
    console.error('Add Doctor Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
