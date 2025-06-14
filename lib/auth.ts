import { serialize, parse } from 'cookie';

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
