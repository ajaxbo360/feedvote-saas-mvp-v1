# Deployment Guide for Feedvote

This guide provides instructions for setting up and troubleshooting deployments of the Feedvote application to Vercel with Supabase integration.

## Prerequisites

- GitHub account with access to the repository
- Vercel account linked to GitHub
- Supabase account with projects for staging and production
- Proper access rights to configure environment variables and secrets

## Environment Setup

### Supabase Integration

1. Create Supabase projects for both staging and production environments
2. In the Vercel dashboard, install the Supabase integration
3. Link your Vercel project to both Supabase projects (production and staging)

### Environment Variables

The following environment variables must be configured in Vercel for both production and staging environments:

#### Required Supabase Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

#### IPv4 Support (Required since Jan 29, 2024)

- `POSTGRES_URL` - Supavisor URL for IPv4 support
- `POSTGRES_PRISMA_URL` - Supavisor URL for Prisma
- `POSTGRES_URL_NON_POOLING` - Supavisor URL on session mode

#### Authentication Variables (for Google OAuth)

- `SUPABASE_AUTH_GOOGLE_CLIENT_ID`
- `SUPABASE_AUTH_GOOGLE_SECRET`
- `SUPABASE_AUTH_GOOGLE_REDIRECT_URI`

### GitHub Secrets for CI/CD

Set up the following secrets in your GitHub repository:

- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `SUPABASE_ACCESS_TOKEN` - Your Supabase access token
- `STAGING_PROJECT_ID` - Your Supabase staging project ID
- `STAGING_DB_PASSWORD` - Your Supabase staging database password
- `PRODUCTION_PROJECT_ID` - Your Supabase production project ID
- `PRODUCTION_DB_PASSWORD` - Your Supabase production database password
- `STAGING_SUPABASE_URL` - Your Supabase staging URL
- `STAGING_SUPABASE_ANON_KEY` - Your Supabase staging anon key
- `PRODUCTION_SUPABASE_URL` - Your Supabase production URL
- `PRODUCTION_SUPABASE_ANON_KEY` - Your Supabase production anon key

## Deployment Process

### Local Development

1. Clone the repository
2. Run `./setup-env-vars.sh` to set up local environment variables
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

### Staging Deployment

1. Push to the `staging` branch
2. The GitHub workflow will automatically deploy to Vercel staging
3. The deployment will be available at `staging.feedvote.com`

### Production Deployment

1. Push to the `main` branch
2. The GitHub workflow will automatically deploy to Vercel production
3. The deployment will be available at `feedvote.com` and `www.feedvote.com`

## Troubleshooting

### Authentication Error: Supabase not configured

This error indicates missing or incorrect Supabase environment variables.

1. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are properly set in Vercel
2. Make sure the variables are not truncated (common issue with the URL missing the "L" at the end)
3. Pull environment variables locally using `npx vercel env pull` to verify them

### Database Connection Issues (IPv6 Compatibility)

As of January 29, 2024, Supabase has migrated to IPv6 while Vercel only supports IPv4.

1. Set up Supavisor URLs in your Vercel environment variables (see above)
2. Consider purchasing the IPv4 addon from Supabase for direct database access
3. Redeploy your application after updating environment variables

### Branch Deployment Configuration

To prevent production deployments when pushing to staging:

1. Make sure the `ignoreCommand` in `vercel.json` correctly checks for your branch structure
2. Configure proper branch protection rules in GitHub
3. Set up required environment variables for each environment in Vercel

### Redirect URL Issues

For OAuth to work properly, make sure:

1. All possible redirect URLs are added to Supabase Auth settings:
   - `http://localhost:3000/**` (for local development)
   - `https://*.vercel.app/**` (for Vercel preview deployments)
   - `https://staging.feedvote.com/**` (for staging)
   - `https://feedvote.com/**` (for production)
   - `https://www.feedvote.com/**` (for production with www)

## Additional Resources

- [Supabase IPv4 Migration Guide](https://supabase.com/partners/integrations/vercel)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
