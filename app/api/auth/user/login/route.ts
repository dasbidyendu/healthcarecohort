// app/api/auth/user/login/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const res = NextResponse.json({ user });
  res.headers.set('Set-Cookie', setSessionCookie(user.id));
  return res;
}
