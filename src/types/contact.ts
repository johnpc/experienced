/**
 * Contact form types and interfaces
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message: string;
  consent: boolean;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

export interface ExternalServiceIntegration {
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface ContactFormConfig {
  enableCaptcha: boolean;
  enableRateLimit: boolean;
  maxSubmissionsPerHour: number;
  externalServices: ExternalServiceIntegration[];
  notificationEmail?: string;
}

export type ProjectType =
  | 'kitchen'
  | 'bathroom'
  | 'addition'
  | 'renovation'
  | 'exterior'
  | 'commercial'
  | 'other';

export type BudgetRange =
  | 'under-10k'
  | '10k-25k'
  | '25k-50k'
  | '50k-100k'
  | 'over-100k';
