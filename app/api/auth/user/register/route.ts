import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, hospitalId } = await req.json();

    if (!name || !email || !password || !role || !hospitalId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        hospitalId,
      },
    });

    const res = NextResponse.json({ user });
    res.headers.set('Set-Cookie', setSessionCookie(user.id));
    return res;
  } catch (err) {
    console.error('[USER REGISTER ERROR]', err);
    return NextResponse.json({ error: 'Server error during user registration' }, { status: 500 });
  }
}
