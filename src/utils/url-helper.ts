/**
 * This file contains utility functions for handling URLs in the application
 * Particularly for handling redirect URLs in authentication
 */

/**
 * Gets the correct base URL for the current environment
 * This handles both server-side and client-side environments
 */
export function getBaseUrl(): string {
  // Client-side
  if (typeof window !== 'undefined') {
    // Check if we're in a Vercel preview deployment
    const isVercelPreview = window.location.hostname.includes('vercel.app');

    // If we're in the staging environment, make sure to use the staging URL
    if (isVercelPreview || window.location.hostname === 'staging.feedvote.com') {
      return window.location.origin;
    }

    // If we're in production
    if (window.location.hostname === 'feedvote.com' || window.location.hostname === 'www.feedvote.com') {
      return 'https://feedvote.com';
    }

    // Default to current origin (works for localhost too)
    return window.location.origin;
  }

  // Server-side
  // First try environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to environment-specific defaults
  if (process.env.NODE_ENV === 'production') {
    return process.env.VERCEL_ENV === 'preview' ? 'https://staging.feedvote.com' : 'https://feedvote.com';
  }

  // Default to localhost for SSR in development
  return 'http://localhost:3000';
}

/**
 * Gets the redirect URL for authentication callbacks
 * Ensures the correct URL is used for the current environment
 */
export function getAuthRedirectUrl(path = '/auth/callback'): string {
  const baseUrl = getBaseUrl();
  // Make sure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
