import { NextResponse } from 'next/server';

import { createSessionToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
    }

    const validUsername = process.env.ADMIN_USERNAME ?? '';
    const validPassword = process.env.ADMIN_PASSWORD ?? '';

    const usernameMatch = username.trim().toLowerCase() === validUsername.trim().toLowerCase();
    const passwordMatch = password === validPassword;

    if (!usernameMatch || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createSessionToken(username.trim().toLowerCase());

    const response = NextResponse.json({ ok: true, username: username.trim().toLowerCase() });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
