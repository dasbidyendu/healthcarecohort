// app/api/auth/logout/route.ts
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });
  res.headers.set(
    'Set-Cookie',
    serialize('session', '', { path: '/', expires: new Date(0) })
  );
  return res;
}
