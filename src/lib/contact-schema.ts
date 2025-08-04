/**
 * Contact form validation schemas using Zod
 */

import { z } from 'zod';

// Phone number validation regex (flexible format)
const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{7,20}$/;

// Contact form validation schema
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || phoneRegex.test(val.replace(/[\s\-\(\)\.]/g, '')),
      {
        message: 'Please enter a valid phone number',
      }
    ),

  projectType: z
    .enum([
      'kitchen',
      'bathroom',
      'addition',
      'renovation',
      'exterior',
      'commercial',
      'other',
    ])
    .optional(),

  budget: z
    .enum(['under-10k', '10k-25k', '25k-50k', '50k-100k', 'over-100k'])
    .optional(),

  message: z
    .string()
    .min(1, 'Project details are required')
    .min(10, 'Please provide at least 10 characters describing your project')
    .max(2000, 'Message must be less than 2000 characters'),

  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to being contacted',
  }),
});

// Server-side validation schema (includes additional sanitization)
export const serverContactFormSchema = contactFormSchema.extend({
  // Additional server-side fields for tracking
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  timestamp: z.date().optional(),
  honeypot: z.string().max(0, 'Bot detected').optional(), // Honeypot field for spam detection
});

// Type inference from schema
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ServerContactFormData = z.infer<typeof serverContactFormSchema>;

// Validation helper functions
export function validateContactForm(data: unknown): {
  success: boolean;
  data?: ContactFormData;
  errors?: z.ZodError;
} {
  try {
    const validatedData = contactFormSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function sanitizeContactFormData(
  data: ContactFormData
): ContactFormData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim(),
    projectType: data.projectType,
    budget: data.budget,
    message: data.message.trim(),
    consent: data.consent,
  };
}

// Form field configurations for UI
export const projectTypeOptions = [
  { value: 'kitchen', label: 'Kitchen Remodeling' },
  { value: 'bathroom', label: 'Bathroom Renovation' },
  { value: 'addition', label: 'Home Addition' },
  { value: 'renovation', label: 'Complete Renovation' },
  { value: 'exterior', label: 'Exterior Work' },
  { value: 'commercial', label: 'Commercial Project' },
  { value: 'other', label: 'Other' },
];

export const budgetRangeOptions = [
  { value: 'under-10k', label: 'Under $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
];
