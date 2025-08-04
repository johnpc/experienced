/**
 * Integration tests for ContactForm component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        id: 'test-id-123',
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render all form fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estimated budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/consent/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send message/i })
    ).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();

    render(<ContactForm onSuccess={mockOnSuccess} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'john.doe@example.com'
    );
    await user.type(screen.getByLabelText(/phone number/i), '555-123-4567');
    await user.selectOptions(screen.getByLabelText(/project type/i), 'kitchen');
    await user.selectOptions(
      screen.getByLabelText(/estimated budget/i),
      '25k-50k'
    );
    await user.type(
      screen.getByLabelText(/project details/i),
      'I would like to remodel my kitchen with modern appliances.'
    );
    await user.click(screen.getByLabelText(/consent/i));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for submission
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '555-123-4567',
          projectType: 'kitchen',
          budget: '25k-50k',
          message: 'I would like to remodel my kitchen with modern appliances.',
          consent: true,
        }),
      });
    });

    // Check success message
    await waitFor(() => {
      expect(
        screen.getByText(/thank you! your message has been sent successfully/i)
      ).toBeInTheDocument();
    });

    // Check callback was called
    expect(mockOnSuccess).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      projectType: 'kitchen',
      budget: '25k-50k',
      message: 'I would like to remodel my kitchen with modern appliances.',
      consent: true,
    });
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/project details are required/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/you must consent to being contacted/i)
      ).toBeInTheDocument();
    });

    // Form should not be submitted
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    // Enter invalid email
    await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
    await user.tab(); // Trigger blur validation

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('should validate name fields', async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    // Enter invalid names
    await user.type(screen.getByLabelText(/first name/i), 'A'); // Too short
    await user.type(screen.getByLabelText(/last name/i), 'B123'); // Contains numbers
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/first name must be at least 2 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/last name can only contain letters/i)
      ).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    const user = userEvent.setup();
    const mockOnError = jest.fn();

    // Mock API error
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Server error occurred',
      }),
    });

    render(<ContactForm onError={mockOnError} />);

    // Fill out minimal form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'john@example.com'
    );
    await user.type(screen.getByLabelText(/project details/i), 'Test message');
    await user.click(screen.getByLabelText(/consent/i));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
    });

    // Check error callback was called
    expect(mockOnError).toHaveBeenCalledWith('Server error occurred');
  });

  it('should handle network errors', async () => {
    const user = userEvent.setup();

    // Mock network error
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ContactForm />);

    // Fill out minimal form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'john@example.com'
    );
    await user.type(screen.getByLabelText(/project details/i), 'Test message');
    await user.click(screen.getByLabelText(/consent/i));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();

    // Mock delayed response
    (fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true, message: 'Success' }),
              }),
            100
          )
        )
    );

    render(<ContactForm />);

    // Fill out minimal form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'john@example.com'
    );
    await user.type(screen.getByLabelText(/project details/i), 'Test message');
    await user.click(screen.getByLabelText(/consent/i));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check loading state
    expect(screen.getByText(/sending message/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sending message/i })
    ).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    // Fill out the form
    const firstNameInput = screen.getByLabelText(
      /first name/i
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText(
      /email address/i
    ) as HTMLInputElement;
    const messageInput = screen.getByLabelText(
      /project details/i
    ) as HTMLTextAreaElement;
    const consentInput = screen.getByLabelText(/consent/i) as HTMLInputElement;

    await user.type(firstNameInput, 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(consentInput);

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for success and form reset
    await waitFor(() => {
      expect(
        screen.getByText(/thank you! your message has been sent successfully/i)
      ).toBeInTheDocument();
    });

    // Check that form fields are reset
    expect(firstNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
    expect(consentInput.checked).toBe(false);
  });

  it('should include honeypot field for spam detection', () => {
    render(<ContactForm />);

    // Check for honeypot field (should be hidden)
    const honeypotField = document.querySelector('input[name="website"]');
    expect(honeypotField).toBeInTheDocument();
    expect(honeypotField).toHaveStyle({ display: 'none' });
    expect(honeypotField).toHaveAttribute('tabIndex', '-1');
  });
});
