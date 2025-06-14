import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    }

    let user;

    // Fetch from appropriate model based on role
    if (role === 'HOSPITAL_ADMIN') {
      user = await prisma.hospital.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
    } else {
      user = await prisma.user.findFirst({
        where: { email, role: role as Role },
        select: {
          id: true,
          email: true,
          password: true,
          hospitalId: true,
        },
      });
    }

    if (!user || !user.password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });
    }

    // Handle hospitalId logic
    let hospitalId: string;

    if (role === 'HOSPITAL_ADMIN') {
      hospitalId = user.id;
    } else {
      // `user` is typed as User (has hospitalId)
      hospitalId = (user as any).hospitalId;
    }
    
    const token = jwt.sign(
      {
        id: user.id,
        role,
        hospitalId,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
