import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import {
  revalidateContent,
  revalidateAllContent,
  REVALIDATION_TAGS,
} from '@/lib/revalidation';

export const dynamic = 'force-dynamic';

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { type, paths } = body;

    if (type === 'all') {
      await revalidateAllContent();
      return NextResponse.json({
        success: true,
        message: 'All content revalidated successfully',
        timestamp: new Date().toISOString(),
      });
    }

    if (type && Object.keys(REVALIDATION_TAGS).includes(type.toUpperCase())) {
      await revalidateContent(
        type.toUpperCase() as keyof typeof REVALIDATION_TAGS,
        paths
      );
      return NextResponse.json({
        success: true,
        message: `Content type ${type} revalidated successfully`,
        paths: paths || [],
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid revalidation type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate content' },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async () => {
  return NextResponse.json({
    availableTypes: Object.keys(REVALIDATION_TAGS),
    message: 'Use POST to trigger revalidation',
    example: {
      type: 'projects',
      paths: ['/projects/kitchen-remodel'],
    },
  });
});
