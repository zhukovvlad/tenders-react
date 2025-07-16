/**
 * API configuration constants
 * Centralizes all API-related configurations
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  API_VERSION: 'v1',
  
  get API_BASE() {
    return `${this.BASE_URL}/api/${this.API_VERSION}`;
  },
  
  ENDPOINTS: {
    TENDERS: '/tenders',
    TENDER_CHAPTERS: '/tender-chapters',
    TENDER_CATEGORIES: '/tender-categories',
    TENDER_TYPES: '/tender-types',
  }
} as const;

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (endpoint: string, id?: string | number): string => {
  const url = `${API_CONFIG.API_BASE}${endpoint}`;
  return id ? `${url}/${id}` : url;
};