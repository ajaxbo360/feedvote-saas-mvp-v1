# API Keys Implementation Documentation

## Overview

This document outlines the implementation of API keys for the FeedVote platform. API keys enable secure widget integration, allowing customers to embed the feedback widget in their applications while maintaining proper authentication and request attribution.

## Database Schema

The `project_api_keys` table stores all API keys with the following structure:

| Column       | Type      | Description                                   |
| ------------ | --------- | --------------------------------------------- |
| id           | UUID      | Primary key                                   |
| project_id   | UUID      | Foreign key to projects table                 |
| key_type     | TEXT      | Type of key ('public', 'secret', 'mobile')    |
| key_value    | TEXT      | The actual API key string                     |
| name         | TEXT      | User-defined name for the key                 |
| description  | TEXT      | User-defined description                      |
| is_active    | BOOLEAN   | Whether the key is active                     |
| created_at   | TIMESTAMP | When the key was created                      |
| last_used_at | TIMESTAMP | When the key was last used                    |
| expires_at   | TIMESTAMP | When the key expires (null for no expiration) |

### Database Functions

1. **generate_api_key(key_type TEXT)**: Generates a random API key with a prefix based on the key type.
2. **set_api_key_value()**: Trigger function to automatically generate key_value if not provided.
3. **create_default_api_keys(project_id UUID)**: Creates default API keys for a project (public, secret, mobile).
4. **create_default_api_keys_trigger()**: Trigger function to automatically create default API keys for new projects.

### Row Level Security (RLS)

The table uses Row Level Security to ensure users can only manage their own API keys:

- **SELECT**: Project owners can view their API keys
- **INSERT**: Project owners can create API keys for their projects
- **UPDATE**: Project owners can update their API keys
- **DELETE**: Project owners can delete their API keys

## API Endpoints

### List API Keys

```
GET /api/api-keys?project_id={projectId}
```

**Description**: Gets all API keys for a specific project.  
**Authentication**: Required  
**Authorization**: User must own the project  
**Response**: Array of API keys

### Create API Key

```
POST /api/api-keys
```

**Description**: Creates a new API key for a project.  
**Authentication**: Required  
**Authorization**: User must own the project  
**CSRF Protection**: Required  
**Request Body**:

```json
{
  "project_id": "uuid",
  "key_type": "public|secret|mobile",
  "name": "Optional name",
  "description": "Optional description",
  "expires_at": "Optional expiration date"
}
```

**Response**: The created API key

### Get API Key

```
GET /api/api-keys/{id}
```

**Description**: Gets a specific API key.  
**Authentication**: Required  
**Authorization**: User must own the project associated with the key  
**Response**: API key details

### Update API Key

```
PATCH /api/api-keys/{id}
```

**Description**: Updates a specific API key.  
**Authentication**: Required  
**Authorization**: User must own the project associated with the key  
**CSRF Protection**: Required  
**Request Body**:

```json
{
  "name": "Optional updated name",
  "description": "Optional updated description",
  "is_active": true|false,
  "expires_at": "Optional updated expiration date"
}
```

**Response**: The updated API key

### Delete API Key

```
DELETE /api/api-keys/{id}
```

**Description**: Deletes a specific API key.  
**Authentication**: Required  
**Authorization**: User must own the project associated with the key  
**CSRF Protection**: Required  
**Response**: Success status

### Regenerate API Key

```
POST /api/api-keys/{id}/regenerate
```

**Description**: Regenerates the value of an existing API key.  
**Authentication**: Required  
**Authorization**: User must own the project associated with the key  
**CSRF Protection**: Required  
**Response**: The updated API key with new key_value

### Validate API Key

```
POST /api/api-keys/validate
```

**Description**: Validates an API key provided in the request headers.  
**Authentication**: Not required (API key is used for authentication)  
**Headers**:

- `Authorization: Bearer {api_key}` or
- `X-API-Key: {api_key}`  
  **Response**: Validation status and project info if valid

## Utility Functions

### API Key Utilities (`src/utils/api-key-utils.ts`)

1. **validateApiKey(keyValue: string)**: Validates an API key by checking if it exists and is active.
2. **extractApiKeyFromHeaders(headers: Headers)**: Extracts an API key from request headers.
3. **generateApiKey(keyType: ApiKeyType)**: Client-side function to generate a new API key.
4. **hasApiKeyManagementPermission(projectId: string)**: Checks if a user has permission to manage API keys for a project.
5. **generateCodeSnippets(projectId: string, apiKey: string)**: Generates code snippets for different platforms.

## API Key Types (`src/types/api-keys.ts`)

1. **ApiKeyType**: Type definition for API key types ('public', 'secret', 'mobile').
2. **ApiKey**: Interface representing an API key from the database.
3. **ApiKeyCreateRequest**: Interface for creating a new API key.
4. **ApiKeyUpdateRequest**: Interface for updating an existing API key.

## Integration with Widget

The API key system integrates with the widget as follows:

1. Widget script includes the API key in its configuration.
2. Widget makes requests to the server with the API key in the headers.
3. Server validates the API key using the `/api/api-keys/validate` endpoint.
4. If valid, the server processes the widget request and associates it with the correct project.

## Security Considerations

1. **API Key Prefixes**: Keys have different prefixes (pub*, sec*, mob\_) to easily identify their type.
2. **Key Value Protection**: Secret and mobile key values should be kept secure and not exposed in client-side code.
3. **RLS Policies**: Ensure users can only access their own API keys.
4. **CSRF Protection**: All state-changing operations require CSRF token validation.
5. **Key Expiration**: API keys can be set to expire automatically.
6. **Key Deactivation**: Keys can be deactivated without deletion to prevent immediate disruption.

## Next Steps

1. Implement UI components for API key management
2. Update widget code to use API keys for authentication
3. Add API key usage analytics and monitoring
