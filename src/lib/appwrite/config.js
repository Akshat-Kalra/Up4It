/**
 * Appwrite Configuration
 * 
 * This file contains the configuration settings for Appwrite services.
 */

export const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6811f9090020cdcb835a';

// Database collections
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  ACTIVITIES: 'activities',
  MATCHES: 'matches',
  MESSAGES: 'messages',
};

// Storage buckets
export const BUCKETS = {
  PROFILE_IMAGES: 'profileImages',
  ACTIVITY_IMAGES: 'activityImages',
};

// Allowed university email domains
export const ALLOWED_EMAIL_DOMAINS = [
  'student.ubc.ca',
  'alumni.ubc.ca',
  // Add other university domains as needed
];

// Session configuration
export const SESSION_EXPIRY = 14 * 24 * 60 * 60; // 14 days in seconds

// Maximum file sizes
export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_ACTIVITY_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed image types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; 