#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Pushing migrations to Supabase staging...${NC}"

# Link to the project
echo -e "${YELLOW}Linking to project...${NC}"
supabase link --project-ref cnftvsflgsjvobubzxcj

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to link to project.${NC}"
  exit 1
fi

# Push the migrations
echo -e "${YELLOW}Pushing migrations...${NC}"
supabase db push --include-all

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to push migrations.${NC}"
  exit 1
fi

echo -e "${GREEN}Migrations pushed successfully!${NC}" 