// app/api/auth/hospital/register/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 });
    }

    const existing = await prisma.hospital.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hospital = await prisma.hospital.create({
      data: { name, email, password },
    });

    const user = await prisma.user.create({
      data: {
        name: `${name} Admin`,
        email,
        password,
        role: 'STAFF',
        hospitalId: hospital.id,
      },
    });

    const res = NextResponse.json({ user, hospital });
    res.headers.set('Set-Cookie', setSessionCookie(user.id));
    return res;

  } catch (error) {
    console.error('[REGISTER ERROR]', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
