/**
 * Tests for contact form validation schema
 */

import {
  contactFormSchema,
  validateContactForm,
  sanitizeContactFormData,
} from '../contact-schema';

describe('Contact Form Schema', () => {
  describe('contactFormSchema', () => {
    it('should validate a complete valid form', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        projectType: 'kitchen',
        budget: '25k-50k',
        message:
          'I would like to remodel my kitchen with modern appliances and new cabinets.',
        consent: true,
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate minimal required fields', () => {
      const minimalData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        message: 'Need help with bathroom renovation project.',
        consent: true,
      };

      const result = contactFormSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const incompleteData = {
        firstName: 'John',
        // Missing lastName, email, message, consent
      };

      const result = contactFormSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.errors.map((e) => e.path[0]);
        expect(errors).toContain('lastName');
        expect(errors).toContain('email');
        expect(errors).toContain('message');
        expect(errors).toContain('consent');
      }
    });

    it('should validate name fields', () => {
      const testCases = [
        { firstName: 'A', valid: false }, // Too short
        { firstName: 'John123', valid: false }, // Contains numbers
        { firstName: 'Mary-Jane', valid: true }, // Hyphen allowed
        { firstName: "O'Connor", valid: true }, // Apostrophe allowed
        { firstName: 'Jean Pierre', valid: true }, // Space allowed
        { firstName: 'X'.repeat(51), valid: false }, // Too long
      ];

      testCases.forEach(({ firstName, valid }) => {
        const data = {
          firstName,
          lastName: 'Doe',
          email: 'test@example.com',
          message: 'Test message for validation',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(valid);
      });
    });

    it('should validate email addresses', () => {
      const testCases = [
        { email: 'valid@example.com', valid: true },
        { email: 'user.name+tag@example.co.uk', valid: true },
        { email: 'invalid-email', valid: false },
        { email: '@example.com', valid: false },
        { email: 'user@', valid: false },
        { email: '', valid: false },
      ];

      testCases.forEach(({ email, valid }) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email,
          message: 'Test message for validation',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(valid);
      });
    });

    it('should validate phone numbers', () => {
      const testCases = [
        { phone: '555-123-4567', valid: true },
        { phone: '(555) 123-4567', valid: true },
        { phone: '555.123.4567', valid: true },
        { phone: '5551234567', valid: true },
        { phone: '+1-555-123-4567', valid: true },
        { phone: 'invalid-phone', valid: false },
        { phone: '123', valid: false },
        { phone: '', valid: true }, // Optional field
        { phone: undefined, valid: true }, // Optional field
      ];

      testCases.forEach(({ phone, valid }) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone,
          message: 'Test message for validation',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(valid);
      });
    });

    it('should validate project types', () => {
      const validTypes = [
        'kitchen',
        'bathroom',
        'addition',
        'renovation',
        'exterior',
        'commercial',
        'other',
      ];
      const invalidTypes = ['invalid', 'unknown', ''];

      validTypes.forEach((projectType) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          projectType,
          message: 'Test message',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      invalidTypes.forEach((projectType) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          projectType,
          message: 'Test message',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should validate budget ranges', () => {
      const validBudgets = [
        'under-10k',
        '10k-25k',
        '25k-50k',
        '50k-100k',
        'over-100k',
      ];
      const invalidBudgets = ['invalid', 'unknown', ''];

      validBudgets.forEach((budget) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          budget,
          message: 'Test message',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      invalidBudgets.forEach((budget) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          budget,
          message: 'Test message',
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('should validate message field', () => {
      const testCases = [
        { message: 'Short', valid: false }, // Too short
        {
          message: 'This is a valid message with enough characters',
          valid: true,
        },
        { message: 'X'.repeat(2001), valid: false }, // Too long
        { message: '', valid: false }, // Empty
      ];

      testCases.forEach(({ message, valid }) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          message,
          consent: true,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(valid);
      });
    });

    it('should require consent', () => {
      const testCases = [
        { consent: true, valid: true },
        { consent: false, valid: false },
      ];

      testCases.forEach(({ consent, valid }) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          message: 'Test message for validation',
          consent,
        };

        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(valid);
      });
    });
  });

  describe('validateContactForm', () => {
    it('should return success for valid data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Test message for validation',
        consent: true,
      };

      const result = validateContactForm(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid data', () => {
      const invalidData = {
        firstName: '',
        email: 'invalid-email',
        consent: false,
      };

      const result = validateContactForm(invalidData);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe('sanitizeContactFormData', () => {
    it('should trim whitespace and normalize email', () => {
      const dirtyData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        phone: '  555-123-4567  ',
        projectType: 'kitchen' as const,
        budget: '25k-50k' as const,
        message: '  This is my message  ',
        consent: true,
      };

      const sanitized = sanitizeContactFormData(dirtyData);

      expect(sanitized.firstName).toBe('John');
      expect(sanitized.lastName).toBe('Doe');
      expect(sanitized.email).toBe('john.doe@example.com');
      expect(sanitized.phone).toBe('555-123-4567');
      expect(sanitized.message).toBe('This is my message');
    });

    it('should handle undefined optional fields', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: undefined,
        projectType: undefined,
        budget: undefined,
        message: 'Test message',
        consent: true,
      };

      const sanitized = sanitizeContactFormData(data);

      expect(sanitized.phone).toBeUndefined();
      expect(sanitized.projectType).toBeUndefined();
      expect(sanitized.budget).toBeUndefined();
    });
  });
});
