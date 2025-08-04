import { GitHubAPI } from '../github';

// Mock environment variables
jest.mock('../env', () => ({
  env: {
    GITHUB_TOKEN: 'test-token',
    GITHUB_REPO: 'test-user/test-repo',
    GITHUB_BRANCH: 'main',
  },
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('GitHubAPI', () => {
  let github: GitHubAPI;

  beforeEach(() => {
    github = new GitHubAPI();
    mockFetch.mockClear();
  });

  describe('constructor', () => {
    it('should initialize with environment variables', () => {
      expect(github).toBeInstanceOf(GitHubAPI);
    });
  });

  describe('validateAccess', () => {
    it('should return valid true for successful repository access', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: 'test-repo' }),
      });

      const result = await github.validateAccess();

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/test-user/test-repo',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'token test-token',
            Accept: 'application/vnd.github.v3+json',
          }),
        })
      );
    });

    it('should return valid false for failed repository access', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found' }),
      });

      const result = await github.validateAccess();

      expect(result.valid).toBe(false);
      expect(result.error).toContain('GitHub API error: 404 Not Found');
    });
  });

  describe('getFile', () => {
    it('should fetch file content successfully', async () => {
      const mockFile = {
        name: 'test.md',
        path: 'content/test.md',
        sha: 'abc123',
        size: 100,
        content: 'dGVzdCBjb250ZW50', // base64 encoded "test content"
        encoding: 'base64',
        type: 'file',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      });

      const result = await github.getFile('content/test.md');

      expect(result).toEqual(mockFile);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/test-user/test-repo/contents/content/test.md?ref=main',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'token test-token',
          }),
        })
      );
    });

    it('should throw error for non-existent file', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(github.getFile('non-existent.md')).rejects.toThrow(
        'GitHub API error: 404 Not Found'
      );
    });
  });

  describe('getFileContent', () => {
    it('should decode base64 content correctly', async () => {
      const mockFile = {
        name: 'test.md',
        path: 'content/test.md',
        content: Buffer.from('test content', 'utf8').toString('base64'),
        encoding: 'base64',
        type: 'file' as const,
        sha: 'abc123',
        size: 12,
        url: 'https://api.github.com/repos/test-user/test-repo/contents/content/test.md',
        html_url:
          'https://github.com/test-user/test-repo/blob/main/content/test.md',
        git_url:
          'https://api.github.com/repos/test-user/test-repo/git/blobs/abc123',
        download_url:
          'https://raw.githubusercontent.com/test-user/test-repo/main/content/test.md',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      });

      const result = await github.getFileContent('content/test.md');

      expect(result).toBe('test content');
    });
  });

  describe('createFile', () => {
    it('should create file successfully', async () => {
      const mockResponse = {
        content: {
          name: 'new-file.md',
          path: 'content/new-file.md',
          sha: 'def456',
          size: 15,
          type: 'file' as const,
          url: 'https://api.github.com/repos/test-user/test-repo/contents/content/new-file.md',
          html_url:
            'https://github.com/test-user/test-repo/blob/main/content/new-file.md',
          git_url:
            'https://api.github.com/repos/test-user/test-repo/git/blobs/def456',
          download_url:
            'https://raw.githubusercontent.com/test-user/test-repo/main/content/new-file.md',
        },
        commit: {
          sha: 'commit123',
          url: 'https://api.github.com/repos/test-user/test-repo/git/commits/commit123',
          author: {
            name: 'Test User',
            email: 'test@example.com',
            date: '2024-01-01T00:00:00Z',
          },
          committer: {
            name: 'Test User',
            email: 'test@example.com',
            date: '2024-01-01T00:00:00Z',
          },
          message: 'Create new file',
          tree: {
            sha: 'tree123',
            url: 'https://api.github.com/repos/test-user/test-repo/git/trees/tree123',
          },
          parents: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await github.createFile(
        'content/new-file.md',
        'new file content',
        'Create new file',
        { name: 'Test User', email: 'test@example.com' }
      );

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/test-user/test-repo/contents/content/new-file.md',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            message: 'Create new file',
            content: Buffer.from('new file content', 'utf8').toString('base64'),
            branch: 'main',
            author: { name: 'Test User', email: 'test@example.com' },
            committer: { name: 'Test User', email: 'test@example.com' },
          }),
        })
      );
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: 'test.md' }),
      });

      const result = await github.fileExists('content/test.md');

      expect(result).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not Found' }),
      });

      const result = await github.fileExists('content/non-existent.md');

      expect(result).toBe(false);
    });
  });

  describe('saveFile', () => {
    it('should update existing file', async () => {
      // Mock file exists check
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'existing.md',
          sha: 'existing123',
          content: 'b2xkIGNvbnRlbnQ=', // base64 "old content"
          encoding: 'base64',
        }),
      });

      // Mock update file
      const mockUpdateResponse = {
        content: { name: 'existing.md', sha: 'new123' },
        commit: { sha: 'commit456', message: 'Update file' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdateResponse,
      });

      const result = await github.saveFile(
        'content/existing.md',
        'updated content',
        'Update file'
      );

      expect(result).toEqual(mockUpdateResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2); // getFile + updateFile
    });

    it('should create new file if it does not exist', async () => {
      // Mock file does not exist
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not Found' }),
      });

      // Mock create file
      const mockCreateResponse = {
        content: { name: 'new.md', sha: 'new456' },
        commit: { sha: 'commit789', message: 'Create file' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreateResponse,
      });

      const result = await github.saveFile(
        'content/new.md',
        'new content',
        'Create file'
      );

      expect(result).toEqual(mockCreateResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2); // getFile (fails) + createFile
    });
  });
});
