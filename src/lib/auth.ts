import { cookies } from 'next/headers';
import { env } from './env';

export interface SessionData {
  username: string;
  timestamp: number;
  isValid: boolean;
}

/**
 * Get current session data from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session')?.value;

    if (!sessionToken) {
      return null;
    }

    return verifySessionToken(sessionToken);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session?.isValid ?? false;
}

/**
 * Verify session token and return session data
 */
export function verifySessionToken(token: string): SessionData | null {
  try {
    const payload = Buffer.from(token, 'base64').toString();
    const parts = payload.split(':');

    // Validate token format
    if (parts.length !== 2) {
      return null;
    }

    const [username, timestampStr] = parts;
    const timestamp = parseInt(timestampStr);

    // Validate timestamp
    if (isNaN(timestamp)) {
      return null;
    }

    // Check if username matches
    if (username !== env.ADMIN_USERNAME) {
      return {
        username,
        timestamp,
        isValid: false,
      };
    }

    // Check if token is not expired (24 hours)
    const tokenAge = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isValid = tokenAge < maxAge;

    return {
      username,
      timestamp,
      isValid,
    };
  } catch (error) {
    console.error('Error verifying session token:', error);
    return null;
  }
}

/**
 * Create a new session token
 */
export function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;

  // In production, use proper encryption/signing (JWT, etc.)
  return Buffer.from(payload).toString('base64');
}

/**
 * Validate admin credentials
 */
export function validateCredentials(
  username: string,
  password: string
): boolean {
  return username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;
}

/**
 * Get session expiry time
 */
export function getSessionExpiry(timestamp: number): Date {
  return new Date(timestamp + 24 * 60 * 60 * 1000); // 24 hours from creation
}

/**
 * Check if session is about to expire (within 1 hour)
 */
export function isSessionExpiringSoon(timestamp: number): boolean {
  const expiryTime = getSessionExpiry(timestamp);
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

  return expiryTime <= oneHourFromNow;
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const isAuth = await isAuthenticated();

    if (!isAuth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(...args);
  };
}

/**
 * Auth context for React components
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  session: SessionData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Constants
export const AUTH_CONSTANTS = {
  SESSION_COOKIE_NAME: 'admin-session',
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  LOGIN_PATH: '/admin/login',
  ADMIN_PATH: '/admin',
} as const;
