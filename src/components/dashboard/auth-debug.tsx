'use client';

import { useEffect, useState } from 'react';
import { getAuthData } from '@/utils/auth-helper';
import { Card } from '@/components/ui/card';

export function AuthDebug() {
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    // Get auth data from localStorage on component mount
    const authData = getAuthData();
    setLocalStorageData(authData);

    // Update when storage changes
    const handleStorageChange = () => {
      const authData = getAuthData();
      setLocalStorageData(authData);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!localStorageData) {
    return (
      <Card className="p-4 mb-4 bg-yellow-50 dark:bg-yellow-900/30">
        <h3 className="text-lg font-medium">No Authentication Data Found</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">No authentication data in localStorage.</p>
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
      <h3 className="text-lg font-medium mb-2">Authentication Debug</h3>

      <div className="mb-4">
        <h4 className="text-md font-medium">Session Info</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600 dark:text-gray-400">Access Token:</div>
          <div className="font-mono overflow-hidden">{truncate(localStorageData.access_token)}</div>

          <div className="text-gray-600 dark:text-gray-400">Refresh Token:</div>
          <div className="font-mono">{truncate(localStorageData.refresh_token)}</div>

          <div className="text-gray-600 dark:text-gray-400">Expires At:</div>
          <div>{new Date(localStorageData.expires_at * 1000).toLocaleString()}</div>

          <div className="text-gray-600 dark:text-gray-400">Expires In:</div>
          <div>{localStorageData.expires_in} seconds</div>

          <div className="text-gray-600 dark:text-gray-400">Token Type:</div>
          <div>{localStorageData.token_type}</div>
        </div>
      </div>

      {localStorageData.user && (
        <div>
          <h4 className="text-md font-medium">User Info</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600 dark:text-gray-400">User ID:</div>
            <div className="font-mono">{localStorageData.user.id}</div>

            <div className="text-gray-600 dark:text-gray-400">Email:</div>
            <div>{localStorageData.user.email}</div>

            <div className="text-gray-600 dark:text-gray-400">Provider:</div>
            <div>{localStorageData.user.app_metadata?.provider}</div>

            <div className="text-gray-600 dark:text-gray-400">Name:</div>
            <div>{localStorageData.user.user_metadata?.name || 'N/A'}</div>

            {localStorageData.user.user_metadata?.avatar_url && (
              <>
                <div className="text-gray-600 dark:text-gray-400">Avatar:</div>
                <div className="flex items-center">
                  <img
                    src={localStorageData.user.user_metadata.avatar_url}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-xs">{truncate(localStorageData.user.user_metadata.avatar_url, 20)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
