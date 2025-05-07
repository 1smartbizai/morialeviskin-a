
/**
 * Utility functions for the signup process
 */

/**
 * Formats a business name into a URL-safe slug
 */
export const formatBusinessSlug = (businessName: string): string => {
  return businessName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Generates a random business ID with a format like BIZ-ABC123
 */
export const generateBusinessId = (): string => {
  return `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

/**
 * Validates an email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number format (basic validation)
 */
export const isValidPhone = (phone: string): boolean => {
  return phone.length >= 9 && /^\d+$/.test(phone);
};
