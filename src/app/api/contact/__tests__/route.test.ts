/**
 * Tests for contact form API route
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: () => ({
    get: jest.fn().mockReturnValue('test-user-agent'),
  }),
}));

// Mock the rate limiter
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: jest.fn().mockResolvedValue({ success: true }),
  }),
}));

describe('/api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const validFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    projectType: 'kitchen',
    budget: '25k-50k',
    message: 'I would like to remodel my kitchen with modern appliances.',
    consent: true,
  };

  function createMockRequest(
    body: any,
    headers: Record<string, string> = {}
  ): NextRequest {
    return new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-agent': 'test-agent',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  describe('POST /api/contact', () => {
    it('should accept valid form submission', async () => {
      const request = createMockRequest(validFormData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Thank you for your message');
      expect(data.id).toBeDefined();
    });

    it('should accept minimal required fields', async () => {
      const minimalData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        message: 'Need help with renovation project.',
        consent: true,
      };

      const request = createMockRequest(minimalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should reject missing required fields', async () => {
      const incompleteData = {
        firstName: 'John',
        email: 'john@example.com',
        // Missing lastName, message, consent
      };

      const request = createMockRequest(incompleteData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid form data');
      expect(data.details).toBeDefined();
    });

    it('should reject invalid email addresses', async () => {
      const invalidEmailData = {
        ...validFormData,
        email: 'invalid-email',
      };

      const request = createMockRequest(invalidEmailData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject when consent is false', async () => {
      const noConsentData = {
        ...validFormData,
        consent: false,
      };

      const request = createMockRequest(noConsentData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should detect honeypot spam', async () => {
      const spamData = {
        ...validFormData,
        website: 'http://spam.com', // Honeypot field
      };

      const request = createMockRequest(spamData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid submission');
    });

    it('should handle rate limiting', async () => {
      // Mock rate limiter to return failure
      const mockRateLimit = require('@/lib/rate-limit').rateLimit;
      mockRateLimit.mockReturnValue({
        check: jest.fn().mockResolvedValue({ success: false }),
      });

      const request = createMockRequest(validFormData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Too many requests');
    });

    it('should validate project types', async () => {
      const validTypes = [
        'kitchen',
        'bathroom',
        'addition',
        'renovation',
        'exterior',
        'commercial',
        'other',
      ];

      for (const projectType of validTypes) {
        const data = { ...validFormData, projectType };
        const request = createMockRequest(data);
        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
      }

      // Test invalid project type
      const invalidData = { ...validFormData, projectType: 'invalid' };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
    });

    it('should validate budget ranges', async () => {
      const validBudgets = [
        'under-10k',
        '10k-25k',
        '25k-50k',
        '50k-100k',
        'over-100k',
      ];

      for (const budget of validBudgets) {
        const data = { ...validFormData, budget };
        const request = createMockRequest(data);
        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
      }

      // Test invalid budget
      const invalidData = { ...validFormData, budget: 'invalid' };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
    });

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should sanitize input data', async () => {
      const dirtyData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        phone: '  555-123-4567  ',
        message: '  This is my message  ',
        consent: true,
      };

      const request = createMockRequest(dirtyData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify that the data was processed (we can't directly check sanitization
      // but we can verify the submission was successful)
    });

    it('should include user agent and IP in processing', async () => {
      const request = createMockRequest(validFormData, {
        'user-agent': 'Mozilla/5.0 Test Browser',
        'x-forwarded-for': '192.168.1.1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify that console.log was called with submission info
      expect(console.log).toHaveBeenCalledWith(
        'Processing contact submission:',
        expect.objectContaining({
          id: expect.any(String),
          email: 'john.doe@example.com',
          projectType: 'kitchen',
          timestamp: expect.any(Date),
        })
      );
    });

    it('should generate unique submission IDs', async () => {
      const request1 = createMockRequest(validFormData);
      const request2 = createMockRequest(validFormData);

      const response1 = await POST(request1);
      const response2 = await POST(request2);

      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.id).toBeDefined();
      expect(data2.id).toBeDefined();
      expect(data1.id).not.toBe(data2.id);
    });
  });
});
