import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken, setSessionCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== Role.DOCTOR) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
    hospitalId: user.hospitalId,
  });

  const response = NextResponse.json({ message: 'Doctor logged in' }, { status: 200 });
  response.headers.set('Set-Cookie', setSessionCookie(token)); // attach JWT session cookie

  return response;
}
