import { GitHubAPI } from './github';
import { ContentParser } from './content-parser';
import type {
  Page,
  Project,
  Service,
  BlogPost,
  Testimonial,
  SiteConfig,
} from '@/types/content';

export class ContentFetcher {
  private github: GitHubAPI;

  constructor() {
    this.github = new GitHubAPI();
  }

  /**
   * Fetch all pages from the content repository
   */
  async getPages(): Promise<Page[]> {
    try {
      const files = await this.github.getDirectory('content/pages');
      const pages: Page[] = [];

      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          try {
            const content = await this.github.getFileContent(file.path);
            const page = ContentParser.parsePage(content);
            pages.push(page);
          } catch (error) {
            console.warn(`Failed to parse page ${file.path}:`, error);
          }
        }
      }

      return pages.filter((page) => page.status === 'published');
    } catch (error) {
      console.error('Failed to fetch pages:', error);
      return [];
    }
  }

  /**
   * Fetch a single page by slug
   */
  async getPage(slug: string): Promise<Page | null> {
    try {
      const content = await this.github.getFileContent(
        `content/pages/${slug}.md`
      );
      const page = ContentParser.parsePage(content);
      return page.status === 'published' ? page : null;
    } catch (error) {
      console.warn(`Failed to fetch page ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch all projects from the content repository
   */
  async getProjects(): Promise<Project[]> {
    try {
      const files = await this.github.getDirectory('content/projects');
      const projects: Project[] = [];

      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          try {
            const content = await this.github.getFileContent(file.path);
            const project = ContentParser.parseProject(content);
            projects.push(project);
          } catch (error) {
            console.warn(`Failed to parse project ${file.path}:`, error);
          }
        }
      }

      return projects
        .filter((project) => project.status === 'published')
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        );
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

  /**
   * Fetch a single project by slug
   */
  async getProject(slug: string): Promise<Project | null> {
    try {
      const content = await this.github.getFileContent(
        `content/projects/${slug}.md`
      );
      const project = ContentParser.parseProject(content);
      return project.status === 'published' ? project : null;
    } catch (error) {
      console.warn(`Failed to fetch project ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch all services from the content repository
   */
  async getServices(): Promise<Service[]> {
    try {
      const files = await this.github.getDirectory('content/services');
      const services: Service[] = [];

      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          try {
            const content = await this.github.getFileContent(file.path);
            const service = ContentParser.parseService(content);
            services.push(service);
          } catch (error) {
            console.warn(`Failed to parse service ${file.path}:`, error);
          }
        }
      }

      return services
        .filter((service) => service.status === 'published')
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
  }

  /**
   * Fetch a single service by slug
   */
  async getService(slug: string): Promise<Service | null> {
    try {
      const content = await this.github.getFileContent(
        `content/services/${slug}.md`
      );
      const service = ContentParser.parseService(content);
      return service.status === 'published' ? service : null;
    } catch (error) {
      console.warn(`Failed to fetch service ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch all blog posts from the content repository
   */
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const files = await this.github.getDirectory('content/blog');
      const posts: BlogPost[] = [];

      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          try {
            const content = await this.github.getFileContent(file.path);
            const post = ContentParser.parseBlogPost(content);
            posts.push(post);
          } catch (error) {
            console.warn(`Failed to parse blog post ${file.path}:`, error);
          }
        }
      }

      return posts
        .filter((post) => post.status === 'published')
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }
  }

  /**
   * Fetch a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      const content = await this.github.getFileContent(
        `content/blog/${slug}.md`
      );
      const post = ContentParser.parseBlogPost(content);
      return post.status === 'published' ? post : null;
    } catch (error) {
      console.warn(`Failed to fetch blog post ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch all testimonials from the content repository
   */
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const files = await this.github.getDirectory('content/testimonials');
      const testimonials: Testimonial[] = [];

      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          try {
            const content = await this.github.getFileContent(file.path);
            const testimonial = ContentParser.parseTestimonial(content);
            testimonials.push(testimonial);
          } catch (error) {
            console.warn(`Failed to parse testimonial ${file.path}:`, error);
          }
        }
      }

      return testimonials.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      return [];
    }
  }

  /**
   * Fetch site configuration
   */
  async getSiteConfig(): Promise<SiteConfig | null> {
    try {
      const content = await this.github.getFileContent(
        'content/settings/general.yml'
      );
      const config = ContentParser.parseSiteConfig(content);
      return config;
    } catch (error) {
      console.warn('Failed to fetch site config:', error);
      return null;
    }
  }

  /**
   * Get all content for static generation
   */
  async getAllContent(): Promise<{
    pages: Page[];
    projects: Project[];
    services: Service[];
    blogPosts: BlogPost[];
    testimonials: Testimonial[];
    siteConfig: SiteConfig | null;
  }> {
    const [pages, projects, services, blogPosts, testimonials, siteConfig] =
      await Promise.all([
        this.getPages(),
        this.getProjects(),
        this.getServices(),
        this.getBlogPosts(),
        this.getTestimonials(),
        this.getSiteConfig(),
      ]);

    return {
      pages,
      projects,
      services,
      blogPosts,
      testimonials,
      siteConfig,
    };
  }

  /**
   * Get content paths for static generation
   */
  async getContentPaths(): Promise<{
    projectPaths: string[];
    servicePaths: string[];
    blogPaths: string[];
    pagePaths: string[];
  }> {
    const [projects, services, blogPosts, pages] = await Promise.all([
      this.getProjects(),
      this.getServices(),
      this.getBlogPosts(),
      this.getPages(),
    ]);

    return {
      projectPaths: projects.map((project) => project.id),
      servicePaths: services.map((service) => service.slug),
      blogPaths: blogPosts.map((post) => post.slug),
      pagePaths: pages.map((page) => page.slug),
    };
  }

  /**
   * Check if content has been updated since last build
   */
  async getLastContentUpdate(): Promise<Date | null> {
    try {
      const commits = await this.github.getCommits(1);
      if (commits.length > 0) {
        return new Date(commits[0].author.date);
      }
      return null;
    } catch (error) {
      console.error('Failed to get last content update:', error);
      return null;
    }
  }

  /**
   * Get content statistics for monitoring
   */
  async getContentStats(): Promise<{
    totalPages: number;
    totalProjects: number;
    totalServices: number;
    totalBlogPosts: number;
    totalTestimonials: number;
    lastUpdate: Date | null;
  }> {
    const [pages, projects, services, blogPosts, testimonials, lastUpdate] =
      await Promise.all([
        this.getPages(),
        this.getProjects(),
        this.getServices(),
        this.getBlogPosts(),
        this.getTestimonials(),
        this.getLastContentUpdate(),
      ]);

    return {
      totalPages: pages.length,
      totalProjects: projects.length,
      totalServices: services.length,
      totalBlogPosts: blogPosts.length,
      totalTestimonials: testimonials.length,
      lastUpdate,
    };
  }
}
