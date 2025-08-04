import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getSession } from '@/lib/auth';
import { GitHubAPI } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session?.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate GitHub token before returning it
    const github = new GitHubAPI();
    const validation = await github.validateAccess();

    if (!validation.valid) {
      console.error('GitHub token validation failed:', validation.error);
      return NextResponse.json(
        { error: 'GitHub token is invalid or expired' },
        { status: 403 }
      );
    }

    // Return the GitHub token for Decap CMS
    return NextResponse.json({
      token: env.GITHUB_TOKEN,
      repo: env.GITHUB_REPO,
      branch: env.GITHUB_BRANCH,
    });
  } catch (error) {
    console.error('CMS auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session?.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle GitHub API requests from Decap CMS
    const body = await request.json();
    const { url, method = 'GET', headers = {}, data } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate that the URL is a GitHub API URL
    if (!url.startsWith('https://api.github.com/')) {
      return NextResponse.json(
        { error: 'Only GitHub API URLs are allowed' },
        { status: 400 }
      );
    }

    // Forward the request to GitHub API with authentication
    const githubResponse = await fetch(url, {
      method,
      headers: {
        ...headers,
        Authorization: `token ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'NextJS-Marketing-CMS/1.0',
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await githubResponse.json().catch(() => ({}));

    // Log GitHub API errors for debugging
    if (!githubResponse.ok) {
      console.error('GitHub API error:', {
        status: githubResponse.status,
        statusText: githubResponse.statusText,
        url,
        error: responseData,
      });
    }

    return NextResponse.json(responseData, {
      status: githubResponse.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API request' },
      { status: 500 }
    );
  }
}
