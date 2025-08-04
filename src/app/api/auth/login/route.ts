import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against environment variables
    if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = createSessionToken(username);

    // Create response with session cookie
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simple session token creation (matches middleware implementation)
function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;

  // In production, use proper encryption/signing
  return Buffer.from(payload).toString('base64');
}
