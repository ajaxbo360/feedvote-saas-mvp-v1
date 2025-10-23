'use client';

import { createClient } from './supabase/client';
import { getAuthRedirectUrl } from './url-helper';

// Storage keys
const USER_PROFILE_CACHE_KEY = 'feedvote-user-profile';
const redirectUrl = `${window.location.origin}/auth/callback`;

// Store user profile data in localStorage (non-sensitive data only)
export const storeUserProfileCache = (user: any) => {
  if (typeof window !== 'undefined' && user) {
    try {
      // Only store non-sensitive user data that improves UX
      // DO NOT store tokens or sensitive authentication data here
      const profileData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider,
        last_sign_in: new Date().toISOString(),
      };

      localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(profileData));
      console.log('User profile data cached in localStorage for faster loading');
    } catch (error) {
      console.error('Error caching user profile data:', error);
    }
  }
};

// Get cached user profile from localStorage
export const getCachedUserProfile = () => {
  if (typeof window !== 'undefined') {
    try {
      const profileData = localStorage.getItem(USER_PROFILE_CACHE_KEY);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error getting cached user profile:', error);
      return null;
    }
  }
  return null;
};

// Clear user profile cache
export const clearUserProfileCache = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(USER_PROFILE_CACHE_KEY);
      console.log('User profile cache cleared from localStorage');
    } catch (error) {
      console.error('Error clearing user profile cache:', error);
    }
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthRedirectUrl(),
    },
  });

  return { data, error };
};

// Check if user is logged in (client-side)
export const isLoggedIn = async () => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    // If we have a session, update the user profile cache
    if (data.session?.user) {
      storeUserProfileCache(data.session.user);
    }

    return !!data.session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    // Fallback to cached data if available (not as secure, but better UX)
    const cachedProfile = getCachedUserProfile();
    return !!cachedProfile;
  }
};

// Get the current user (client-side)
export const getCurrentUser = async () => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      // Update cache whenever we successfully get the user
      storeUserProfileCache(data.user);
      return data.user;
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    // Fallback to cached profile data in case of errors
    // This helps maintain some UX even if the auth service is temporarily unavailable
    return getCachedUserProfile();
  }
};

// Complete sign out - clear both cookies and localStorage
export const signOut = async () => {
  try {
    // Sign out from Supabase (clears auth cookies)
    const supabase = createClient();
    await supabase.auth.signOut();

    // Also clear localStorage caches
    clearUserProfileCache();

    return { success: true };
  } catch (error) {
    console.error('Error during sign out:', error);
    return { success: false, error };
  }
};
