import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// It is strongly recommended to use environment variables for these secrets.
// Hardcoding them here to follow the project's current pattern and address review feedback.
const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"; // IMPORTANT: Replace with your real bot token
const JWT_SECRET_KEY = "a-very-secure-and-super-random-secret-for-jwt-cloudray";

/**
 * Verifies the hash of the data received from the Telegram Login Widget.
 * @param data The user data object from Telegram.
 * @returns {boolean} True if the hash is valid, false otherwise.
 */
const verifyTelegramHash = (data: Record<string, any>): boolean => {
  const { hash, ...rest } = data;
  if (!hash) return false;

  const checkString = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');

  try {
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
    return hmac === hash;
  } catch (error) {
    console.error("Error during hash verification:", error);
    return false;
  }
};

/**
 * Creates a JWT for the authenticated user.
 * @param payload The data to include in the JWT.
 * @returns {Promise<string>} The generated JWT.
 */
async function createJwt(payload: { userId: string, telegramId: number }): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d') // 1-day expiry
        .sign(secret);
    return token;
}

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    // 1. Verify the data hash to ensure it's from Telegram
    if (!verifyTelegramHash(userData)) {
      return NextResponse.json({ success: false, message: 'Invalid hash. Data is not from Telegram.' }, { status: 401 });
    }

    // 2. Connect to the database
    await dbConnect();

    // 3. Find an existing user or create a new one
    const user = await User.findOneAndUpdate(
      { telegramId: userData.id },
      {
        telegramId: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 4. Create a session token (JWT)
    const token = await createJwt({
        userId: user._id.toString(),
        telegramId: user.telegramId,
    });

    // 5. Set the token in a secure, http-only cookie
    const response = NextResponse.json({ success: true, message: 'Authentication successful' });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;

  } catch (error) {
    console.error('Telegram auth failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}