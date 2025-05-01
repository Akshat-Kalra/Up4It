import authService from './auth';
import appwriteService from './client';
import * as config from './config';
import profileService from './profile';
import secureStorageService from './secureStorage';

// Export individual services
export const client = appwriteService;
export const auth = authService;
export const secureStorage = secureStorageService;
export const profile = profileService;

// Export configuration
export const appwriteConfig = config;

// Export as default object
export default {
  client: appwriteService,
  auth: authService,
  secureStorage: secureStorageService,
  profile: profileService,
  config
}; 