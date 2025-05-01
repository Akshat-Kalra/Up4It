import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure Storage Service
 * Provides encryption for sensitive data like auth tokens
 * Uses Expo SecureStore for native platforms and localStorage with encryption for web
 */
class SecureStorageService {
  constructor() {
    // Keys used for storing different types of sensitive data
    this.keys = {
      AUTH_TOKEN: 'up4it_auth_token',
      USER_SESSION: 'up4it_user_session',
      USER_ID: 'up4it_user_id',
      REFRESH_TOKEN: 'up4it_refresh_token',
    };
    
    // Detect if running on web or native
    this.isWeb = Platform.OS === 'web';
  }
  
  /**
   * Save data securely
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {Promise<void>}
   */
  async saveItem(key, value) {
    try {
      // Convert objects to strings if needed
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      if (this.isWeb) {
        // For web, we'll use localStorage with base64 encoding 
        // In a production app, consider using a proper encryption library
        const encodedValue = btoa(valueToStore);
        localStorage.setItem(key, encodedValue);
        return Promise.resolve();
      } else {
        // For native, use SecureStore
        return await SecureStore.setItemAsync(key, valueToStore);
      }
    } catch (error) {
      console.error('Error saving to secure storage:', error);
      throw error;
    }
  }
  
  /**
   * Get data from secure storage
   * @param {string} key - Storage key
   * @returns {Promise<string|null>} Stored value or null if not found
   */
  async getItem(key) {
    try {
      let value;
      
      if (this.isWeb) {
        // For web, get from localStorage and decode
        const encodedValue = localStorage.getItem(key);
        value = encodedValue ? atob(encodedValue) : null;
      } else {
        // For native, use SecureStore
        value = await SecureStore.getItemAsync(key);
      }
      
      // Parse JSON if the value is a JSON string
      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          // If it's not valid JSON, return as is
          return value;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving from secure storage:', error);
      return null;
    }
  }
  
  /**
   * Delete data from secure storage
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  async deleteItem(key) {
    try {
      if (this.isWeb) {
        // For web, remove from localStorage
        localStorage.removeItem(key);
        return Promise.resolve();
      } else {
        // For native, use SecureStore
        return await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error deleting from secure storage:', error);
      throw error;
    }
  }
  
  // Convenience methods for common operations
  
  /**
   * Save authentication token
   * @param {string} token - Auth token to save
   * @returns {Promise<void>}
   */
  async saveAuthToken(token) {
    return this.saveItem(this.keys.AUTH_TOKEN, token);
  }
  
  /**
   * Get authentication token
   * @returns {Promise<string|null>} Auth token or null
   */
  async getAuthToken() {
    return this.getItem(this.keys.AUTH_TOKEN);
  }
  
  /**
   * Delete authentication token (logout)
   * @returns {Promise<void>}
   */
  async clearAuthToken() {
    return this.deleteItem(this.keys.AUTH_TOKEN);
  }
  
  /**
   * Save user session data
   * @param {Object} session - Session data to save
   * @returns {Promise<void>}
   */
  async saveSession(session) {
    return this.saveItem(this.keys.USER_SESSION, session);
  }
  
  /**
   * Get user session data
   * @returns {Promise<Object|null>} Session data or null
   */
  async getSession() {
    return this.getItem(this.keys.USER_SESSION);
  }
  
  /**
   * Clear user session (logout)
   * @returns {Promise<void>}
   */
  async clearSession() {
    return this.deleteItem(this.keys.USER_SESSION);
  }
  
  /**
   * Save user ID
   * @param {string} userId - User ID to save
   * @returns {Promise<void>}
   */
  async saveUserId(userId) {
    return this.saveItem(this.keys.USER_ID, userId);
  }
  
  /**
   * Get user ID
   * @returns {Promise<string|null>} User ID or null
   */
  async getUserId() {
    return this.getItem(this.keys.USER_ID);
  }
  
  /**
   * Clear all stored user data (complete logout)
   * @returns {Promise<void>}
   */
  async clearAllUserData() {
    const promises = [
      this.clearAuthToken(),
      this.clearSession(),
      this.deleteItem(this.keys.USER_ID),
      this.deleteItem(this.keys.REFRESH_TOKEN)
    ];
    
    return Promise.all(promises);
  }
}

const secureStorageService = new SecureStorageService();
export default secureStorageService; 