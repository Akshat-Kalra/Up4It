import { Account, Client, Databases, Functions, Storage } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './config';

/**
 * Initialize Appwrite client
 * This singleton ensures we only create one client instance
 */
class AppwriteService {
  constructor() {
    this.client = new Client();
    this.endpoint = APPWRITE_ENDPOINT;
    this.projectId = APPWRITE_PROJECT_ID;
    
    this.client
      .setEndpoint(this.endpoint)
      .setProject(this.projectId);
    
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.functions = new Functions(this.client);
  }
  
  // Return the initialized client
  getClient() {
    return this.client;
  }
  
  // Return the account instance
  getAccount() {
    return this.account;
  }
  
  // Return the databases instance
  getDatabases() {
    return this.databases;
  }
  
  // Return the storage instance
  getStorage() {
    return this.storage;
  }
  
  // Return the functions instance
  getFunctions() {
    return this.functions;
  }
  
  // Return the Appwrite endpoint
  getEndpoint() {
    return this.endpoint;
  }
  
  // Return the Appwrite project ID
  getProjectId() {
    return this.projectId;
  }
}

// Create a singleton instance
const appwriteService = new AppwriteService();

export default appwriteService; 