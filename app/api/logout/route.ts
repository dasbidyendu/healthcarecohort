import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  // Clear the session cookie
  const cookie = serialize('session', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0, // Expire immediately
    expires: new Date(0),
  });

  const response = NextResponse.json({ message: 'Logged out successfully.' });
  response.headers.set('Set-Cookie', cookie);
  
  return response;
}
