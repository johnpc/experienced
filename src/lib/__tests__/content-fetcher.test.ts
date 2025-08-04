import { ContentFetcher } from '../content-fetcher';
import { GitHubAPI } from '../github';

// Mock the GitHubAPI
jest.mock('../github');
const MockedGitHubAPI = GitHubAPI as jest.MockedClass<typeof GitHubAPI>;

describe('ContentFetcher', () => {
  let contentFetcher: ContentFetcher;
  let mockGitHub: jest.Mocked<GitHubAPI>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGitHub = new MockedGitHubAPI() as jest.Mocked<GitHubAPI>;
    contentFetcher = new ContentFetcher();
    (contentFetcher as any).github = mockGitHub;
  });

  describe('getPages', () => {
    it('should fetch and parse pages successfully', async () => {
      const mockFiles = [
        {
          name: 'about.md',
          path: 'content/pages/about.md',
          type: 'file' as const,
        },
        {
          name: 'contact.md',
          path: 'content/pages/contact.md',
          type: 'file' as const,
        },
      ];

      const mockPageContent = `---
id: "about-us"
title: "About Us"
slug: "about"
status: "published"
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
seo:
  title: "About Us"
  description: "About our company"
  keywords: []
---

# About Us

Content here.`;

      mockGitHub.getDirectory.mockResolvedValue(mockFiles);
      mockGitHub.getFileContent.mockResolvedValue(mockPageContent);

      const pages = await contentFetcher.getPages();

      expect(mockGitHub.getDirectory).toHaveBeenCalledWith('content/pages');
      expect(mockGitHub.getFileContent).toHaveBeenCalledTimes(2);
      expect(pages).toHaveLength(2);
      expect(pages[0].title).toBe('About Us');
      expect(pages[0].status).toBe('published');
    });

    it('should filter out draft pages', async () => {
      const mockFiles = [
        {
          name: 'published.md',
          path: 'content/pages/published.md',
          type: 'file' as const,
        },
        {
          name: 'draft.md',
          path: 'content/pages/draft.md',
          type: 'file' as const,
        },
      ];

      const publishedContent = `---
id: "published"
title: "Published Page"
slug: "published"
status: "published"
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
seo:
  title: "Published"
  description: "Published page"
  keywords: []
---

Content`;

      const draftContent = `---
id: "draft"
title: "Draft Page"
slug: "draft"
status: "draft"
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
seo:
  title: "Draft"
  description: "Draft page"
  keywords: []
---

Content`;

      mockGitHub.getDirectory.mockResolvedValue(mockFiles);
      mockGitHub.getFileContent
        .mockResolvedValueOnce(publishedContent)
        .mockResolvedValueOnce(draftContent);

      const pages = await contentFetcher.getPages();

      expect(pages).toHaveLength(1);
      expect(pages[0].title).toBe('Published Page');
    });

    it('should handle errors gracefully', async () => {
      mockGitHub.getDirectory.mockRejectedValue(new Error('GitHub API error'));

      const pages = await contentFetcher.getPages();

      expect(pages).toEqual([]);
    });
  });

  describe('getProjects', () => {
    it('should fetch and sort projects by completion date', async () => {
      const mockFiles = [
        {
          name: 'project1.md',
          path: 'content/projects/project1.md',
          type: 'file' as const,
        },
        {
          name: 'project2.md',
          path: 'content/projects/project2.md',
          type: 'file' as const,
        },
      ];

      const project1Content = `---
id: "project1"
title: "Project 1"
description: "First project"
category: "kitchen"
completedAt: "2024-01-01T00:00:00.000Z"
featured: false
status: "published"
publishedAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-01T00:00:00.000Z"
images:
  - src: "https://example.com/image1.jpg"
    alt: "Image 1"
seo:
  title: "Project 1"
  description: "First project"
  keywords: []
---

Content`;

      const project2Content = `---
id: "project2"
title: "Project 2"
description: "Second project"
category: "bathroom"
completedAt: "2024-02-01T00:00:00.000Z"
featured: true
status: "published"
publishedAt: "2024-02-01T00:00:00.000Z"
updatedAt: "2024-02-01T00:00:00.000Z"
images:
  - src: "https://example.com/image2.jpg"
    alt: "Image 2"
seo:
  title: "Project 2"
  description: "Second project"
  keywords: []
---

Content`;

      mockGitHub.getDirectory.mockResolvedValue(mockFiles);
      mockGitHub.getFileContent
        .mockResolvedValueOnce(project1Content)
        .mockResolvedValueOnce(project2Content);

      const projects = await contentFetcher.getProjects();

      expect(projects).toHaveLength(2);
      // Should be sorted by completion date (newest first)
      expect(projects[0].title).toBe('Project 2');
      expect(projects[1].title).toBe('Project 1');
    });
  });

  describe('getContentPaths', () => {
    it('should return all content paths for static generation', async () => {
      const mockProjects = [
        { id: 'project1', slug: 'project1' },
        { id: 'project2', slug: 'project2' },
      ];

      const mockServices = [{ slug: 'service1' }, { slug: 'service2' }];

      const mockBlogPosts = [{ slug: 'post1' }, { slug: 'post2' }];

      const mockPages = [{ slug: 'page1' }, { slug: 'page2' }];

      // Mock the individual get methods
      jest
        .spyOn(contentFetcher, 'getProjects')
        .mockResolvedValue(mockProjects as any);
      jest
        .spyOn(contentFetcher, 'getServices')
        .mockResolvedValue(mockServices as any);
      jest
        .spyOn(contentFetcher, 'getBlogPosts')
        .mockResolvedValue(mockBlogPosts as any);
      jest
        .spyOn(contentFetcher, 'getPages')
        .mockResolvedValue(mockPages as any);

      const paths = await contentFetcher.getContentPaths();

      expect(paths.projectPaths).toEqual(['project1', 'project2']);
      expect(paths.servicePaths).toEqual(['service1', 'service2']);
      expect(paths.blogPaths).toEqual(['post1', 'post2']);
      expect(paths.pagePaths).toEqual(['page1', 'page2']);
    });
  });

  describe('getLastContentUpdate', () => {
    it('should return the date of the last commit', async () => {
      const mockCommits = [
        {
          sha: 'abc123',
          author: {
            name: 'Test User',
            email: 'test@example.com',
            date: '2024-01-15T10:00:00Z',
          },
          message: 'Update content',
        },
      ];

      mockGitHub.getCommits.mockResolvedValue(mockCommits as any);

      const lastUpdate = await contentFetcher.getLastContentUpdate();

      expect(lastUpdate).toEqual(new Date('2024-01-15T10:00:00Z'));
      expect(mockGitHub.getCommits).toHaveBeenCalledWith(1);
    });

    it('should return null if no commits found', async () => {
      mockGitHub.getCommits.mockResolvedValue([]);

      const lastUpdate = await contentFetcher.getLastContentUpdate();

      expect(lastUpdate).toBeNull();
    });
  });

  describe('getContentStats', () => {
    it('should return content statistics', async () => {
      // Mock all the get methods
      jest.spyOn(contentFetcher, 'getPages').mockResolvedValue([{}, {}] as any);
      jest
        .spyOn(contentFetcher, 'getProjects')
        .mockResolvedValue([{}, {}, {}] as any);
      jest.spyOn(contentFetcher, 'getServices').mockResolvedValue([{}] as any);
      jest
        .spyOn(contentFetcher, 'getBlogPosts')
        .mockResolvedValue([{}, {}] as any);
      jest
        .spyOn(contentFetcher, 'getTestimonials')
        .mockResolvedValue([{}] as any);
      jest
        .spyOn(contentFetcher, 'getLastContentUpdate')
        .mockResolvedValue(new Date('2024-01-15T10:00:00Z'));

      const stats = await contentFetcher.getContentStats();

      expect(stats.totalPages).toBe(2);
      expect(stats.totalProjects).toBe(3);
      expect(stats.totalServices).toBe(1);
      expect(stats.totalBlogPosts).toBe(2);
      expect(stats.totalTestimonials).toBe(1);
      expect(stats.lastUpdate).toEqual(new Date('2024-01-15T10:00:00Z'));
    });
  });
});
