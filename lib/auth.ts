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
export function setSessionCookie(hospitalId: string) {
  return serialize('session', hospitalId, {
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

// ✅ Used in /api/hospital/details to extract plain hospitalId from cookie
export function verifyTokenFromCookies(req: Request | { headers: { get: (header: string) => string | null } }): string | null {
  const cookie = req.headers.get('cookie');
  const parsed = cookie ? parse(cookie) : {};
  return parsed.session ?? null;
}

// ✅ Extracts and verifies JWT token from session cookie (used in STAFF login/session)
export function getUserFromSession(req: Request): SessionPayload | null {
  const cookie = req.headers.get('cookie');
  const parsed = cookie ? parse(cookie) : {};
  const token = parsed.session;
  return token ? verifyToken(token) : null;
}

