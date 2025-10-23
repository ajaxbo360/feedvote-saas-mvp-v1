# FeedVote CI/CD and Environment Setup

This document explains how the FeedVote application is configured with multiple environments and the CI/CD pipeline.

## Environment Structure

FeedVote uses a three-environment setup with Supabase:

1. **Local Development**

   - Runs using Supabase CLI locally (`http://localhost:54323`)
   - Uses local Google OAuth credentials
   - For individual developer testing before pushing changes

2. **Staging Environment**

   - Supabase project: `feedvote-staging`
   - URL: `https://staging.feedvote.com`
   - Deployed from the `staging` branch
   - For team testing before production deployment

3. **Production Environment**
   - Supabase project: `feedvote`
   - URL: `https://feedvote.com`
   - Deployed from the `main` branch
   - Live customer-facing environment

## Setting Up Local Development

1. Install the Supabase CLI:

   ```bash
   brew install supabase/tap/supabase
   ```

2. Start Docker Desktop

3. Initialize and start Supabase (already initialized in this project):

   ```bash
   supabase start
   ```

4. Configure local Google OAuth:
   - Create a Google OAuth client in the Google Cloud Console
   - Set Authorized redirect URIs to include `http://localhost:54323/auth/v1/callback`
   - Add the client ID to your local environment variables

## CI/CD Pipeline

The GitHub Actions workflow automatically handles deployments to staging and production:

- Pushing to `staging` branch deploys to staging environment
- Pushing to `main` branch deploys to production environment

The workflow:

1. Links to the appropriate Supabase project
2. Creates a database backup for safety
3. Checks for schema drift before deploying
4. Applies migrations
5. Updates configuration for the target environment

## Google OAuth Configuration

Each environment uses a separate Google OAuth client:

1. **Local**:

   - Redirect URI: `http://localhost:54323/auth/v1/callback`
   - Configure in Google Cloud Console
   - Store credentials in local `.env.local` file

2. **Staging**:

   - Redirect URI: `https://staging.feedvote.com/auth/callback`
   - Credentials stored in GitHub secrets

3. **Production**:
   - Redirect URI: `https://feedvote.com/auth/callback`
   - Credentials stored in GitHub secrets

## GitHub Secrets

The following secrets need to be configured in GitHub:

- `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
- `PRODUCTION_PROJECT_ID`: ID of the production Supabase project
- `PRODUCTION_DB_PASSWORD`: Database password for production
- `STAGING_PROJECT_ID`: ID of the staging Supabase project
- `STAGING_DB_PASSWORD`: Database password for staging
- `PROD_GOOGLE_CLIENT_ID`: Production Google OAuth client ID
- `PROD_GOOGLE_SECRET`: Production Google OAuth client secret
- `STAGING_GOOGLE_CLIENT_ID`: Staging Google OAuth client ID
- `STAGING_GOOGLE_SECRET`: Staging Google OAuth client secret
