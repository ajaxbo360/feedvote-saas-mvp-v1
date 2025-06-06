#!/bin/bash

# Apply onboarding migrations script
# This script will apply all the onboarding migrations to your Supabase project

echo "Applying onboarding migrations to Supabase..."

# Make sure you're logged in to Supabase CLI
supabase status >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Error: Not connected to Supabase. Please run 'supabase login' first."
  exit 1
fi

# Check if project ref is provided
if [ -z "$1" ]; then
  # Try to get project ref from supabase config
  PROJECT_REF=$(supabase projects list --json | jq -r '.[0].ref')
  
  if [ -z "$PROJECT_REF" ] || [ "$PROJECT_REF" == "null" ]; then
    echo "Error: No project reference found. Please specify a project reference:"
    echo "Usage: $0 <project-ref>"
    echo "You can find your project ref in your Supabase dashboard URL: https://supabase.com/dashboard/project/<project-ref>"
    exit 1
  fi
else
  PROJECT_REF=$1
fi

echo "Using Supabase project ref: $PROJECT_REF"

# Run migrations from the migration files
echo "Running onboarding schema migrations..."

# Apply the first migration - add onboarding columns to profiles
echo "Step 1: Adding onboarding columns to profiles table..."
supabase db push --db-url "db.${PROJECT_REF}.supabase.co" migrations/20240501000000_add_onboarding_columns.sql

# Apply the second migration - create onboarding events table
echo "Step 2: Creating onboarding events table..."
supabase db push --db-url "db.${PROJECT_REF}.supabase.co" migrations/20240501000001_create_onboarding_events_table.sql

# Apply the third migration - create onboarding functions
echo "Step 3: Creating onboarding functions..."
supabase db push --db-url "db.${PROJECT_REF}.supabase.co" migrations/20240501000002_create_onboarding_functions.sql

echo "All onboarding migrations have been applied successfully!"
echo "Type definitions and component implementation will be needed next."
echo "See the tasks files for details on the implementation steps." 