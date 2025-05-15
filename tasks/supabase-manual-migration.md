# Manual Supabase Migration Process

This document outlines the process for manually managing Supabase database migrations, which was chosen over CI/CD-based migrations due to IPv6 connectivity issues with GitHub Actions.

## Local Development

1. Make schema changes in your local Supabase instance
2. Generate a migration:
   ```bash
   supabase db diff -f <migration_name>
   ```
3. Test the migration locally:
   ```bash
   supabase db reset
   ```

## Deploying to Staging

When ready to deploy changes to the staging environment:

1. Link to your staging project:
   ```bash
   supabase link --project-ref <STAGING_PROJECT_ID>
   ```
2. Push the migrations:
   ```bash
   supabase db push
   ```

## Deploying to Production

When ready to deploy changes to production:

1. Link to your production project:
   ```bash
   supabase link --project-ref <PRODUCTION_PROJECT_ID>
   ```
2. Create a backup before migration:
   ```bash
   supabase db dump -f backup-production-$(date +%Y%m%d%H%M%S).sql
   ```
3. Push the migrations:
   ```bash
   supabase db push
   ```

## Important Notes

- Always backup production database before applying migrations
- Test migrations thoroughly in staging before applying to production
- Consider purchasing the IPv4 add-on from Supabase if you want to re-enable automated migrations in GitHub Actions

## Why We Use Manual Migrations

GitHub Actions runners connect to Supabase using IPv6, but Supabase requires IPv4 connectivity for direct database operations. Rather than purchasing the IPv4 add-on, we've opted to manage migrations manually for now.
