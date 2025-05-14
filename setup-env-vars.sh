#!/bin/bash

# This script sets up environment variables for Supabase with IPv4 support in Vercel
# Run this script after cloning the repository

echo "Setting up Supabase environment variables with IPv4 support..."

# Login to Vercel if not already logged in
if ! npx vercel whoami &>/dev/null; then
  echo "Please log in to Vercel:"
  npx vercel login
fi

# Link to Vercel project
if [ ! -f .vercel/project.json ]; then
  echo "Linking to Vercel project:"
  npx vercel link
fi

# Pull existing environment variables
echo "Pulling existing environment variables from Vercel..."
npx vercel env pull .env.local

# Check if Supabase URL is truncated
if grep -q "NEXT_PUBLIC_SUPABASE_UR" .env.local && ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
  echo "Warning: Your NEXT_PUBLIC_SUPABASE_URL variable appears to be truncated"
  echo "Please enter the full Supabase URL:"
  read supabase_url
  echo "NEXT_PUBLIC_SUPABASE_URL=\"$supabase_url\"" >> .env.local
fi

# Add Supavisor URLs for IPv4 support
if ! grep -q "POSTGRES_URL" .env.local; then
  echo "Adding Supavisor URLs for IPv4 support..."
  
  # Extract Supabase URL
  SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2 | tr -d '"')
  
  if [ -n "$SUPABASE_URL" ]; then
    # Convert to Supavisor URL format
    PROJECT_ID=$(echo $SUPABASE_URL | grep -o "[a-z0-9\-]*\.supabase\.co" | cut -d '.' -f1)
    
    if [ -n "$PROJECT_ID" ]; then
      echo "Adding Supavisor IPv4 URLs for project: $PROJECT_ID"
      
      # POSTGRES_URL - Supavisor URL
      echo "POSTGRES_URL=\"postgres://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-${AWS_REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true\"" >> .env.local
      
      # POSTGRES_PRISMA_URL - Supavisor URL
      echo "POSTGRES_PRISMA_URL=\"postgres://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-${AWS_REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1\"" >> .env.local
      
      # POSTGRES_URL_NON_POOLING - Supavisor URL on session mode
      echo "POSTGRES_URL_NON_POOLING=\"postgres://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-${AWS_REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1\"" >> .env.local
      
      echo "IPv4 environment variables added to .env.local"
      echo "To use these variables in Vercel, you'll need to add them to your project settings"
    else
      echo "Could not extract project ID from Supabase URL"
    fi
  else
    echo "Supabase URL not found in .env.local"
  fi
fi

# Ensure auth redirect URLs are properly set
if ! grep -q "SUPABASE_AUTH_REDIRECT_URI" .env.local; then
  echo "Adding auth redirect URIs for local development..."
  echo "NEXT_PUBLIC_AUTH_REDIRECT_URI=\"http://localhost:3000/auth/callback\"" >> .env.local
fi

echo "Environment variables have been set up successfully!"
echo "Remember to add these variables to your Vercel project settings for both production and preview environments"
echo "You may need to purchase the IPv4 addon from Supabase if you continue to have database connection issues" 