import authService from './auth';
import appwriteService from './client';
import * as config from './config';
import secureStorageService from './secureStorage';

// Export individual services
export const client = appwriteService;
export const auth = authService;
export const secureStorage = secureStorageService;

// Export configuration
export const appwriteConfig = config;

// Export as default object
export default {
  client: appwriteService,
  auth: authService,
  secureStorage: secureStorageService,
  config
}; 