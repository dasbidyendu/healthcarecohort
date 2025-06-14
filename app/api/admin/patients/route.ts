import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const session = verifyToken(token || '');

  if (!session || session.role !== 'HOSPITAL_ADMIN') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const patients = await prisma.patient.findMany({
    where: { hospitalId: session.hospitalId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      age: true,
      gender: true,
      phone: true,
      createdAt: true,
      createdBy: {
        select: { name: true },
      },
    },
  });

  return new Response(JSON.stringify({ patients }), { status: 200 });
}
