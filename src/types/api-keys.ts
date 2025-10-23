// API key types for FeedVote platform

/**
 * Types of API keys supported by the platform
 */
export type ApiKeyType = 'public' | 'secret' | 'mobile';

/**
 * API key model representing an entry in the project_api_keys table
 */
export interface ApiKey {
  id: string;
  project_id: string;
  key_type: ApiKeyType;
  key_value: string;
  name: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

/**
 * Request payload for creating a new API key
 */
export interface ApiKeyCreateRequest {
  project_id: string;
  key_type: ApiKeyType;
  name?: string;
  description?: string;
  expires_at?: string | null;
}

/**
 * Request payload for updating an existing API key
 */
export interface ApiKeyUpdateRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  expires_at?: string | null;
}

/**
 * Response format for API key operations
 */
export interface ApiKeyResponse {
  id: string;
  project_id: string;
  key_type: ApiKeyType;
  key_value: string;
  name: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

/**
 * Widget configuration options related to user parameters
 */
export interface WidgetUserParams {
  userIdEnabled: boolean;
  userEmailEnabled: boolean;
  userNameEnabled: boolean;
  imgUrlEnabled: boolean;
  colorModeEnabled: boolean;
  userSpendEnabled: boolean;
  tokenEnabled: boolean;
}

/**
 * Formatted key info for display purposes
 */
export interface ApiKeyDisplayInfo {
  type: ApiKeyType;
  name: string;
  description: string | null;
  value: string;
  createdAt: string;
  lastUsed: string | null;
  isActive: boolean;
  expiresAt: string | null;
  formattedValue: string; // Partially masked value for UI display
}

/**
 * Helper function to mask an API key for display
 * Shows only the first 8 and last 4 characters
 */
export function maskApiKey(keyValue: string): string {
  if (!keyValue || keyValue.length < 16) return keyValue;

  const prefix = keyValue.substring(0, 8);
  const suffix = keyValue.substring(keyValue.length - 4);
  const maskedPart = '•'.repeat(Math.min(keyValue.length - 12, 16));

  return `${prefix}${maskedPart}${suffix}`;
}

/**
 * Get descriptive information about an API key type
 */
export function getApiKeyTypeInfo(type: ApiKeyType): {
  label: string;
  description: string;
  securityLevel: 'low' | 'medium' | 'high';
} {
  switch (type) {
    case 'public':
      return {
        label: 'Public Key',
        description: 'Safe to use in client-side code for widget embedding.',
        securityLevel: 'low',
      };
    case 'secret':
      return {
        label: 'Secret Key',
        description: 'For server-side use only. Never expose in client-side code.',
        securityLevel: 'high',
      };
    case 'mobile':
      return {
        label: 'Mobile Key',
        description: 'For use in mobile applications.',
        securityLevel: 'medium',
      };
    default:
      return {
        label: 'Unknown',
        description: 'Unknown key type.',
        securityLevel: 'low',
      };
  }
}
