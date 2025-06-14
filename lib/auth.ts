import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface SessionPayload {
  id: string;
  role: 'HOSPITAL_ADMIN' | 'STAFF' | 'DOCTOR';
  hospitalId: string;
}

// ✅ Create a JWT token (e.g. after login)
export function generateToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// ✅ Verify a JWT from Authorization header
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

// ✅ (Optional) If you're storing session in cookies
export function setSessionCookie(userId: string) {
  return serialize('session', userId, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export function getSessionIdFromRequest(req: Request) {
  const cookie = req.headers.get('cookie');
  const parsed = cookie ? parse(cookie) : {};
  return parsed.session;
}
