/**
 * API configuration constants
 * Centralizes all API-related configurations
 */

const isDev = import.meta.env.DEV;
const windowHost = typeof window !== "undefined" ? window.location.host : "";
// If in dev and we're on localhost (or 127.*) we prefer a relative /api path so Vite proxy handles backend.
// This avoids hardcoding a .dev domain that triggers HSTS HTTPS upgrade issues.
const useRelativeApi = isDev && /^(localhost|127\.)/.test(windowHost);

export const API_CONFIG = {
  BASE_URL: useRelativeApi
    ? ""
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  API_VERSION: "v1",

  get API_BASE() {
    // If BASE_URL is empty string we construct a relative path consumed by dev proxy.
    return `${this.BASE_URL}/api/${this.API_VERSION}`.replace(/\/\//g, "/");
  },

  ENDPOINTS: {
    TENDERS: "/tenders",
    TENDER_CHAPTERS: "/tender-chapters",
    TENDER_CATEGORIES: "/tender-categories",
    TENDER_TYPES: "/tender-types",
    LOTS: "/lots",
  },
} as const;

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (endpoint: string, id?: string | number): string => {
  const url = `${API_CONFIG.API_BASE}${endpoint}`;
  return id ? `${url}/${id}` : url;
};
