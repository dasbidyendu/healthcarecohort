import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const existing = await prisma.hospital.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const hospital = await prisma.hospital.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return new Response(JSON.stringify({ message: 'Hospital registered', hospital }), { status: 201 });
}
