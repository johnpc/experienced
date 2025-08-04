# Content Structure Documentation

This directory contains all the content for the Premier Construction & Remodeling website. The content is organized into different types and follows a consistent structure for easy management through the Decap CMS.

## Directory Structure

```
content/
├── pages/           # Static pages (About, etc.)
├── projects/        # Project portfolio items
├── services/        # Service pages
├── blog/           # Blog posts and articles
├── testimonials/   # Customer testimonials
├── settings/       # Site configuration
└── README.md       # This documentation file
```

## Content Types

### Pages (`/pages/`)

Static pages that provide information about the company and services.

**Example files:**

- `about.md` - Company information, team, and history

**Front matter structure:**

```yaml
---
id: "unique-page-id"
title: "Page Title"
slug: "url-slug"
status: "published" | "draft"
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
seo:
  title: "SEO Title"
  description: "SEO Description"
  keywords: ["keyword1", "keyword2"]
---
```

### Projects (`/projects/`)

Portfolio items showcasing completed construction and remodeling projects.

**Example files:**

- `modern-kitchen-remodel.md` - Kitchen renovation showcase
- `luxury-master-bathroom.md` - Bathroom renovation showcase
- `family-room-addition.md` - Home addition showcase

**Front matter structure:**

```yaml
---
id: "unique-project-id"
title: "Project Title"
description: "Brief project description"
content: "Detailed project description"
images:
  - src: "image-url"
    alt: "Alt text"
    caption: "Image caption"
    width: 1200
    height: 800
category: "kitchen" | "bathroom" | "addition" | "renovation" | "exterior" | "commercial"
completedAt: "2024-01-01T00:00:00.000Z"
featured: true | false
seo:
  title: "SEO Title"
  description: "SEO Description"
  keywords: ["keyword1", "keyword2"]
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
status: "published" | "draft"
---
```

### Services (`/services/`)

Detailed pages describing the services offered by the company.

**Example files:**

- `kitchen-remodeling.md` - Kitchen remodeling services
- `bathroom-renovation.md` - Bathroom renovation services
- `home-additions.md` - Home addition services

**Front matter structure:**

```yaml
---
id: "unique-service-id"
title: "Service Title"
slug: "url-slug"
description: "Brief service description"
content: "Detailed service description"
icon: "icon-name"
featuredImage: "image-url"
gallery:
  - src: "image-url"
    alt: "Alt text"
    caption: "Image caption"
features:
  - "Feature 1"
  - "Feature 2"
seo:
  title: "SEO Title"
  description: "SEO Description"
  keywords: ["keyword1", "keyword2"]
order: 1
featured: true | false
status: "published" | "draft"
---
```

### Blog (`/blog/`)

Articles, tips, and industry insights.

**Example files:**

- `2024-kitchen-remodeling-trends.md` - Industry trends article

**Front matter structure:**

```yaml
---
id: "unique-blog-id"
title: "Blog Post Title"
slug: "url-slug"
excerpt: "Brief excerpt"
content: "Full article content"
author: "Author Name"
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
tags: ["tag1", "tag2"]
category: "Category Name"
featuredImage: "image-url"
seo:
  title: "SEO Title"
  description: "SEO Description"
  keywords: ["keyword1", "keyword2"]
status: "published" | "draft"
---
```

### Testimonials (`/testimonials/`)

Customer reviews and testimonials.

**Example files:**

- `sarah-johnson.md` - Customer testimonial
- `jennifer-martinez.md` - Customer testimonial

**Front matter structure:**

```yaml
---
id: "unique-testimonial-id"
name: "Customer Name"
company: "Company Name" (optional)
content: "Testimonial text"
rating: 5
avatar: "avatar-image-url" (optional)
projectId: "related-project-id" (optional)
featured: true | false
publishedAt: "2024-01-01T00:00:00.000Z"
---
```

### Settings (`/settings/`)

Site-wide configuration and settings.

**Files:**

- `general.yml` - General site settings

**Structure:**

```yaml
siteName: 'Site Name'
siteUrl: 'https://example.com'
description: 'Site description'
contact:
  phone: 'Phone number'
  email: 'Email address'
  address:
    street: 'Street address'
    city: 'City'
    state: 'State'
    zipCode: 'ZIP code'
    country: 'Country'
  businessHours:
    - day: 'Monday'
      open: '8:00 AM'
      close: '5:00 PM'
      closed: false
social:
  facebook: 'Facebook URL'
  instagram: 'Instagram URL'
  twitter: 'Twitter URL'
seo:
  defaultTitle: 'Default title'
  titleTemplate: 'Title template'
  defaultDescription: 'Default description'
  defaultKeywords: ['keyword1', 'keyword2']
  ogImage: 'Default OG image'
```

## Content Guidelines

### Writing Style

- Use clear, professional language
- Focus on benefits to customers
- Include specific details and examples
- Use active voice when possible
- Keep paragraphs concise and scannable

### SEO Best Practices

- Include relevant keywords naturally in content
- Write compelling meta descriptions (120-160 characters)
- Use descriptive, keyword-rich titles
- Include alt text for all images
- Use proper heading hierarchy (H1, H2, H3)

### Image Guidelines

- Use high-quality, professional images
- Include descriptive alt text for accessibility
- Optimize images for web (recommended: 1200px wide for featured images)
- Use consistent aspect ratios within content types
- Include captions when helpful for context

### Content Organization

- Use clear, descriptive headings
- Break up long content with subheadings
- Include bullet points and lists for easy scanning
- Add relevant internal links between related content
- Keep content focused and relevant to the target audience

## Content Management

### Adding New Content

1. Create a new markdown file in the appropriate directory
2. Follow the front matter structure for that content type
3. Write clear, engaging content following the style guidelines
4. Include relevant images with proper alt text
5. Set appropriate SEO metadata
6. Set status to "published" when ready to go live

### Updating Existing Content

1. Locate the appropriate markdown file
2. Make necessary changes to content or front matter
3. Update the `updatedAt` timestamp
4. Ensure all links and references are still valid
5. Review SEO metadata for accuracy

### Content Review Process

1. Check for spelling and grammar errors
2. Verify all links work correctly
3. Ensure images load properly and have alt text
4. Review SEO metadata for completeness
5. Test content display on the website
6. Confirm content follows brand guidelines

## Sample Content Included

The following sample content has been created to demonstrate the structure and provide a starting point:

### Pages

- **About Us**: Company history, team information, and mission

### Services

- **Kitchen Remodeling**: Comprehensive kitchen renovation services
- **Bathroom Renovation**: Complete bathroom remodeling services
- **Home Additions**: Room additions and home expansions

### Projects

- **Modern Kitchen Remodel**: Showcase of kitchen transformation
- **Luxury Master Bathroom**: Spa-inspired bathroom renovation
- **Family Room Addition**: Open-concept room addition

### Blog

- **2024 Kitchen Remodeling Trends**: Industry trends and insights

### Testimonials

- Multiple customer testimonials with ratings and project references

### Settings

- Complete site configuration with contact information, business hours, and SEO settings

## Next Steps

1. Review and customize the sample content to match your specific business
2. Add additional projects from your portfolio
3. Create more service pages for specialized offerings
4. Develop a content calendar for regular blog posts
5. Collect and add more customer testimonials
6. Update contact information and business details in settings

This content structure provides a solid foundation for your construction and remodeling website while remaining flexible for future expansion and customization.
