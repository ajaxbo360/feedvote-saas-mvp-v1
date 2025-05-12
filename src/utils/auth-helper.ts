'use client';

import { createClient } from './supabase/client';

// Storage keys
const AUTH_STORAGE_KEY = 'feedvote-auth-state';

// Save auth data to localStorage
export const saveAuthData = (session: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          access_token: session?.access_token,
          expires_at: session?.expires_at,
          expires_in: session?.expires_in,
          provider_token: session?.provider_token,
          refresh_token: session?.refresh_token,
          token_type: session?.token_type,
          user: session?.user,
        }),
      );
      console.log('Auth data saved to localStorage');
    } catch (error) {
      console.error('Error saving auth data to localStorage:', error);
    }
  }
};

// Get auth data from localStorage
export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Error getting auth data from localStorage:', error);
      return null;
    }
  }
  return null;
};

// Clear auth data from localStorage
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('Auth data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing auth data from localStorage:', error);
    }
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
};

// Check if user is logged in
export const isLoggedIn = () => {
  const authData = getAuthData();
  return !!authData?.access_token && !!authData?.user;
};

// Get the current user
export const getCurrentUser = () => {
  const authData = getAuthData();
  return authData?.user || null;
};
