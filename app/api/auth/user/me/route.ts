// app/api/user/me/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const userId = getSessionIdFromRequest(req);
  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { hospital: true },
  });

  return NextResponse.json({ user });
}
