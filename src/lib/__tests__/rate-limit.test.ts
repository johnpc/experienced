/**
 * Tests for rate limiting utility
 */

import { rateLimit, withRateLimit, getClientIP } from '../rate-limit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear any existing cache
    jest.clearAllMocks();
  });

  describe('rateLimit', () => {
    it('should allow requests within limit', async () => {
      const limiter = rateLimit({
        interval: 60000, // 1 minute
        uniqueTokenPerInterval: 100,
      });

      const result1 = await limiter.check(5, 'test-token');
      const result2 = await limiter.check(5, 'test-token');
      const result3 = await limiter.check(5, 'test-token');

      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(4);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(3);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(2);
    });

    it('should reject requests over limit', async () => {
      const limiter = rateLimit({
        interval: 60000,
        uniqueTokenPerInterval: 100,
      });

      // Use up the limit
      for (let i = 0; i < 3; i++) {
        await limiter.check(3, 'test-token-2');
      }

      // This should be rejected
      const result = await limiter.check(3, 'test-token-2');
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should handle different tokens separately', async () => {
      const limiter = rateLimit({
        interval: 60000,
        uniqueTokenPerInterval: 100,
      });

      const result1 = await limiter.check(2, 'token-1');
      const result2 = await limiter.check(2, 'token-2');
      const result3 = await limiter.check(2, 'token-1');
      const result4 = await limiter.check(2, 'token-2');

      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(1);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(0);
      expect(result4.success).toBe(true);
      expect(result4.remaining).toBe(0);
    });

    it('should reset after interval', async () => {
      const shortInterval = 100; // 100ms
      const limiter = rateLimit({
        interval: shortInterval,
        uniqueTokenPerInterval: 100,
      });

      // Use up the limit
      const result1 = await limiter.check(1, 'test-token-3');
      const result2 = await limiter.check(1, 'test-token-3');

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);

      // Wait for interval to pass
      await new Promise((resolve) => setTimeout(resolve, shortInterval + 10));

      // Should be allowed again
      const result3 = await limiter.check(1, 'test-token-3');
      expect(result3.success).toBe(true);
    });

    it('should return correct limit and reset values', async () => {
      const limiter = rateLimit({
        interval: 60000,
        uniqueTokenPerInterval: 100,
      });

      const result = await limiter.check(10, 'test-token-4');

      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(9);
      expect(result.reset).toBeGreaterThan(Date.now());
      expect(result.reset).toBeLessThanOrEqual(Date.now() + 60000);
    });
  });

  describe('withRateLimit', () => {
    it('should allow requests within limit', async () => {
      const mockHandler = jest
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ success: true }), { status: 200 })
        );

      const rateLimitedHandler = withRateLimit(mockHandler, {
        interval: 60000,
        uniqueTokenPerInterval: 100,
        limit: 5,
      });

      const mockRequest = new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await rateLimitedHandler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('4');
    });

    it('should reject requests over limit', async () => {
      const mockHandler = jest.fn();

      const rateLimitedHandler = withRateLimit(mockHandler, {
        interval: 60000,
        uniqueTokenPerInterval: 100,
        limit: 1,
      });

      const mockRequest = new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '192.168.1.2' },
      });

      // First request should succeed
      await rateLimitedHandler(mockRequest);

      // Second request should be rate limited
      const response = await rateLimitedHandler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests');
      expect(response.headers.get('X-RateLimit-Limit')).toBe('1');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    });
  });

  describe('getClientIP', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      });

      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });

    it('should extract IP from x-real-ip header', () => {
      const request = new Request('http://localhost/test', {
        headers: { 'x-real-ip': '192.168.1.2' },
      });

      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.2');
    });

    it('should extract IP from remote-addr header', () => {
      const request = new Request('http://localhost/test', {
        headers: { 'remote-addr': '192.168.1.3' },
      });

      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.3');
    });

    it('should return default IP when no headers present', () => {
      const request = new Request('http://localhost/test');

      const ip = getClientIP(request);
      expect(ip).toBe('127.0.0.1');
    });

    it('should prioritize x-forwarded-for over other headers', () => {
      const request = new Request('http://localhost/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '192.168.1.2',
          'remote-addr': '192.168.1.3',
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });
  });
});
