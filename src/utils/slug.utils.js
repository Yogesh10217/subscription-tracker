/**
 * @file slug.utils.js
 * @module utils/slug.utils
 * @description Standardized slug generator for taxonomy resources (categories, providers, tags).
 */

/**
 * Converts a string into a URL-safe lowercase slug.
 * @param {string} text
 * @returns {string}
 */
export const generateSlug = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default generateSlug;
