import { ID } from 'appwrite';
import appwriteService from './client';
import { ALLOWED_EMAIL_DOMAINS } from './config';

/**
 * Authentication service for Up4It app
 * Implements secure authentication with university email validation
 */
class AuthService {
  constructor() {
    this.account = appwriteService.getAccount();
  }

  /**
   * Validates if the email domain is from an allowed university
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid university email
   */
  validateUniversityEmail(email) {
    if (!email || !email.includes('@')) {
      return false;
    }

    const domain = email.split('@')[1].toLowerCase();
    return ALLOWED_EMAIL_DOMAINS.includes(domain);
  }

  /**
   * Creates a new user account with university email validation
   * @param {string} email - User email (must be university email)
   * @param {string} password - User password
   * @param {string} name - User's full name
   * @returns {Promise} Promise with account data
   * @throws Will throw an error if email is not from an allowed university
   */
  async createAccount(email, password, name) {
    if (!this.validateUniversityEmail(email)) {
      throw new Error('Only university email domains are allowed. Please use your university email.');
    }

    try {
      const newAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Send verification email
      if (newAccount) {
        await this.account.createVerification(
          'https://up4it.app/verify-email'
        );
      }

      return newAccount;
    } catch (error) {
      console.error('Account creation failed:', error);
      throw error;
    }
  }

  /**
   * Log in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise with session data
   */
  async login(email, password) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Log the current user out
   * @returns {Promise} Promise with logout result
   */
  async logout() {
    try {
      return await this.account.deleteSession('current');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get the current user
   * @returns {Promise} Promise with current account data or null if not logged in
   */
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  /**
   * Check if a user is currently logged in
   * @returns {Promise<boolean>} True if user is logged in
   */
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * Send password reset email
   * @param {string} email - Email address to send reset link
   * @returns {Promise} Promise with reset result
   */
  async resetPassword(email) {
    try {
      return await this.account.createRecovery(
        email,
        'https://up4it.app/reset-password'
      );
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Update user password after reset
   * @param {string} userId - User ID
   * @param {string} secret - Secret from reset email
   * @param {string} password - New password
   * @param {string} passwordAgain - Confirmation of new password
   * @returns {Promise} Promise with update result
   */
  async confirmPasswordReset(userId, secret, password, passwordAgain) {
    try {
      return await this.account.updateRecovery(
        userId,
        secret,
        password,
        passwordAgain
      );
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  }

  /**
   * Verify email address
   * @param {string} userId - User ID
   * @param {string} secret - Verification secret from email
   * @returns {Promise} Promise with verification result
   */
  async verifyEmail(userId, secret) {
    try {
      return await this.account.updateVerification(userId, secret);
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }

  /**
   * Update user account details
   * @param {string} name - New name (optional)
   * @param {string} phone - New phone (optional)
   * @returns {Promise} Promise with update result
   */
  async updateAccount(name, phone) {
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    try {
      return await this.account.updateName(name);
    } catch (error) {
      console.error('Account update failed:', error);
      throw error;
    }
  }

  /**
   * Create session with JWT
   * @returns {Promise} Promise with JWT token
   */
  async createJWT() {
    try {
      return await this.account.createJWT();
    } catch (error) {
      console.error('JWT creation failed:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService; 