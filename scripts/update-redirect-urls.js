#!/usr/bin/env node

/**
 * This script updates the redirect URLs in Supabase Auth settings
 * It requires the Supabase API token and project ID to be set as environment variables
 *
 * Usage:
 * SUPABASE_ACCESS_TOKEN=<token> SUPABASE_PROJECT_ID=<project_id> node update-redirect-urls.js
 */

const fetch = require('node-fetch');

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;

const redirectUrls = [
  'http://localhost:3000/**',
  'https://*.vercel.app/**',
  'https://staging.feedvote.com/**',
  'https://feedvote.com/**',
  'https://www.feedvote.com/**',
];

if (!SUPABASE_ACCESS_TOKEN || !SUPABASE_PROJECT_ID) {
  console.error('Error: SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_ID must be set as environment variables');
  process.exit(1);
}

async function updateRedirectUrls() {
  try {
    console.log('Updating redirect URLs for project:', SUPABASE_PROJECT_ID);

    // First, get current config
    const getConfigResponse = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/auth/config`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getConfigResponse.ok) {
      throw new Error(`Failed to get auth config: ${getConfigResponse.statusText}`);
    }

    const currentConfig = await getConfigResponse.json();

    // Update redirect URLs
    const updateResponse = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/auth/config`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...currentConfig,
        redirect_urls: redirectUrls,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update redirect URLs: ${updateResponse.statusText}`);
    }

    console.log('Successfully updated redirect URLs:');
    redirectUrls.forEach((url) => console.log(`- ${url}`));
  } catch (error) {
    console.error('Error updating redirect URLs:', error.message);
    process.exit(1);
  }
}

updateRedirectUrls();
