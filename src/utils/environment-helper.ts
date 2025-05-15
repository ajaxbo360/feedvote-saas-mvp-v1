/**
 * Utility functions for environment-specific configuration
 */

/**
 * Determines the correct Supabase URL based on the current environment
 * This works around issues with environment variables not being correctly set
 */
export function getEnvironmentSpecificSupabaseUrl(): string {
  // Client-side environment detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    };

    console.log('=== ENVIRONMENT DEBUG ===');
    console.log('Hostname:', hostname);
    console.log('Environment Variables:', JSON.stringify(envVars));
    console.log('URL Origin:', window.location.origin);
    console.log('Full URL:', window.location.href);
    console.log('========================');

    // Staging environment
    if (hostname === 'staging.feedvote.com' || hostname.includes('vercel.app')) {
      console.log('Environment helper - Using staging Supabase URL (cnftvsflgsjvobubzxcj)');
      return 'https://cnftvsflgsjvobubzxcj.supabase.co';
    }

    // Production environment
    if (hostname === 'feedvote.com' || hostname === 'www.feedvote.com') {
      console.log('Environment helper - Using production Supabase URL (xtgbskvaurrczvbzticy)');
      return 'https://xtgbskvaurrczvbzticy.supabase.co';
    }

    // Local development - use staging by default to avoid messing with prod data
    console.log('Environment helper - Using default staging Supabase URL for local development');
    return 'https://cnftvsflgsjvobubzxcj.supabase.co';
  }

  // Server-side - use environment variables
  const envVars = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  console.log('=== SERVER ENVIRONMENT DEBUG ===');
  console.log('Environment Variables:', JSON.stringify(envVars));
  console.log('================================');

  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

/**
 * Gets the site URL based on the current environment
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('getSiteUrl - hostname:', hostname);

    // Staging environment
    if (hostname === 'staging.feedvote.com' || hostname.includes('vercel.app')) {
      console.log('getSiteUrl - returning staging URL');
      return 'https://staging.feedvote.com';
    }

    // Production environment
    if (hostname === 'feedvote.com' || hostname === 'www.feedvote.com') {
      console.log('getSiteUrl - returning production URL');
      return 'https://feedvote.com';
    }

    // Local development
    console.log('getSiteUrl - returning origin for local:', window.location.origin);
    return window.location.origin;
  }

  // Server-side
  console.log('getSiteUrl (server) - returning:', process.env.NEXT_PUBLIC_SITE_URL || 'https://feedvote.com');
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://feedvote.com';
}
