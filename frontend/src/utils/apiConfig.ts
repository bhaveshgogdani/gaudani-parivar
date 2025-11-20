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

/**
 * Get the full image URL based on the resultImageUrl from backend
 * - In localhost: Uses relative URL (goes through Vite proxy)
 * - In production: Uses full URL with proper base URL
 * @param resultImageUrl - The image URL from backend (format: /uploads/results/filename.jpg)
 * @returns Full image URL for the current environment
 */
export const getImageUrl = (resultImageUrl: string | undefined): string => {
  if (!resultImageUrl) {
    return '';
  }

  // resultImageUrl is in format /uploads/results/filename.jpg
  const hostname = window.location.hostname;
  const isLocalhost = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.');

  if (isLocalhost) {
    // In local development, use relative URL (goes through Vite proxy)
    return resultImageUrl;
  } else {
    // In production, use full URL
    const uploadsBaseUrl = getUploadsBaseUrl();
    // Remove /uploads prefix from resultImageUrl and append to base URL
    const imagePath = resultImageUrl.replace(/^\/uploads/, '');
    const cleanBaseUrl = uploadsBaseUrl.endsWith('/') ? uploadsBaseUrl.slice(0, -1) : uploadsBaseUrl;
    return `${cleanBaseUrl}${imagePath}`;
  }
};

