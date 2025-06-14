import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const session = verifyToken(token || '');

  if (!session || session.role !== 'HOSPITAL_ADMIN') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { name, email, password, specialization } = await req.json();

  if (!name || !email || !password || !specialization) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.DOCTOR,
      hospitalId: session.hospitalId,
    },
  });

  await prisma.doctor.create({
    data: {
      specialization,
      userId: user.id,
      hospitalId: session.hospitalId,
    },
  });

  return new Response(JSON.stringify({ message: 'Doctor added' }), { status: 201 });
}
