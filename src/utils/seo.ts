/**
 * SEO utility functions for managing canonical tags and meta tags
 */

const BASE_URL = 'https://www.knowhowindia.in';

/**
 * Maps alternative URLs to their canonical versions
 */
const CANONICAL_PATH_MAPPINGS: Record<string, string> = {
  '/home': '/',
  '/shipping': '/shipping-policy',
  '/terms': '/terms-and-conditions',
  '/terms-of-service': '/terms-and-conditions',
  '/contact': '/contact-us'
};

/**
 * Gets the canonical path for a given path
 * @param path - The path to get the canonical version of
 */
const getCanonicalPath = (path: string): string => {
  // Normalize path
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return CANONICAL_PATH_MAPPINGS[normalizedPath] || normalizedPath;
};

/**
 * Gets the canonical base URL, ensuring it always uses knowhowindia.in
 * This prevents issues with multiple domains pointing to the same site
 */
const getCanonicalBaseUrl = (): string => {
  // Always use the primary domain, regardless of what domain the user is on
  return BASE_URL;
};

/**
 * Sets or updates the canonical tag for the current page
 * @param path - The path of the current page (e.g., '/contact-us' or '/contact')
 *               If not provided, will use window.location.pathname
 */
export const setCanonicalTag = (path?: string) => {
  // If no path provided, use current location
  const currentPath = path || window.location.pathname;
  
  // Get the canonical version of the path
  const canonicalPath = getCanonicalPath(currentPath);
  
  // Remove ALL existing canonical tags (in case there are multiple)
  const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
  existingCanonicals.forEach(canonical => canonical.remove());

  // Create new canonical tag with the correct domain and canonical path
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  const baseUrl = getCanonicalBaseUrl();
  canonical.href = `${baseUrl}${canonicalPath === '/' ? '' : canonicalPath}`;
  document.head.appendChild(canonical);
  
  // Also update og:url to match
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonical.href);
};

/**
 * Sets meta tags for the page
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path for canonical URL
 */
export const setMetaTags = (title?: string, description?: string, path: string = '/') => {
  // Set canonical tag
  setCanonicalTag(path);

  // Update title if provided
  if (title) {
    document.title = title;
  }

  // Update description if provided
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }
};

