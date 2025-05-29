// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authentication
export const TOKEN_EXPIRY = '1d'; // JWT token expiry

// Date formatting
export const DATE_FORMAT = 'MMM dd, yyyy';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Subscription 
export const SUBSCRIPTION_REMINDER_DAYS = 7; // Days before expiration to send reminder