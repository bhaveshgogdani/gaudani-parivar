/**
 * Get the API base URL based on the current hostname
 * - If hostname is tiktakti.net (live server), use https://tiktakti.net:5010/api
 * - Otherwise (localhost or local IP), use http://localhost:5010/api
 */
export const getApiBaseUrl = (): string => {
  // Get current hostname
  const hostname = window.location.hostname;
  
  // Explicitly check for live server domain first
  if (hostname === 'tiktakti.net' || hostname.includes('tiktakti.net')) {
    // On live server, use the live backend API
    return 'https://tiktakti.net:5010/api';
  } else {
    // On localhost or local development, use localhost API
    return 'http://localhost:5010/api';
  }
};

/**
 * Get the uploads base URL for serving uploaded files
 * - If hostname is tiktakti.net (live server), use https://tiktakti.net:5010/uploads
 * - Otherwise (localhost or local IP), use http://localhost:5010/uploads
 */
export const getUploadsBaseUrl = (): string => {
  // Get current hostname
  const hostname = window.location.hostname;
  
  // Explicitly check for live server domain
  if (hostname === 'tiktakti.net' || hostname.includes('tiktakti.net')) {
    // On live server, use the live backend uploads
    return 'https://tiktakti.net:5010/uploads';
  } else {
    // On localhost or local development, use localhost uploads
    return 'http://localhost:5010/uploads';
  }
};

