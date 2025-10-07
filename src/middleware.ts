import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = "a-very-secure-and-super-random-secret-for-jwt-cloudray";

async function verifyJwt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY));
    return payload;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  // Protect the /dashboard route
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if no token is found
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // Verify the token
      const payload = await verifyJwt(token);
      if (!payload) {
        // Redirect to login if token is invalid
        return NextResponse.redirect(new URL('/login', req.url));
      }
      // If token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // In case of any other error, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow other routes to be accessed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};