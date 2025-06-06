'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { getCachedUserProfile } from '@/utils/auth-helper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthDebug() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [cachedProfile, setCachedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get auth data from Supabase on component mount
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        // Get session from Supabase (cookie-based)
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setSessionData({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            user: session.user,
          });
        } else {
          setSessionData(null);
        }

        // Get cached profile from localStorage
        const profile = getCachedUserProfile();
        setCachedProfile(profile);
      } catch (error) {
        console.error('Error fetching session:', error);
        setSessionData(null);

        // Try to get cached profile even if session fetch fails
        const profile = getCachedUserProfile();
        setCachedProfile(profile);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();

    // We can't listen to cookie changes directly, so we'll use a polling approach
    // for demo purposes - in a real app, you'd use more efficient methods like
    // context providers or auth state management
    const intervalId = setInterval(fetchSessionData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-medium">Loading authentication data...</h3>
      </Card>
    );
  }

  if (!sessionData && !cachedProfile) {
    return (
      <Card className="p-4 mb-4 bg-yellow-50 dark:bg-yellow-900/30">
        <h3 className="text-lg font-medium">No Authentication Data Found</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">You are not currently authenticated.</p>
      </Card>
    );
  }

  // Helper function to truncate long strings
  const truncate = (str: string, maxLength = 30) => {
    if (!str) return 'N/A';
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
  };

  return (
    <Card className="p-4 mb-4 overflow-auto">
      <h3 className="text-lg font-medium mb-4">Authentication Debug</h3>

      <Tabs defaultValue="session" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="session">Cookie Session {!sessionData && '(Not Found)'}</TabsTrigger>
          <TabsTrigger value="cache">LocalStorage Cache {!cachedProfile && '(Not Found)'}</TabsTrigger>
        </TabsList>

        <TabsContent value="session">
          {sessionData ? (
            <>
              <div className="mb-4">
                <h4 className="text-md font-medium">Session Info (From Cookies)</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Access Token:</div>
                  <div className="font-mono overflow-hidden">{truncate(sessionData.access_token)}</div>

                  <div className="text-gray-600 dark:text-gray-400">Refresh Token:</div>
                  <div className="font-mono">{truncate(sessionData.refresh_token)}</div>

                  <div className="text-gray-600 dark:text-gray-400">Expires At:</div>
                  <div>{new Date(sessionData.expires_at * 1000).toLocaleString()}</div>

                  <div className="text-gray-600 dark:text-gray-400">Expires In:</div>
                  <div>{sessionData.expires_in} seconds</div>

                  <div className="text-gray-600 dark:text-gray-400">Token Type:</div>
                  <div>{sessionData.token_type}</div>
                </div>
              </div>

              {sessionData.user && (
                <div>
                  <h4 className="text-md font-medium">User Info (From Cookies)</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">User ID:</div>
                    <div className="font-mono">{sessionData.user.id}</div>

                    <div className="text-gray-600 dark:text-gray-400">Email:</div>
                    <div>{sessionData.user.email}</div>

                    <div className="text-gray-600 dark:text-gray-400">Provider:</div>
                    <div>{sessionData.user.app_metadata?.provider}</div>

                    <div className="text-gray-600 dark:text-gray-400">Name:</div>
                    <div>{sessionData.user.user_metadata?.name || 'N/A'}</div>

                    {sessionData.user.user_metadata?.avatar_url && (
                      <>
                        <div className="text-gray-600 dark:text-gray-400">Avatar:</div>
                        <div className="flex items-center">
                          <img
                            src={sessionData.user.user_metadata.avatar_url}
                            alt="User avatar"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-xs">{truncate(sessionData.user.user_metadata.avatar_url, 20)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
              <p className="text-sm">
                No cookie-based session found. You may not be authenticated or your session cookies could be
                missing/expired.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cache">
          {cachedProfile ? (
            <div>
              <h4 className="text-md font-medium">Cached User Profile (From LocalStorage)</h4>
              <p className="text-xs text-gray-500 mb-2">
                This is non-sensitive data cached for UI performance and fallback
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600 dark:text-gray-400">User ID:</div>
                <div className="font-mono">{cachedProfile.id}</div>

                <div className="text-gray-600 dark:text-gray-400">Email:</div>
                <div>{cachedProfile.email}</div>

                <div className="text-gray-600 dark:text-gray-400">Provider:</div>
                <div>{cachedProfile.provider}</div>

                <div className="text-gray-600 dark:text-gray-400">Name:</div>
                <div>{cachedProfile.name || 'N/A'}</div>

                <div className="text-gray-600 dark:text-gray-400">Last Sign In:</div>
                <div>{new Date(cachedProfile.last_sign_in).toLocaleString()}</div>

                {cachedProfile.avatar_url && (
                  <>
                    <div className="text-gray-600 dark:text-gray-400">Avatar:</div>
                    <div className="flex items-center">
                      <img src={cachedProfile.avatar_url} alt="User avatar" className="w-8 h-8 rounded-full mr-2" />
                      <span className="text-xs">{truncate(cachedProfile.avatar_url, 20)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
              <p className="text-sm">No cached user profile found in localStorage.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
