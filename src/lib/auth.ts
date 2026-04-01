import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'change-me-in-production-please'
);

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME, MAX_AGE };
