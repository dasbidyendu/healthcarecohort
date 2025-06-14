import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    console.log('Received body:', { name, email });

    if (!name || !email || !password) {
      console.warn('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cookieStore = await cookies();
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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.warn('Email already in use');
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const staff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.STAFF,
        hospitalId,
      },
    });

    console.log('Staff user created:', staff);

    return NextResponse.json({ message: 'Staff added successfully', staff }, { status: 201 });

  } catch (err) {
    console.error('Add Staff Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
