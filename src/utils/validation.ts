'use client';

/**
 * Common validation patterns used throughout the application
 * These functions provide consistent validation and sanitization
 * for user input to prevent injection attacks and data corruption
 */

export const validation = {
  /**
   * Validates and sanitizes a slug string
   * Allows lowercase letters, numbers, and hyphens
   * Replaces spaces with hyphens and removes other invalid characters
   */
  slug: (value: string): string => {
    if (!value) return '';
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  },

  /**
   * Validates and sanitizes an email address
   * Returns empty string if invalid
   */
  email: (value: string): string => {
    if (!value) return '';
    // Basic email regex - can be extended for more strict validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? value.trim().toLowerCase() : '';
  },

  /**
   * Validates and sanitizes a name (person, project, etc.)
   * Allows letters, numbers, spaces, hyphens, apostrophes
   * Removes other potentially harmful characters
   */
  name: (value: string): string => {
    if (!value) return '';
    return value
      .trim()
      .replace(/[^\w\s'\-]/g, '') // Remove invalid characters
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  },

  /**
   * Validates and sanitizes a URL
   * Returns empty string if not a valid URL
   */
  url: (value: string): string => {
    if (!value) return '';
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
    } catch (e) {
      return '';
    }
  },

  /**
   * Sanitizes text input (descriptions, comments, etc.)
   * Preserves line breaks while removing potentially harmful content
   */
  text: (value: string): string => {
    if (!value) return '';
    return value.trim().replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags
  },

  /**
   * Validates that a value meets minimum length requirements
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  /**
   * Validates that a value doesn't exceed maximum length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  /**
   * Validates that a numeric value is within range
   */
  numericRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  /**
   * Sanitizes text for database queries to prevent SQL injection
   * This is a basic implementation - real DB queries should use parameterized queries
   */
  dbSafe: (value: string): string => {
    if (!value) return '';
    return value.replace(/['";\\]/g, ''); // Remove characters often used in SQL injection
  },

  /**
   * Validates and returns a safe filename
   */
  filename: (value: string): string => {
    if (!value) return '';
    return value
      .trim()
      .replace(/[/\\?%*:|"<>]/g, '-') // Replace unsafe filename characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  },
};

/**
 * Form validation helper
 * Returns errors object and a boolean indicating if form is valid
 */
export function validateForm(
  fields: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>,
): {
  errors: Record<string, string>;
  isValid: boolean;
} {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(fields[field]);

    if (result === false) {
      errors[field] = `${field} is invalid`;
      isValid = false;
    } else if (typeof result === 'string' && result.length > 0) {
      errors[field] = result;
      isValid = false;
    }
  }

  return { errors, isValid };
}
