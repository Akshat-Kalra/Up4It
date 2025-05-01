import { ID, Permission, Query, Role } from 'appwrite';
import auth from './auth';
import appwriteService from './client';

// Get database and storage instances from the service
const databases = appwriteService.getDatabases();
const storage = appwriteService.getStorage();

// Constants
const DATABASE_ID = '6811f9090020cdcb835a'; // Use your PROJECT_ID as DATABASE_ID
const PROFILES_COLLECTION_ID = 'profiles';
const PROFILE_PHOTOS_BUCKET_ID = 'profileImages';

// Max allowed file size for profile photos (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Profile service for Appwrite
 * Handles creating, updating, and retrieving user profiles
 */
const profile = {
  /**
   * Create a new user profile
   * @param {Object} profileData - Profile data
   * @param {string} profileData.name - User's name
   * @param {string} profileData.bio - User's bio (optional)
   * @param {Array<string>} profileData.interests - User's interests (optional)
   * @param {Array<string>} profileData.photoUrls - Uploaded photo URLs (optional)
   * @param {number} profileData.primaryPhotoIndex - Index of primary photo (optional)
   * @returns {Promise<Object>} - Created profile document
   */
  async createProfile(profileData) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to create a profile');
      }
      
      // Validate photoUrls is an array if provided
      if (profileData.photoUrls) {
        console.log("Validating photoUrls", profileData.photoUrls);
        
        if (!Array.isArray(profileData.photoUrls)) {
          throw new Error('photoUrls must be an array');
        }
        
        // Filter out any null or invalid values
        profileData.photoUrls = profileData.photoUrls.filter(url => url && typeof url === 'string' && url.startsWith('http'));
        console.log("Filtered photoUrls", profileData.photoUrls);
      }
      
      // Prepare profile data
      const profile = {
        userId: currentUser.$id,
        name: profileData.name,
        bio: profileData.bio || '',
        interests: profileData.interests || [],
        photoUrls: profileData.photoUrls || [],
        primaryPhotoIndex: profileData.primaryPhotoIndex || 0
      };
      
      // Log the data we're about to send to Appwrite
      console.log("Sending profile data to Appwrite:", JSON.stringify(profile, null, 2));
      
      // Create document using collection-level permissions
      const document = await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        ID.unique(),
        profile
      );
      
      // Log the created document to verify it contains the correct data
      console.log("Profile document created:", document.$id);
      
      return document;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise<Object|null>} - User profile or null if not found
   */
  async getCurrentProfile() {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        return null;
      }
      
      const profiles = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        [
          Query.equal('userId', currentUser.$id),
          Query.limit(1),
        ]
      );
      
      return profiles.documents.length > 0 ? profiles.documents[0] : null;
    } catch (error) {
      console.error('Error getting current profile:', error);
      throw error;
    }
  },
  
  /**
   * Get a profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} - User profile or null if not found
   */
  async getProfileByUserId(userId) {
    try {
      const profiles = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.limit(1),
        ]
      );
      
      return profiles.documents.length > 0 ? profiles.documents[0] : null;
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
      throw error;
    }
  },
  
  /**
   * Update user's profile
   * @param {string} profileId - Profile document ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} - Updated profile document
   */
  async updateProfile(profileId, profileData) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to update a profile');
      }
      
      // Prepare update data - remove createdAt/updatedAt as they're handled by Appwrite
      const updateData = { ...profileData };
      
      // Remove any undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      // Remove updatedAt if it exists since Appwrite manages this field automatically
      delete updateData.updatedAt;
      delete updateData.createdAt;
      
      const document = await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        profileId,
        updateData
      );
      
      return document;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  /**
   * Delete user's profile
   * @returns {Promise<boolean>} - Success status
   */
  async deleteProfile() {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to delete your profile');
      }
      
      // Get current profile
      const currentProfile = await this.getCurrentProfile();
      
      if (!currentProfile) {
        throw new Error('Profile not found');
      }
      
      // Delete all profile photos first
      if (currentProfile.photoUrls && currentProfile.photoUrls.length > 0) {
        for (const photoUrl of currentProfile.photoUrls) {
          try {
            await this.deleteProfilePhoto(photoUrl);
          } catch (error) {
            console.error('Error deleting profile photo:', error);
            // Continue with other photos
          }
        }
      }
      
      // Delete the profile document
      await databases.deleteDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        currentProfile.$id
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },
  
  /**
   * Upload a profile photo
   * @param {File|Blob} file - Photo file to upload
   * @returns {Promise<string>} - Photo URL
   */
  async uploadProfilePhoto(file) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to upload a photo');
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
      
      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Only JPEG, PNG, GIF, and WebP images are allowed`);
      }
      
      // Validate file name and extension
      if (!file.name) {
        throw new Error('File must have a name property');
      }
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!validExtensions.includes(fileExtension)) {
        throw new Error(`Invalid file extension: ${fileExtension}. Allowed: ${validExtensions.join(', ')}`);
      }
      
      console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Generate a unique ID for the file
      const fileId = ID.unique();
      
      // Upload file with appropriate permissions
      console.log(`Starting Appwrite storage.createFile call with ID: ${fileId}`);
      const result = await storage.createFile(
        PROFILE_PHOTOS_BUCKET_ID,
        fileId,
        file,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id))
        ]
      );
      
      if (!result || !result.$id) {
        throw new Error('File upload failed, no file ID returned');
      }
      
      console.log('File uploaded successfully, ID:', result.$id);
      
      // Construct the file URL directly using the Appwrite endpoint and project ID
      const endpoint = appwriteService.getEndpoint();
      const projectId = appwriteService.getProjectId();
      
      // Format: https://cloud.appwrite.io/v1/storage/buckets/{bucketId}/files/{fileId}/view?project={projectId}
      const fileUrl = `${endpoint}/storage/buckets/${PROFILE_PHOTOS_BUCKET_ID}/files/${result.$id}/view?project=${projectId}`;
      
      console.log('File view URL:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  },
  
  /**
   * Delete a profile photo
   * @param {string} fileUrl - URL of the photo to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteProfilePhoto(fileUrl) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to delete a photo');
      }
      
      // Extract file ID from URL
      const fileId = fileUrl.split('/').pop().split('?')[0];
      
      // Delete the file
      await storage.deleteFile(
        PROFILE_PHOTOS_BUCKET_ID,
        fileId
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      throw error;
    }
  },
  
  /**
   * Get profiles with matching interests
   * @param {Array<string>} interests - Interests to match
   * @param {number} limit - Maximum number of profiles to return
   * @returns {Promise<Array<Object>>} - Matching profiles
   */
  async getProfilesWithMatchingInterests(interests, limit = 20) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to search profiles');
      }
      
      const queries = [
        Query.notEqual('userId', currentUser.$id), // Exclude current user
        Query.limit(limit),
      ];
      
      // Add interest queries if provided
      if (interests && interests.length > 0) {
        // Find profiles that match at least one interest
        const interestQueries = interests.map(interest => 
          Query.search('interests', interest)
        );
        
        // Combine interest queries with OR logic
        queries.push(Query.or(interestQueries));
      }
      
      const profiles = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        queries
      );
      
      return profiles.documents;
    } catch (error) {
      console.error('Error getting profiles with matching interests:', error);
      throw error;
    }
  },
};

export default profile;
