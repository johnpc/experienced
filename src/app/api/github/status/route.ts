import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { GitHubAPI } from '@/lib/github';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async () => {
  try {
    const github = new GitHubAPI();

    // Get repository status and statistics
    const [validation, stats] = await Promise.all([
      github.validateAccess(),
      github.getStats().catch(() => ({
        totalFiles: 0,
        lastCommit: null,
        repoInfo: null,
      })),
    ]);

    return NextResponse.json({
      connected: validation.valid,
      error: validation.error || null,
      repository: {
        name: stats.repoInfo?.name || 'Unknown',
        fullName: stats.repoInfo?.full_name || 'Unknown',
        private: stats.repoInfo?.private || false,
        defaultBranch: stats.repoInfo?.default_branch || 'main',
        url: stats.repoInfo?.html_url || null,
      },
      statistics: {
        totalFiles: stats.totalFiles,
        lastCommit: stats.lastCommit
          ? {
              sha: stats.lastCommit.sha.substring(0, 7),
              message: stats.lastCommit.message,
              author: stats.lastCommit.author.name,
              date: stats.lastCommit.author.date,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('GitHub status error:', error);
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        repository: null,
        statistics: null,
      },
      { status: 500 }
    );
  }
});
