import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { handleWebhookRevalidation } from '@/lib/revalidation';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Webhook secret for GitHub (optional but recommended)
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn(
      'GitHub webhook secret not configured - skipping signature verification'
    );
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(`sha256=${expectedSignature}`, 'utf8');
  const actualBuffer = Buffer.from(signature, 'utf8');

  return (
    expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256') || '';
    const event = request.headers.get('x-github-event') || '';
    const payload = await request.text();

    // Verify webhook signature
    if (!verifySignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // Log webhook event
    console.log(`GitHub webhook received: ${event}`, {
      repository: data.repository?.full_name,
      ref: data.ref,
      commits: data.commits?.length || 0,
    });

    // Handle different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(data);
        break;

      case 'pull_request':
        await handlePullRequestEvent(data);
        break;

      case 'repository':
        await handleRepositoryEvent(data);
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({
      message: 'Webhook processed successfully',
      event,
      repository: data.repository?.full_name,
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePushEvent(data: any) {
  const { repository, ref, commits } = data;

  // Only process pushes to the main branch
  if (ref !== `refs/heads/${env.GITHUB_BRANCH}`) {
    console.log(
      `Ignoring push to ${ref}, only processing ${env.GITHUB_BRANCH}`
    );
    return;
  }

  // Check if any commits affect content files
  const contentChanges = commits?.some(
    (commit: any) =>
      commit.added?.some((file: string) => file.startsWith('content/')) ||
      commit.modified?.some((file: string) => file.startsWith('content/')) ||
      commit.removed?.some((file: string) => file.startsWith('content/'))
  );

  if (contentChanges) {
    console.log('Content changes detected, triggering revalidation...');

    // Trigger ISR revalidation for changed content
    const revalidationResult = await handleWebhookRevalidation({ commits });

    console.log('Revalidation result:', revalidationResult);

    // Also trigger rebuild if needed
    await triggerRebuild({
      reason: 'content_update',
      repository: repository.full_name,
      commits: commits.length,
      branch: env.GITHUB_BRANCH,
    });
  }
}

async function handlePullRequestEvent(data: any) {
  const { action, pull_request } = data;

  console.log(`Pull request ${action}:`, {
    number: pull_request.number,
    title: pull_request.title,
    state: pull_request.state,
  });

  // Handle PR events (e.g., preview deployments)
  if (action === 'opened' || action === 'synchronize') {
    // Could trigger preview build here
    console.log('PR opened/updated - could trigger preview build');
  }
}

async function handleRepositoryEvent(data: any) {
  const { action, repository } = data;

  console.log(`Repository ${action}:`, repository.full_name);

  // Handle repository events (e.g., settings changes)
}

async function triggerRebuild(context: {
  reason: string;
  repository: string;
  commits: number;
  branch: string;
}) {
  try {
    // In a real implementation, you might:
    // 1. Call a build service API
    // 2. Trigger Vercel/Netlify rebuild
    // 3. Set a flag for Next.js ISR
    // 4. Send notification to admin

    console.log('Rebuild triggered:', context);

    // For now, just log the rebuild request
    // In production, you might call:
    // - Vercel Deploy Hook
    // - Netlify Build Hook
    // - Custom build service

    // Example: Call Vercel deploy hook
    // if (process.env.VERCEL_DEPLOY_HOOK) {
    //   await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' });
    // }

    return { success: true, context };
  } catch (error) {
    console.error('Rebuild trigger failed:', error);
    throw error;
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'GitHub webhook handler',
    timestamp: new Date().toISOString(),
  });
}
