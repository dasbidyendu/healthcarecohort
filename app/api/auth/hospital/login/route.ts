// app/api/auth/hospital/login/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const hospital = await prisma.hospital.findUnique({ where: { email } });
  if (!hospital || hospital.password !== password)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: { email, hospitalId: hospital.id },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const res = NextResponse.json({ user });
  res.headers.set('Set-Cookie', setSessionCookie(user.id));
  return res;
}
