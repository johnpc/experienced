/**
 * Rate limiting utility for API endpoints
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Maximum number of unique tokens per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory store for rate limiting (in production, use Redis or similar)
const tokenCache = new Map<string, { count: number; reset: number }>();

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (limit: number, token: string): Promise<RateLimitResult> => {
      const now = Date.now();
      const windowStart = now - config.interval;

      // Clean up expired entries
      for (const [key, value] of Array.from(tokenCache.entries())) {
        if (value.reset < now) {
          tokenCache.delete(key);
        }
      }

      // Get or create token entry
      const tokenKey = `${token}:${Math.floor(now / config.interval)}`;
      let tokenData = tokenCache.get(tokenKey);

      if (!tokenData) {
        tokenData = {
          count: 0,
          reset: now + config.interval,
        };
        tokenCache.set(tokenKey, tokenData);
      }

      // Check if limit exceeded
      const success = tokenData.count < limit;

      if (success) {
        tokenData.count++;
      }

      return {
        success,
        limit,
        remaining: Math.max(0, limit - tokenData.count),
        reset: tokenData.reset,
      };
    },
  };
}

// Middleware for applying rate limiting to API routes
export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  config: RateLimitConfig & { limit: number }
) {
  return async (req: Request): Promise<Response> => {
    const limiter = rateLimit(config);
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const result = await limiter.check(config.limit, ip);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler(req);

    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());

    return response;
  };
}

// Utility to get client IP from request
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const remoteAddr = req.headers.get('remote-addr');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return realIP || remoteAddr || '127.0.0.1';
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(tokenCache.entries())) {
    if (value.reset < now) {
      tokenCache.delete(key);
    }
  }
}, 60000); // Clean up every minute
