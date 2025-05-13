#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "⛔️ Docker is not running. Please start Docker Desktop first."
  exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "⛔️ Supabase CLI is not installed. Please install it first:"
  echo "brew install supabase/tap/supabase"
  exit 1
fi

echo "🚀 Setting up FeedVote local development environment..."

# Start Supabase locally
echo "🗄️  Starting local Supabase instance..."
supabase start

# Get local Supabase credentials
SUPABASE_URL="http://localhost:54323"
SUPABASE_ANON_KEY=$(supabase status --local | grep "anon key:" | awk '{print $3}')
SUPABASE_SERVICE_KEY=$(supabase status --local | grep "service_role key:" | awk '{print $3}')

# Create .env.local file
echo "📝 Creating .env.local file..."
cat > .env.local << EOL
# Local Supabase connection - DO NOT COMMIT THIS FILE
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
NEXT_PUBLIC_ENVIRONMENT=local

# Add your local Google OAuth client ID here
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=
EOL

echo "✅ Local environment setup complete!"
echo "⚠️  IMPORTANT: Add your Google OAuth client ID to .env.local"
echo "🔗 Your local Supabase dashboard: http://localhost:54323/project/default/dashboard"
echo "🌐 Run 'npm run dev' to start your Next.js app" 