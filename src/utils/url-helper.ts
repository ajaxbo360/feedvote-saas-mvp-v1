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
    // Add debug logging
    console.log('getBaseUrl - hostname:', window.location.hostname);
    console.log('getBaseUrl - is Vercel preview?', window.location.hostname.includes('vercel.app'));

    // Check if we're in a Vercel preview deployment
    const isVercelPreview = window.location.hostname.includes('vercel.app');

    // If we're in the staging environment, make sure to use the staging URL
    if (isVercelPreview || window.location.hostname === 'staging.feedvote.com') {
      console.log('getBaseUrl - using staging URL:', window.location.origin);
      return window.location.origin;
    }

    // If we're in production
    if (window.location.hostname === 'feedvote.com' || window.location.hostname === 'www.feedvote.com') {
      console.log('getBaseUrl - using production URL: https://feedvote.com');
      return 'https://feedvote.com';
    }

    // Default to current origin (works for localhost too)
    console.log('getBaseUrl - using default origin:', window.location.origin);
    return window.location.origin;
  }

  // Server-side
  // First try environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    console.log('getBaseUrl (server) - using NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to environment-specific defaults
  if (process.env.NODE_ENV === 'production') {
    const url = process.env.VERCEL_ENV === 'preview' ? 'https://staging.feedvote.com' : 'https://feedvote.com';
    console.log('getBaseUrl (server) - using production fallback:', url);
    return url;
  }

  // Default to localhost for SSR in development
  console.log('getBaseUrl (server) - using development fallback: http://localhost:3000');
  return 'http://localhost:3000';
}

/**
 * Gets the project URL based on the environment and project slug
 * Handles both subdomain and path-based routing
 */
export function getProjectUrl(slug: string, path: string = '/board'): string {
  // Client-side
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isVercelPreview = hostname.includes('vercel.app');
    const isStaging = hostname === 'staging.feedvote.com';

    // For local development or preview environments, use path-based routing
    if (isLocalhost || isVercelPreview || isStaging) {
      return `${window.location.origin}/app/${slug}${path}`;
    }

    // For production, use subdomain-based routing
    return `https://${slug}.feedvote.com${path}`;
  }

  // Server-side
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview') {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/app/${slug}${path}`;
  }

  return `https://${slug}.feedvote.com${path}`;
}

/**
 * Gets the widget URL for a project
 */
export function getWidgetUrl(slug: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/widget/${slug}`;
}

/**
 * Gets the redirect URL for authentication callbacks
 * Ensures the correct URL is used for the current environment
 */
export function getAuthRedirectUrl(path = '/auth/callback'): string {
  // Always use absolute URLs for OAuth redirect
  const baseUrl = getBaseUrl();

  // Make sure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Build the complete URL
  const redirectUrl = `${baseUrl}${normalizedPath}`;

  // For localhost, ensure we're using whatever port the app is running on
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    const localhostUrl = `${window.location.origin}${normalizedPath}`;
    console.log('getAuthRedirectUrl - using localhost URL:', localhostUrl);
    return localhostUrl;
  }

  console.log('getAuthRedirectUrl - final URL:', redirectUrl);
  return redirectUrl;
}
