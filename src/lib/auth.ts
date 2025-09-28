import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = "a-secure-and-random-secret-for-jwt";

export function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return false;
  }

  try {
    verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return false;
  }
}