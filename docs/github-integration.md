# GitHub Integration

This document describes the GitHub integration features of the Next.js Marketing CMS.

## Overview

The CMS integrates with GitHub to provide:

- Secure token handling for Decap CMS
- Content management through Git commits
- Webhook support for automatic rebuilds
- Repository status monitoring

## API Endpoints

### Authentication

#### `GET /api/cms-auth`

Returns GitHub token for Decap CMS authentication.

- **Authentication**: Admin session required
- **Response**: `{ token, repo, branch }`
- **Validation**: Validates GitHub token before returning

#### `POST /api/cms-auth`

Proxies GitHub API requests from Decap CMS.

- **Authentication**: Admin session required
- **Security**: Only allows GitHub API URLs
- **Headers**: Automatically adds authentication

### Repository Management

#### `GET /api/github/status`

Returns repository connection status and statistics.

- **Authentication**: Admin session required
- **Response**: Connection status, repository info, statistics

#### `GET /api/github/content?path=<path>`

Fetches content from the repository.

- **Authentication**: Admin session required
- **Parameters**: `path` - Repository path to fetch
- **Response**: Directory contents or file content

#### `POST /api/github/content`

Creates or updates content in the repository.

- **Authentication**: Admin session required
- **Body**: `{ path, content, message, author? }`
- **Response**: Commit information and file details

#### `DELETE /api/github/content`

Deletes content from the repository.

- **Authentication**: Admin session required
- **Body**: `{ path, message, sha, author? }`
- **Response**: Commit information

### Webhooks

#### `POST /api/github/webhook`

Handles GitHub webhook events for automatic rebuilds.

- **Authentication**: Webhook signature verification
- **Events**: push, pull_request, repository
- **Triggers**: Automatic rebuilds on content changes

## Security Features

### Token Protection

- GitHub tokens are never exposed to client-side code
- All API requests are proxied through authenticated endpoints
- Token validation before use

### Request Validation

- Only GitHub API URLs are allowed in proxy requests
- Webhook signature verification (when configured)
- Admin session validation for all endpoints

### Error Handling

- Comprehensive error logging
- Graceful fallbacks for API failures
- Clear error messages for debugging

## Configuration

### Environment Variables

```bash
# Required
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_REPO=username/repository-name
GITHUB_BRANCH=main

# Optional
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```

### GitHub Token Permissions

The GitHub personal access token needs the following permissions:

- `repo` - Full repository access
- `contents:write` - Create, read, update, and delete repository contents
- `metadata:read` - Read repository metadata

### Webhook Setup

1. Go to your GitHub repository settings
2. Navigate to "Webhooks"
3. Add webhook with URL: `https://your-domain.com/api/github/webhook`
4. Select events: `push`, `pull_request`
5. Set content type to `application/json`
6. Add webhook secret (optional but recommended)

## Usage Examples

### Check Repository Status

```javascript
const response = await fetch('/api/github/status');
const status = await response.json();
console.log('Connected:', status.connected);
```

### Fetch Content

```javascript
const response = await fetch('/api/github/content?path=content/pages');
const content = await response.json();
console.log('Files:', content.contents);
```

### Save Content

```javascript
const response = await fetch('/api/github/content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: 'content/pages/new-page.md',
    content: '# New Page\n\nContent here...',
    message: 'Add new page',
    author: { name: 'CMS User', email: 'user@example.com' },
  }),
});
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:

- `401` - Unauthorized (invalid session)
- `403` - Forbidden (invalid GitHub token)
- `404` - Not found (file/path doesn't exist)
- `500` - Internal server error

## Monitoring

The integration includes comprehensive logging for:

- GitHub API requests and responses
- Webhook events and processing
- Token validation failures
- Content operations

Check server logs for debugging information.
