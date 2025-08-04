import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { GitHubAPI } from '@/lib/github';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'content';

    const github = new GitHubAPI();

    try {
      const contents = await github.getDirectory(path);

      // Filter and format the response
      const formattedContents = contents.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        url: item.html_url,
        lastModified: null, // Would need additional API call to get this
      }));

      return NextResponse.json({
        path,
        contents: formattedContents,
      });
    } catch (error) {
      // Path might not exist or be a file
      if (path !== 'content') {
        try {
          const file = await github.getFile(path);
          return NextResponse.json({
            path,
            type: 'file',
            content: file.content
              ? Buffer.from(file.content, 'base64').toString('utf8')
              : null,
            size: file.size,
            sha: file.sha,
          });
        } catch (fileError) {
          return NextResponse.json(
            { error: 'Path not found' },
            { status: 404 }
          );
        }
      }

      return NextResponse.json({
        path,
        contents: [],
        message:
          'Content directory not found. It will be created when you add content.',
      });
    }
  } catch (error) {
    console.error('GitHub content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const { path, content, message, author } = await request.json();

    if (!path || !content || !message) {
      return NextResponse.json(
        { error: 'Path, content, and message are required' },
        { status: 400 }
      );
    }

    const github = new GitHubAPI();

    const result = await github.saveFile(
      path,
      content,
      message,
      author || { name: 'CMS User', email: 'cms@example.com' }
    );

    return NextResponse.json({
      success: true,
      commit: {
        sha: result.commit.sha,
        message: result.commit.message,
        author: result.commit.author.name,
        date: result.commit.author.date,
      },
      file: {
        path: result.content.path,
        size: result.content.size,
        url: result.content.html_url,
      },
    });
  } catch (error) {
    console.error('GitHub content save error:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const { path, message, sha, author } = await request.json();

    if (!path || !message || !sha) {
      return NextResponse.json(
        { error: 'Path, message, and SHA are required' },
        { status: 400 }
      );
    }

    const github = new GitHubAPI();

    const result = await github.deleteFile(
      path,
      message,
      sha,
      author || { name: 'CMS User', email: 'cms@example.com' }
    );

    return NextResponse.json({
      success: true,
      commit: {
        sha: result.commit.sha,
        message: result.commit.message,
        author: result.commit.author.name,
        date: result.commit.author.date,
      },
    });
  } catch (error) {
    console.error('GitHub content delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
});
