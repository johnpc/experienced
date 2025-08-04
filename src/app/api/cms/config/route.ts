import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { withAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async () => {
  try {
    const config = {
      backend: {
        name: 'github',
        repo: env.GITHUB_REPO,
        branch: env.GITHUB_BRANCH,
        api_root: '/api/cms-auth',
        base_url: env.NEXT_PUBLIC_SITE_URL,
      },
      media_folder: 'public/images/uploads',
      public_folder: '/images/uploads',
      collections: [
        {
          name: 'pages',
          label: 'Pages',
          folder: 'content/pages',
          create: true,
          slug: '{{slug}}',
          fields: [
            { label: 'Title', name: 'title', widget: 'string' },
            {
              label: 'Slug',
              name: 'slug',
              widget: 'string',
              pattern: [
                '^[a-z0-9-]+$',
                'Must be lowercase letters, numbers, and hyphens only',
              ],
            },
            { label: 'Publish Date', name: 'publishedAt', widget: 'datetime' },
            {
              label: 'Status',
              name: 'status',
              widget: 'select',
              options: ['draft', 'published'],
              default: 'draft',
            },
            {
              label: 'SEO',
              name: 'seo',
              widget: 'object',
              fields: [
                {
                  label: 'Title',
                  name: 'title',
                  widget: 'string',
                  hint: 'Max 60 characters for optimal SEO',
                },
                {
                  label: 'Description',
                  name: 'description',
                  widget: 'text',
                  hint: 'Max 160 characters for optimal SEO',
                },
                {
                  label: 'Keywords',
                  name: 'keywords',
                  widget: 'list',
                  allow_add: true,
                  default: [],
                },
                {
                  label: 'OG Image',
                  name: 'ogImage',
                  widget: 'image',
                  required: false,
                },
              ],
            },
            { label: 'Body', name: 'body', widget: 'markdown' },
          ],
        },
        {
          name: 'projects',
          label: 'Projects',
          folder: 'content/projects',
          create: true,
          slug: '{{slug}}',
          fields: [
            { label: 'Title', name: 'title', widget: 'string' },
            {
              label: 'Description',
              name: 'description',
              widget: 'text',
              hint: 'Brief project description',
            },
            {
              label: 'Category',
              name: 'category',
              widget: 'select',
              options: [
                'kitchen',
                'bathroom',
                'addition',
                'renovation',
                'exterior',
                'commercial',
              ],
            },
            {
              label: 'Completed Date',
              name: 'completedAt',
              widget: 'datetime',
            },
            {
              label: 'Featured Project',
              name: 'featured',
              widget: 'boolean',
              default: false,
            },
            {
              label: 'Status',
              name: 'status',
              widget: 'select',
              options: ['draft', 'published'],
              default: 'draft',
            },
            {
              label: 'Images',
              name: 'images',
              widget: 'list',
              min: 1,
              fields: [
                { label: 'Image', name: 'src', widget: 'image' },
                {
                  label: 'Alt Text',
                  name: 'alt',
                  widget: 'string',
                  hint: 'Describe the image for accessibility',
                },
                {
                  label: 'Caption',
                  name: 'caption',
                  widget: 'string',
                  required: false,
                },
              ],
            },
            {
              label: 'SEO',
              name: 'seo',
              widget: 'object',
              fields: [
                {
                  label: 'Title',
                  name: 'title',
                  widget: 'string',
                  hint: 'Max 60 characters for optimal SEO',
                },
                {
                  label: 'Description',
                  name: 'description',
                  widget: 'text',
                  hint: 'Max 160 characters for optimal SEO',
                },
                {
                  label: 'Keywords',
                  name: 'keywords',
                  widget: 'list',
                  allow_add: true,
                  default: [],
                },
              ],
            },
            {
              label: 'Content',
              name: 'body',
              widget: 'markdown',
              hint: 'Detailed project description and process',
            },
          ],
        },
        {
          name: 'services',
          label: 'Services',
          folder: 'content/services',
          create: true,
          slug: '{{slug}}',
          fields: [
            { label: 'Title', name: 'title', widget: 'string' },
            {
              label: 'Slug',
              name: 'slug',
              widget: 'string',
              pattern: [
                '^[a-z0-9-]+$',
                'Must be lowercase letters, numbers, and hyphens only',
              ],
            },
            {
              label: 'Description',
              name: 'description',
              widget: 'text',
              hint: 'Brief service description',
            },
            {
              label: 'Order',
              name: 'order',
              widget: 'number',
              default: 0,
              hint: 'Display order (lower numbers first)',
            },
            {
              label: 'Featured Service',
              name: 'featured',
              widget: 'boolean',
              default: false,
            },
            {
              label: 'Status',
              name: 'status',
              widget: 'select',
              options: ['draft', 'published'],
              default: 'draft',
            },
            {
              label: 'Icon',
              name: 'icon',
              widget: 'string',
              required: false,
              hint: 'Icon name or class',
            },
            {
              label: 'Featured Image',
              name: 'featuredImage',
              widget: 'image',
              required: false,
            },
            {
              label: 'SEO',
              name: 'seo',
              widget: 'object',
              fields: [
                {
                  label: 'Title',
                  name: 'title',
                  widget: 'string',
                  hint: 'Max 60 characters for optimal SEO',
                },
                {
                  label: 'Description',
                  name: 'description',
                  widget: 'text',
                  hint: 'Max 160 characters for optimal SEO',
                },
                {
                  label: 'Keywords',
                  name: 'keywords',
                  widget: 'list',
                  allow_add: true,
                  default: [],
                },
              ],
            },
            { label: 'Content', name: 'body', widget: 'markdown' },
          ],
        },
      ],
      publish_mode: 'editorial_workflow',
      local_backend: process.env.NODE_ENV === 'development',
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error generating CMS config:', error);
    return NextResponse.json(
      { error: 'Failed to generate CMS configuration' },
      { status: 500 }
    );
  }
});
