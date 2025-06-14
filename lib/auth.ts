import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface SessionPayload {
  id: string;
  role: 'HOSPITAL_ADMIN' | 'STAFF' | 'DOCTOR';
  hospitalId: string;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}
