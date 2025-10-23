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

    // Staging environment
    if (hostname === 'staging.feedvote.com' || hostname.includes('vercel.app')) {
      return 'https://rgymwojpogscitqgfkgo.supabase.co';
    }

    // Production environment
    if (hostname === 'feedvote.com' || hostname === 'www.feedvote.com') {
      return 'https://rgymwojpogscitqgfkgo.supabase.co';
    }

    // Local development - use staging by default to avoid messing with prod data
    return 'https://rgymwojpogscitqgfkgo.supabase.co';
  }

  // Server-side - use environment variables
  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

/**
 * Gets the site URL based on the current environment
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Staging environment
    if (hostname === 'staging.feedvote.com' || hostname.includes('vercel.app')) {
      return 'https://staging.feedvote.com';
    }

    // Production environment
    if (hostname === 'feedvote.com' || hostname === 'www.feedvote.com') {
      return 'https://feedvote.com';
    }

    // Local development
    return window.location.origin;
  }

  // Server-side
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://feedvote.com';
}
