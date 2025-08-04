import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  contactFormSchema,
  sanitizeContactFormData,
  type ContactFormData,
} from '@/lib/contact-schema';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500, // Limit each IP to 500 requests per hour
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1';
    const { success: rateLimitSuccess } = await limiter.check(5, ip); // 5 requests per hour per IP

    if (!rateLimitSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Check honeypot field (should be empty)
    if (body.website && body.website.trim() !== '') {
      console.warn('Spam detected via honeypot field');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid submission',
        },
        { status: 400 }
      );
    }

    // Validate form data
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    // Sanitize the data
    const sanitizedData = sanitizeContactFormData(validation.data);

    // Get additional request information
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const timestamp = new Date();

    // Create submission record
    const submission = {
      ...sanitizedData,
      userAgent,
      ipAddress: ip,
      timestamp,
      id: generateSubmissionId(),
    };

    // Process the submission
    const result = await processContactSubmission(submission);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message:
          "Thank you for your message! We'll get back to you within 24 hours.",
        id: submission.id,
      });
    } else {
      throw new Error(result.error || 'Failed to process submission');
    }
  } catch (error) {
    console.error('Contact form submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'An error occurred while processing your request. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Generate unique submission ID
function generateSubmissionId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Process contact form submission
async function processContactSubmission(
  submission: ContactFormData & {
    userAgent: string;
    ipAddress: string;
    timestamp: Date;
    id: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Log submission for debugging
    console.log('Processing contact submission:', {
      id: submission.id,
      email: submission.email,
      projectType: submission.projectType,
      timestamp: submission.timestamp,
    });

    // Send email notification
    const emailResult = await sendEmailNotification(submission);

    if (!emailResult.success) {
      console.error('Email notification failed:', emailResult.error);
      // Don't fail the entire submission if email fails
    }

    // Integrate with external services (if configured)
    await integrateWithExternalServices(submission);

    // Store submission (you could add database storage here)
    await storeSubmission(submission);

    return { success: true };
  } catch (error) {
    console.error('Error processing contact submission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Send email notification
async function sendEmailNotification(
  submission: ContactFormData & {
    id: string;
    timestamp: Date;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email configuration is available
    const notificationEmail = process.env.CONTACT_EMAIL;
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };

    if (!notificationEmail || !smtpConfig.host) {
      console.log('Email configuration not found, skipping email notification');
      return { success: true }; // Don't fail if email is not configured
    }

    // Format email content
    const emailContent = formatEmailContent(submission);

    // Here you would integrate with your email service
    // For now, we'll just log the email content
    console.log('Email notification would be sent:', {
      to: notificationEmail,
      subject: `New Contact Form Submission - ${submission.firstName} ${submission.lastName}`,
      content: emailContent,
    });

    // TODO: Implement actual email sending
    // Example with nodemailer:
    // const transporter = nodemailer.createTransporter(smtpConfig);
    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: notificationEmail,
    //   subject: `New Contact Form Submission - ${submission.firstName} ${submission.lastName}`,
    //   html: emailContent,
    // });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email sending failed',
    };
  }
}

// Format email content
function formatEmailContent(
  submission: ContactFormData & {
    id: string;
    timestamp: Date;
  }
): string {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Submission ID:</strong> ${submission.id}</p>
    <p><strong>Date:</strong> ${submission.timestamp.toLocaleString()}</p>

    <h3>Contact Information</h3>
    <p><strong>Name:</strong> ${submission.firstName} ${submission.lastName}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>

    <h3>Project Information</h3>
    <p><strong>Project Type:</strong> ${submission.projectType || 'Not specified'}</p>
    <p><strong>Budget:</strong> ${submission.budget || 'Not specified'}</p>

    <h3>Message</h3>
    <p>${submission.message.replace(/\n/g, '<br>')}</p>

    <hr>
    <p><em>This message was sent from the contact form on ${process.env.NEXT_PUBLIC_SITE_NAME}</em></p>
  `;
}

// Integrate with external services
async function integrateWithExternalServices(
  submission: ContactFormData & {
    id: string;
    timestamp: Date;
  }
): Promise<void> {
  // Salesforce integration (if configured)
  if (process.env.SALESFORCE_ENABLED === 'true') {
    try {
      await integrateSalesforce(submission);
    } catch (error) {
      console.error('Salesforce integration failed:', error);
      // Don't fail the entire submission
    }
  }

  // Add other integrations here (CRM, marketing automation, etc.)
}

// Salesforce integration placeholder
async function integrateSalesforce(
  submission: ContactFormData & {
    id: string;
    timestamp: Date;
  }
): Promise<void> {
  // TODO: Implement Salesforce integration
  console.log('Salesforce integration would process:', {
    id: submission.id,
    email: submission.email,
    projectType: submission.projectType,
  });

  // Example Salesforce lead creation:
  // const salesforceClient = new SalesforceClient({
  //   clientId: process.env.SALESFORCE_CLIENT_ID,
  //   clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
  //   username: process.env.SALESFORCE_USERNAME,
  //   password: process.env.SALESFORCE_PASSWORD,
  // });

  // await salesforceClient.createLead({
  //   FirstName: submission.firstName,
  //   LastName: submission.lastName,
  //   Email: submission.email,
  //   Phone: submission.phone,
  //   Company: 'Website Inquiry',
  //   Description: submission.message,
  //   LeadSource: 'Website Contact Form',
  // });
}

// Store submission (placeholder for database storage)
async function storeSubmission(
  submission: ContactFormData & {
    userAgent: string;
    ipAddress: string;
    timestamp: Date;
    id: string;
  }
): Promise<void> {
  // TODO: Implement database storage
  console.log('Submission would be stored:', {
    id: submission.id,
    timestamp: submission.timestamp,
    email: submission.email,
  });

  // Example database storage:
  // await db.contactSubmissions.create({
  //   data: {
  //     id: submission.id,
  //     firstName: submission.firstName,
  //     lastName: submission.lastName,
  //     email: submission.email,
  //     phone: submission.phone,
  //     projectType: submission.projectType,
  //     budget: submission.budget,
  //     message: submission.message,
  //     userAgent: submission.userAgent,
  //     ipAddress: submission.ipAddress,
  //     timestamp: submission.timestamp,
  //   },
  // });
}
