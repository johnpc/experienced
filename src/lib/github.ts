import { env } from './env';

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubCommit {
  sha: string;
  url: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  message: string;
  tree: {
    sha: string;
    url: string;
  };
  parents: Array<{
    sha: string;
    url: string;
  }>;
}

export interface GitHubCreateFileResponse {
  content: GitHubFile;
  commit: GitHubCommit;
}

export interface GitHubUpdateFileResponse {
  content: GitHubFile;
  commit: GitHubCommit;
}

export class GitHubAPI {
  private baseUrl = 'https://api.github.com';
  private token: string;
  private repo: string;
  private branch: string;

  constructor() {
    this.token = env.GITHUB_TOKEN;
    this.repo = env.GITHUB_REPO;
    this.branch = env.GITHUB_BRANCH;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/repos/${this.repo}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'NextJS-Marketing-CMS/1.0',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}. ${
          errorData.message || 'Unknown error'
        }`
      );
    }

    return response.json();
  }

  /**
   * Get file content from repository
   */
  async getFile(path: string): Promise<GitHubFile> {
    return this.request<GitHubFile>(`/contents/${path}?ref=${this.branch}`);
  }

  /**
   * Get directory contents from repository
   */
  async getDirectory(path: string = ''): Promise<GitHubFile[]> {
    return this.request<GitHubFile[]>(`/contents/${path}?ref=${this.branch}`);
  }

  /**
   * Create a new file in the repository
   */
  async createFile(
    path: string,
    content: string,
    message: string,
    author?: { name: string; email: string }
  ): Promise<GitHubCreateFileResponse> {
    const encodedContent = Buffer.from(content, 'utf8').toString('base64');

    const body: any = {
      message,
      content: encodedContent,
      branch: this.branch,
    };

    if (author) {
      body.author = author;
      body.committer = author;
    }

    return this.request<GitHubCreateFileResponse>(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Update an existing file in the repository
   */
  async updateFile(
    path: string,
    content: string,
    message: string,
    sha: string,
    author?: { name: string; email: string }
  ): Promise<GitHubUpdateFileResponse> {
    const encodedContent = Buffer.from(content, 'utf8').toString('base64');

    const body: any = {
      message,
      content: encodedContent,
      sha,
      branch: this.branch,
    };

    if (author) {
      body.author = author;
      body.committer = author;
    }

    return this.request<GitHubUpdateFileResponse>(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Delete a file from the repository
   */
  async deleteFile(
    path: string,
    message: string,
    sha: string,
    author?: { name: string; email: string }
  ): Promise<{ commit: GitHubCommit }> {
    const body: any = {
      message,
      sha,
      branch: this.branch,
    };

    if (author) {
      body.author = author;
      body.committer = author;
    }

    return this.request<{ commit: GitHubCommit }>(`/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify(body),
    });
  }

  /**
   * Get repository information
   */
  async getRepository(): Promise<any> {
    return this.request('');
  }

  /**
   * Get recent commits
   */
  async getCommits(limit: number = 10): Promise<GitHubCommit[]> {
    return this.request<GitHubCommit[]>(
      `/commits?per_page=${limit}&sha=${this.branch}`
    );
  }

  /**
   * Get a specific commit
   */
  async getCommit(sha: string): Promise<GitHubCommit> {
    return this.request<GitHubCommit>(`/commits/${sha}`);
  }

  /**
   * Check if file exists
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      await this.getFile(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file content as string (decoded from base64)
   */
  async getFileContent(path: string): Promise<string> {
    const file = await this.getFile(path);
    if (file.content && file.encoding === 'base64') {
      return Buffer.from(file.content, 'base64').toString('utf8');
    }
    throw new Error('File content not available or not base64 encoded');
  }

  /**
   * Create or update file (convenience method)
   */
  async saveFile(
    path: string,
    content: string,
    message: string,
    author?: { name: string; email: string }
  ): Promise<GitHubCreateFileResponse | GitHubUpdateFileResponse> {
    try {
      const existingFile = await this.getFile(path);
      return this.updateFile(path, content, message, existingFile.sha, author);
    } catch (error) {
      // File doesn't exist, create it
      return this.createFile(path, content, message, author);
    }
  }

  /**
   * Validate GitHub token and repository access
   */
  async validateAccess(): Promise<{ valid: boolean; error?: string }> {
    try {
      await this.getRepository();
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get repository statistics
   */
  async getStats(): Promise<{
    totalFiles: number;
    lastCommit: GitHubCommit | null;
    repoInfo: any;
  }> {
    try {
      const [repoInfo, commits] = await Promise.all([
        this.getRepository(),
        this.getCommits(1),
      ]);

      // Count files in content directory
      let totalFiles = 0;
      try {
        const contentDir = await this.getDirectory('content');
        totalFiles = contentDir.filter((item) => item.type === 'file').length;
      } catch (error) {
        // Content directory might not exist yet
      }

      return {
        totalFiles,
        lastCommit: commits[0] || null,
        repoInfo,
      };
    } catch (error) {
      throw new Error(`Failed to get repository stats: ${error}`);
    }
  }
}
