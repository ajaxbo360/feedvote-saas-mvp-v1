# API Keys Implementation Plan

## Overview

This document outlines the implementation plan for adding API key management to the FeedVote platform. API keys are critical for secure widget integration, allowing customers to embed our feedback widget in their applications while maintaining proper authentication and request attribution.

## Database Schema

### Task 1: Create API Keys Database Migration

- **Start**: No API keys table exists
- **End**: `project_api_keys` table is created with appropriate schema and indexes
- **Steps**:

  1. Create migration file `supabase/migrations/[timestamp]_create_project_api_keys_table.sql`
  2. Implement the following schema:

     ```sql
     CREATE TABLE IF NOT EXISTS public.project_api_keys (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
       key_type TEXT NOT NULL CHECK (key_type IN ('public', 'secret', 'mobile')),
       key_value TEXT NOT NULL UNIQUE,
       name TEXT,
       description TEXT,
       is_active BOOLEAN NOT NULL DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       last_used_at TIMESTAMP WITH TIME ZONE,
       expires_at TIMESTAMP WITH TIME ZONE
     );

     -- Create indexes for efficient lookups
     CREATE INDEX idx_api_keys_project_id ON public.project_api_keys(project_id);
     CREATE INDEX idx_api_keys_key_value ON public.project_api_keys(key_value);
     CREATE INDEX idx_api_keys_key_type ON public.project_api_keys(key_type);

     -- Set up Row Level Security (RLS)
     ALTER TABLE public.project_api_keys ENABLE ROW LEVEL SECURITY;

     -- Project owners can view their API keys
     CREATE POLICY "Project owners can view their API keys"
       ON public.project_api_keys FOR SELECT
       USING (
         EXISTS (
           SELECT 1 FROM projects
           WHERE projects.id = project_api_keys.project_id
           AND projects.user_id = auth.uid()
         )
       );

     -- Project owners can create API keys
     CREATE POLICY "Project owners can create API keys"
       ON public.project_api_keys FOR INSERT
       WITH CHECK (
         EXISTS (
           SELECT 1 FROM projects
           WHERE projects.id = project_api_keys.project_id
           AND projects.user_id = auth.uid()
         )
       );

     -- Project owners can update API keys
     CREATE POLICY "Project owners can update API keys"
       ON public.project_api_keys FOR UPDATE
       USING (
         EXISTS (
           SELECT 1 FROM projects
           WHERE projects.id = project_api_keys.project_id
           AND projects.user_id = auth.uid()
         )
       );

     -- Project owners can delete API keys
     CREATE POLICY "Project owners can delete API keys"
       ON public.project_api_keys FOR DELETE
       USING (
         EXISTS (
           SELECT 1 FROM projects
           WHERE projects.id = project_api_keys.project_id
           AND projects.user_id = auth.uid()
         )
       );
     ```

  3. Add DB function to generate secure API keys:

     ```sql
     -- Function to generate random API keys with prefixes based on type
     CREATE OR REPLACE FUNCTION generate_api_key(key_type TEXT)
     RETURNS TEXT AS $$
     DECLARE
       prefix TEXT;
       random_part TEXT;
     BEGIN
       -- Set prefix based on key type
       CASE key_type
         WHEN 'public' THEN prefix := 'pub_';
         WHEN 'secret' THEN prefix := 'sec_';
         WHEN 'mobile' THEN prefix := 'mob_';
         ELSE prefix := 'key_';
       END CASE;

       -- Generate random alphanumeric string (32 chars)
       random_part := encode(gen_random_bytes(24), 'hex');

       RETURN prefix || random_part;
     END;
     $$ LANGUAGE plpgsql SECURITY DEFINER;
     ```

  4. Implement DB trigger to auto-generate key_value if not provided:

     ```sql
     -- Trigger to automatically generate key_value if not provided
     CREATE OR REPLACE FUNCTION set_api_key_value()
     RETURNS TRIGGER AS $$
     BEGIN
       IF NEW.key_value IS NULL THEN
         NEW.key_value := generate_api_key(NEW.key_type);
       END IF;
       RETURN NEW;
     END;
     $$ LANGUAGE plpgsql;

     CREATE TRIGGER project_api_keys_before_insert
       BEFORE INSERT ON public.project_api_keys
       FOR EACH ROW
       EXECUTE FUNCTION set_api_key_value();
     ```

- **Test**: Verify the table and functions exist and RLS policies are correctly applied

### Task 2: Update TypeScript Type Definitions

- **Start**: No type definitions for API keys
- **End**: TypeScript definitions for API keys are added to the project
- **Steps**:

  1. Update `src/types/database.ts` to include API keys:

     ```typescript
     export interface ApiKey {
       id: string;
       project_id: string;
       key_type: 'public' | 'secret' | 'mobile';
       key_value: string;
       name: string | null;
       description: string | null;
       is_active: boolean;
       created_at: string;
       last_used_at: string | null;
       expires_at: string | null;
     }

     // Update Database interface to include project_api_keys
     export interface Database {
       public: {
         Tables: {
           // Existing tables...
           project_api_keys: {
             Row: ApiKey;
             Insert: Omit<ApiKey, 'id' | 'created_at'> & { key_value?: string };
             Update: Partial<Omit<ApiKey, 'id' | 'project_id' | 'key_value'>>;
           };
         };
       };
     }
     ```

  2. Create API-specific types in `src/types/api.ts`:

     ```typescript
     export interface ApiKeyCreateRequest {
       project_id: string;
       key_type: 'public' | 'secret' | 'mobile';
       name?: string;
       description?: string;
       expires_at?: string | null;
     }

     export interface ApiKeyResponse {
       id: string;
       project_id: string;
       key_type: 'public' | 'secret' | 'mobile';
       key_value: string;
       name: string | null;
       description: string | null;
       is_active: boolean;
       created_at: string;
       last_used_at: string | null;
       expires_at: string | null;
     }
     ```

- **Test**: Ensure types are imported correctly without TypeScript errors

## Backend Implementation

### Task 3: Create API Key Management API Routes

- **Start**: No API routes for managing API keys
- **End**: CRUD API routes for API keys
- **Steps**:
  1. Create `src/app/api/projects/[projectId]/api-keys/route.ts` for listing and creating API keys:
     ```typescript
     // GET: Retrieve API keys for a project
     // POST: Create a new API key
     ```
  2. Create `src/app/api/projects/[projectId]/api-keys/[keyId]/route.ts` for managing individual keys:
     ```typescript
     // GET: Retrieve a specific API key
     // PATCH: Update an API key (name, description, is_active)
     // DELETE: Delete an API key
     ```
  3. Implement validation using Zod schemas
  4. Add proper error handling and response formatting
  5. Add validation to ensure the authenticated user owns the project
- **Test**: Use API testing tools (like Postman) to verify the CRUD operations work correctly

### Task 4: Create API Key Authentication Middleware

- **Start**: No middleware for API key validation
- **End**: Middleware that can validate API keys for protected routes
- **Steps**:
  1. Create `src/middleware/api-key-auth.ts`:
     ```typescript
     // Middleware function that validates API key from header
     // Updates last_used_at timestamp on successful validation
     ```
  2. Implement helper functions for key validation
  3. Add logging for failed authentication attempts
- **Test**: Create test routes that use the middleware and verify correct behavior

### Task 5: Update Widget API Routes for API Key Authentication

- **Start**: Widget API routes not using API key authentication
- **End**: Widget API routes protected by API key authentication
- **Steps**:
  1. Update `src/app/api/widget/submit/route.ts` to use API key authentication:
     ```typescript
     // Add authentication middleware
     // Validate API key before processing requests
     ```
  2. Update `src/app/api/widget/config/[slug]/route.ts` to support API key validation
  3. Add fallback to slug-based authentication for backward compatibility
- **Test**: Verify API routes reject requests without valid API keys

## Frontend Implementation

### Task 6: Create API Keys UI Components

- **Start**: No UI for managing API keys
- **End**: Complete UI components for viewing and managing API keys
- **Steps**:
  1. Create `src/components/api-keys/ApiKeysList.tsx` for displaying API keys
  2. Create `src/components/api-keys/CreateApiKeyForm.tsx` for creating new API keys
  3. Create `src/components/api-keys/ApiKeyActions.tsx` for revoke/edit actions
  4. Create `src/components/api-keys/ApiKeyDetails.tsx` for showing key details
  5. Add proper loading states, error handling, and success notifications
- **Test**: Render components in isolation and verify they work correctly

### Task 7: Create Integration Page (Similar to features.vote Example)

- **Start**: No integration page exists
- **End**: Page with integration options for different platforms
- **Steps**:
  1. Create `src/app/app/[projectId]/integrations/page.tsx`
  2. Implement tabs for different integration platforms (JavaScript, React, Flutter, Swift)
  3. Create code snippet generators for each platform
  4. Display public URLs (board, roadmap) and API keys
  5. Add copy-to-clipboard functionality
- **Test**: Verify page renders correctly and code snippets include the correct API keys

### Task 8: Update Widget Configuration Options

- **Start**: Limited widget configuration options
- **End**: Enhanced widget configuration with user parameter options
- **Steps**:
  1. Update widget configuration schema to include user parameter options:
     ```typescript
     // Add fields for userIdEnabled, userEmailEnabled, etc.
     ```
  2. Create UI for toggling which user parameters are enabled
  3. Update code snippet generators to include enabled parameters
- **Test**: Verify configuration changes are saved and reflected in generated code snippets

## Security & Testing

### Task 9: Implement Security Best Practices

- **Start**: Basic security
- **End**: Enhanced security for API keys
- **Steps**:
  1. Implement rate limiting for API key usage
  2. Add IP-based restrictions option for API keys
  3. Ensure API keys are never logged in plaintext
  4. Add automatic key rotation suggestions for old keys
  5. Implement monitoring for suspicious API key usage
- **Test**: Perform security testing to validate protections

### Task 10: Write Comprehensive Tests

- **Start**: No tests for API key functionality
- **End**: Complete test coverage for API key features
- **Steps**:
  1. Write unit tests for API key components
  2. Write integration tests for API routes
  3. Write E2E tests for key management workflow
  4. Add tests for security aspects (rate limiting, permissions)
- **Test**: Run the test suite and verify all tests pass

## Deployment & Documentation

### Task 11: Create User Documentation

- **Start**: No documentation for API keys
- **End**: Complete documentation for API key usage
- **Steps**:
  1. Create documentation page explaining API key types and use cases
  2. Add usage examples for each integration platform
  3. Document security best practices for API key management
  4. Create FAQ section for common issues
- **Test**: Review documentation for accuracy and comprehensiveness

### Task 12: Create Migration Plan

- **Start**: No migration plan for existing projects
- **End**: Plan for migrating existing projects to use API keys
- **Steps**:
  1. Create script to generate API keys for existing projects
  2. Implement a grace period where old authentication methods still work
  3. Add notices to admin UI about upcoming authentication changes
  4. Create email templates for notifying users about new API keys
- **Test**: Verify migration plan works on staging environment

## Timeline and Dependencies

- Database migration must be completed first (Task 1)
- Type definitions should be updated before implementing API routes (Task 2)
- Backend routes should be completed before UI components (Tasks 3-5)
- Security testing should be done continuously, with final validation before deployment
- Documentation should be created in parallel with implementation

## Success Criteria

- API keys can be created, viewed, updated, and deleted through the UI
- Widget integration using API keys works across all supported platforms
- API key authentication properly secures widget API endpoints
- Security testing reveals no critical vulnerabilities
- Migration plan is successfully tested and ready for production
