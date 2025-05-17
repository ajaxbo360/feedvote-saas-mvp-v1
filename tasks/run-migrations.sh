#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Supabase migration process...${NC}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Supabase CLI is not installed. Please install it first.${NC}"
    echo "You can install it with npm: npm install -g supabase"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.." || exit

# Reset and start Supabase
echo -e "${YELLOW}Starting local development Supabase...${NC}"
supabase start

# Run the migrations
echo -e "${YELLOW}Applying migrations...${NC}"
supabase db reset

echo -e "${GREEN}Migrations applied successfully!${NC}"
echo -e "${YELLOW}Supabase Studio URL: http://localhost:54323${NC}"
echo -e "${YELLOW}Database URL: postgresql://postgres:postgres@localhost:54322/postgres${NC}"
echo -e "${YELLOW}You can now run your application with:${NC}"
echo -e "${GREEN}npm run dev${NC}" 