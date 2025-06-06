# Applying the API Keys Migration

Since we want to ensure proper deployment of our API keys feature, here are the steps to apply the migration manually or verify it's been applied correctly:

## Option 1: Apply Through Supabase Dashboard

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to the SQL Editor in the left sidebar
4. Create a new SQL query
5. Copy and paste the contents of `supabase/migrations/20250522183730_create_project_api_keys.sql`
6. Run the query

## Option 2: Apply Using Supabase CLI

If you have the Supabase CLI installed, you can apply the migration using:

```bash
supabase migration up
```

## Verifying the Migration

After applying the migration, verify that:

1. The `project_api_keys` table exists
2. The table has the correct structure
3. Row Level Security (RLS) policies are correctly set up
4. Existing projects have default API keys created

You can run this query to check:

```sql
-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'project_api_keys'
);

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'project_api_keys';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'project_api_keys';

-- Check API keys for existing projects
SELECT p.id as project_id, p.name as project_name,
       count(k.*) as key_count
FROM projects p
LEFT JOIN project_api_keys k ON p.id = k.project_id
GROUP BY p.id, p.name;
```

## Next Steps

After successfully applying the migration:

1. Update your TypeScript types (already done in `src/types/database.ts`)
2. Implement the API routes for API key management
3. Build the UI components for API key management
4. Update the widget code to use API keys for authentication
