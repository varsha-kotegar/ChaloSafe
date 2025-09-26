/**
 * Utility functions for safely accessing environment variables
 * in browser environments where process.env might not be available
 */

export function getEnvVar(key: string, defaultValue = ''): string {
  try {
    return (typeof process !== 'undefined' && process.env?.[key]) || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function isDevelopment(): boolean {
  try {
    return (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false;
  } catch {
    return false;
  }
}

export function isProduction(): boolean {
  try {
    return (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') || true;
  } catch {
    return true; // Assume production if we can't determine
  }
}

// App-specific environment variables
export const ENV = {
  GOOGLE_CLIENT_ID: getEnvVar('REACT_APP_GOOGLE_CLIENT_ID', 'demo-client-id-chalosafe.apps.googleusercontent.com'),
  NODE_ENV: getEnvVar('NODE_ENV', 'production'),
  IS_DEV: isDevelopment(),
  IS_PROD: isProduction()
};