import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

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