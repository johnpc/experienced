import {
  verifySessionToken,
  createSessionToken,
  validateCredentials,
  getSessionExpiry,
  isSessionExpiringSoon,
} from '../auth';

// Mock environment variables
jest.mock('../env', () => ({
  env: {
    ADMIN_USERNAME: 'testuser',
    ADMIN_PASSWORD: 'testpass123',
  },
}));

describe('Authentication Utils', () => {
  describe('createSessionToken', () => {
    it('should create a valid session token', () => {
      const username = 'testuser';
      const token = createSessionToken(username);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should create different tokens for different timestamps', () => {
      const username = 'testuser';
      const token1 = createSessionToken(username);

      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        const token2 = createSessionToken(username);
        expect(token1).not.toBe(token2);
      }, 10);
    });
  });

  describe('verifySessionToken', () => {
    it('should verify a valid session token', () => {
      const username = 'testuser';
      const token = createSessionToken(username);
      const result = verifySessionToken(token);

      expect(result).toBeDefined();
      expect(result?.username).toBe(username);
      expect(result?.isValid).toBe(true);
      expect(result?.timestamp).toBeGreaterThan(0);
    });

    it('should reject token with wrong username', () => {
      // Create token with different username
      const timestamp = Date.now();
      const payload = `wronguser:${timestamp}`;
      const token = Buffer.from(payload).toString('base64');

      const result = verifySessionToken(token);

      expect(result?.isValid).toBe(false);
      expect(result?.username).toBe('wronguser');
    });

    it('should reject expired token', () => {
      // Create token that's older than 24 hours
      const username = 'testuser';
      const oldTimestamp = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      const payload = `${username}:${oldTimestamp}`;
      const token = Buffer.from(payload).toString('base64');

      const result = verifySessionToken(token);

      expect(result?.isValid).toBe(false);
      expect(result?.username).toBe(username);
    });

    it('should handle invalid token format', () => {
      const invalidToken = 'invalid-token';
      const result = verifySessionToken(invalidToken);

      expect(result).toBeNull();
    });

    it('should handle malformed base64 token', () => {
      const malformedToken = 'not-base64!@#';
      const result = verifySessionToken(malformedToken);

      expect(result).toBeNull();
    });
  });

  describe('validateCredentials', () => {
    it('should validate correct credentials', () => {
      const result = validateCredentials('testuser', 'testpass123');
      expect(result).toBe(true);
    });

    it('should reject incorrect username', () => {
      const result = validateCredentials('wronguser', 'testpass123');
      expect(result).toBe(false);
    });

    it('should reject incorrect password', () => {
      const result = validateCredentials('testuser', 'wrongpass');
      expect(result).toBe(false);
    });

    it('should reject empty credentials', () => {
      expect(validateCredentials('', '')).toBe(false);
      expect(validateCredentials('testuser', '')).toBe(false);
      expect(validateCredentials('', 'testpass123')).toBe(false);
    });
  });

  describe('getSessionExpiry', () => {
    it('should return correct expiry time', () => {
      const timestamp = Date.now();
      const expiry = getSessionExpiry(timestamp);
      const expectedExpiry = new Date(timestamp + 24 * 60 * 60 * 1000);

      expect(expiry.getTime()).toBe(expectedExpiry.getTime());
    });
  });

  describe('isSessionExpiringSoon', () => {
    it('should return true for session expiring within 1 hour', () => {
      // Create timestamp that will expire in 30 minutes
      const timestamp = Date.now() - 23.5 * 60 * 60 * 1000; // 23.5 hours ago
      const result = isSessionExpiringSoon(timestamp);

      expect(result).toBe(true);
    });

    it('should return false for session with plenty of time left', () => {
      // Create timestamp that will expire in 12 hours
      const timestamp = Date.now() - 12 * 60 * 60 * 1000; // 12 hours ago
      const result = isSessionExpiringSoon(timestamp);

      expect(result).toBe(false);
    });

    it('should return true for already expired session', () => {
      // Create timestamp that expired 1 hour ago
      const timestamp = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      const result = isSessionExpiringSoon(timestamp);

      expect(result).toBe(true);
    });
  });

  describe('integration test', () => {
    it('should create and verify token in complete flow', () => {
      const username = 'testuser';

      // Create token
      const token = createSessionToken(username);
      expect(token).toBeDefined();

      // Verify token
      const session = verifySessionToken(token);
      expect(session).toBeDefined();
      expect(session?.username).toBe(username);
      expect(session?.isValid).toBe(true);

      // Check expiry
      const expiry = getSessionExpiry(session!.timestamp);
      expect(expiry.getTime()).toBeGreaterThan(Date.now());

      // Check if expiring soon (should be false for new token)
      const expiringSoon = isSessionExpiringSoon(session!.timestamp);
      expect(expiringSoon).toBe(false);
    });
  });
});
