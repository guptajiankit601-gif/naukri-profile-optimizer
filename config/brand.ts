/**
 * Central Brand Configuration for CareerUp
 * Centralized configuration for product identity, names, tagline, and metadata.
 */
export const BRAND_CONFIG = {
  name: 'CareerUp',
  descriptor: 'Resume & Career Studio',
  tagline: 'Your Career, One Step Ahead.',
  shortTagline: 'Your Career, One Step Ahead.',
  logoText: 'CareerUp',
  logoInitials: 'CU',
  metaTitle: 'CareerUp | Your Career, One Step Ahead.',
  metaDescription: 'Understand your resume, discover skill gaps, improve your Naukri profile, and prepare more relevant applications.',
  supportEmail: 'support@careerup.io',
  legalNotice: 'Independent career optimization platform. Core analysis runs locally in your session.',
  privacyBadge: 'Private In-Browser Analysis · No Account Required',
  version: '3.1.0'
} as const;

export const BRAND = BRAND_CONFIG;
export type BrandConfig = typeof BRAND_CONFIG;
