'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactFormSchema,
  type ContactFormData,
  projectTypeOptions,
  budgetRangeOptions,
} from '@/lib/contact-schema';

interface ContactFormProps {
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: string) => void;
}

export default function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message:
            result.message ||
            "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
        });
        reset();
        onSuccess?.(data);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Get Free Estimate
      </h2>

      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            submitStatus.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {submitStatus.type === 'success' ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Honeypot field for spam detection */}
        <input
          type="text"
          name="website"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Name Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-invalid={errors.firstName ? 'true' : 'false'}
              aria-describedby={
                errors.firstName ? 'firstName-error' : undefined
              }
            />
            {errors.firstName && (
              <p
                id="firstName-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-invalid={errors.lastName ? 'true' : 'false'}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p
                id="lastName-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p
              id="phone-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Project Type Field */}
        <div>
          <label
            htmlFor="projectType"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Project Type
          </label>
          <select
            id="projectType"
            {...register('projectType')}
            className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.projectType ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-invalid={errors.projectType ? 'true' : 'false'}
            aria-describedby={
              errors.projectType ? 'projectType-error' : undefined
            }
          >
            <option value="">Select a project type</option>
            {projectTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p
              id="projectType-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.projectType.message}
            </p>
          )}
        </div>

        {/* Budget Field */}
        <div>
          <label
            htmlFor="budget"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Estimated Budget
          </label>
          <select
            id="budget"
            {...register('budget')}
            className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.budget ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-invalid={errors.budget ? 'true' : 'false'}
            aria-describedby={errors.budget ? 'budget-error' : undefined}
          >
            <option value="">Select budget range</option>
            {budgetRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.budget && (
            <p
              id="budget-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.budget.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Project Details *
          </label>
          <textarea
            id="message"
            rows={4}
            {...register('message')}
            placeholder="Please describe your project, timeline, and any specific requirements..."
            className={`w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.message ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p
              id="message-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            {...register('consent')}
            className={`mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
              errors.consent ? 'border-red-300' : ''
            }`}
            aria-invalid={errors.consent ? 'true' : 'false'}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <label htmlFor="consent" className="ml-2 text-sm text-gray-600">
            I consent to being contacted by Premier Construction regarding my
            project inquiry. *
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="text-sm text-red-600" role="alert">
            {errors.consent.message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-lg py-3 text-lg font-medium transition-colors duration-200 ${
            isSubmitting
              ? 'cursor-not-allowed bg-gray-400 text-gray-700'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          aria-describedby="submit-status"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending Message...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
