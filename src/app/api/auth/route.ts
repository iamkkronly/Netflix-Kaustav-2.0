import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = "a-secure-and-random-secret-for-jwt";
const ADMIN_PASSWORD = "abd123abd";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
      const token = sign({ admin: true }, JWT_SECRET, { expiresIn: '1h' });

      const cookie = serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
      });

      const headers = new Headers();
      headers.append('Set-Cookie', cookie);

      return NextResponse.json({ success: true }, { status: 200, headers });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}