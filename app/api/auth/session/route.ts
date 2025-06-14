// app/api/auth/session/route.ts

import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore =await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 });
  }

  try {
    const payload = verifyToken(token); // ⬅️ You can use jsonwebtoken here
    return NextResponse.json({ user: payload });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
