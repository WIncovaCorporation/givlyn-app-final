/**
 * Sentry Error Monitoring Configuration (Stub)
 * Sentry is optional - this file provides fallback implementations
 */

type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

export const initSentry = () => {
  console.warn('Sentry DSN not configured. Set VITE_SENTRY_DSN to enable error monitoring.');
};

export const captureException = (error: Error, context?: Record<string, unknown>) => {
  console.error('Error captured:', error, context);
};

export const captureMessage = (message: string, level: SeverityLevel = 'info') => {
  console.log(`[${level}] ${message}`);
};

export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  console.log('User context set:', user);
};

export const clearUserContext = () => {
  console.log('User context cleared');
};
