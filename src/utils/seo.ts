/**
 * SEO utility functions for managing canonical tags and meta tags
 */

const BASE_URL = 'https://www.knowhowindia.in';

/**
 * Sets or updates the canonical tag for the current page
 * @param path - The path of the current page (e.g., '/contact-us')
 */
export const setCanonicalTag = (path: string = '/') => {
  // Remove existing canonical tag if it exists
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  if (existingCanonical) {
    existingCanonical.remove();
  }

  // Create new canonical tag
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = `${BASE_URL}${path === '/' ? '' : path}`;
  document.head.appendChild(canonical);
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

