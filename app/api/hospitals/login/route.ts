import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  const hospital = await prisma.hospital.findUnique({ where: { email } });

  if (!hospital) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, hospital.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // ✅ Generate JWT token
  const token = generateToken({
    id: hospital.id,
    role: 'HOSPITAL_ADMIN',
    hospitalId: hospital.id,
  });

  // ✅ Store JWT in cookie
  const cookie = serialize('session', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // ✅ Return the response and set the cookie on it
  const res = NextResponse.json({ message: 'Login successful', hospital });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
