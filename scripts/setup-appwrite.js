// Setup script for initializing Appwrite database and storage structure
// Run with: node scripts/setup-appwrite.js

const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config();

// You'll need to update these or use environment variables
const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6811f9090020cdcb835a',
  apiKey: process.env.APPWRITE_API_KEY || 'YOUR_API_KEY' // Create an API key in the Appwrite console
};

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

// Database ID (using project ID as suggested)
const DATABASE_ID = config.projectId;

// Collection IDs
const COLLECTIONS = {
  PROFILES: 'profiles',
  ACTIVITIES: 'activities',
  MATCHES: 'matches',
  MESSAGES: 'messages'
};

// Storage bucket IDs
const BUCKETS = {
  PROFILE_IMAGES: 'profileImages',
  ACTIVITY_IMAGES: 'activityImages'
};

// Create database and collections
async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Try to create the database (might already exist)
    try {
      // Create database
      await databases.create(DATABASE_ID, 'Up4It Database');
      console.log(`Database ${DATABASE_ID} created successfully`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`Database ${DATABASE_ID} already exists, continuing...`);
      } else {
        throw error;
      }
    }

    // Create Profiles collection
    try {
      console.log('Setting up Profiles collection...');
      
      // First try to delete the collection if it exists
      try {
        await databases.deleteCollection(
          DATABASE_ID,
          COLLECTIONS.PROFILES
        );
        console.log(`Existing Profiles collection deleted successfully`);
      } catch (deleteError) {
        console.log(`No existing Profiles collection to delete or error: ${deleteError.message || 'Unknown error'}`);
      }
      
      // Create the collection with updated permissions
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        'User Profiles',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      
      // Add attributes to Profiles collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROFILES, 'userId', 36, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROFILES, 'name', 100, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROFILES, 'bio', 500, false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROFILES, 'interests', 100, false, null, true); // array
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROFILES, 'photoUrls', 255, false, null, true); // array
      await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.PROFILES, 'primaryPhotoIndex', false, 0);
      
      // Note: $createdAt and $updatedAt are automatically added by Appwrite
      
      // Create index for userId for faster queries
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        'userId_index',
        'key',
        ['userId'],
        ['asc']
      );
      
      console.log(`Profiles collection created successfully`);
    } catch (error) {
      console.error('Error creating Profiles collection:', error);
    }

    // Create Activities collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.ACTIVITIES,
        'Activities',
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      
      // Add attributes to Activities collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'userId', 36, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'title', 100, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'description', 1000, false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'location', 255, false);
      await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'latitude', false);
      await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'longitude', false);
      await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'date', false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'interests', 100, false, null, true); // array
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'participants', 36, false, null, true); // array
      await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'maxParticipants', false, 0);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ACTIVITIES, 'photoUrls', 255, false, null, true); // array
      
      // Create indexes for faster queries
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.ACTIVITIES,
        'userId_index',
        'key',
        ['userId'],
        ['asc']
      );
      
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.ACTIVITIES,
        'date_index',
        'key',
        ['date'],
        ['asc']
      );
      
      console.log(`Activities collection created successfully`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`Activities collection already exists, continuing...`);
      } else {
        console.error('Error creating Activities collection:', error);
      }
    }

    // Create Matches collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.MATCHES,
        'User Matches',
        [
          Permission.read(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      
      // Add attributes to Matches collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.MATCHES, 'userIds', 36, true, null, true); // array
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.MATCHES, 'status', 20, true); // pending, accepted, declined
      await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.MATCHES, 'lastInteraction', true);
      
      // Create index for userIds for faster queries
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.MATCHES,
        'userIds_index',
        'key',
        ['userIds'],
        ['asc']
      );
      
      console.log(`Matches collection created successfully`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`Matches collection already exists, continuing...`);
      } else {
        console.error('Error creating Matches collection:', error);
      }
    }

    // Create Messages collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        'User Messages',
        [
          Permission.read(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      
      // Add attributes to Messages collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.MESSAGES, 'senderId', 36, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.MESSAGES, 'receiverId', 36, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.MESSAGES, 'content', 2000, true);
      await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.MESSAGES, 'timestamp', true);
      await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.MESSAGES, 'read', true, false);
      
      // Create indexes for faster queries
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        'senderId_index',
        'key',
        ['senderId'],
        ['asc']
      );
      
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        'receiverId_index',
        'key',
        ['receiverId'],
        ['asc']
      );
      
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        'conversation_index',
        'key',
        ['senderId', 'receiverId'],
        ['asc', 'asc']
      );
      
      console.log(`Messages collection created successfully`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`Messages collection already exists, continuing...`);
      } else {
        console.error('Error creating Messages collection:', error);
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Create storage buckets
async function setupStorage() {
  try {
    console.log('Setting up storage buckets...');
    
    // Create Profile Images bucket - first delete if exists
    try {
      console.log(`Checking if Profile Images bucket exists...`);
      
      try {
        // First try to delete the bucket if it exists
        await storage.deleteBucket(BUCKETS.PROFILE_IMAGES);
        console.log(`Existing Profile Images bucket deleted successfully`);
      } catch (deleteError) {
        // If bucket doesn't exist or other error, continue
        console.log(`No existing Profile Images bucket to delete or error: ${deleteError.message || 'Unknown error'}`);
      }
      
      // Create the bucket with correct extensions
      console.log(`Creating Profile Images bucket...`);
      await storage.createBucket(
        BUCKETS.PROFILE_IMAGES,
        'Profile Images',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        false, // fileSecurity (optional)
        true, // enabled (optional)
        5 * 1024 * 1024, // Maximum file size: 5MB
        ['jpg', 'jpeg', 'png', 'gif', 'webp'] // Allowed file extensions (changed from MIME types)
      );
      console.log(`Profile Images bucket created successfully`);
    } catch (error) {
      console.error('Error setting up Profile Images bucket:', error);
    }
    
    // Create Activity Images bucket - first delete if exists
    try {
      console.log(`Checking if Activity Images bucket exists...`);
      
      try {
        // First try to delete the bucket if it exists
        await storage.deleteBucket(BUCKETS.ACTIVITY_IMAGES);
        console.log(`Existing Activity Images bucket deleted successfully`);
      } catch (deleteError) {
        // If bucket doesn't exist or other error, continue
        console.log(`No existing Activity Images bucket to delete or error: ${deleteError.message || 'Unknown error'}`);
      }
      
      // Create the bucket with correct extensions
      console.log(`Creating Activity Images bucket...`);
      await storage.createBucket(
        BUCKETS.ACTIVITY_IMAGES,
        'Activity Images',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        false, // fileSecurity (optional)
        true, // enabled (optional)
        10 * 1024 * 1024, // Maximum file size: 10MB
        ['jpg', 'jpeg', 'png', 'gif', 'webp'] // Allowed file extensions (changed from MIME types)
      );
      console.log(`Activity Images bucket created successfully`);
    } catch (error) {
      console.error('Error setting up Activity Images bucket:', error);
    }
    
    console.log('Storage setup completed successfully');
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

// Run setup
async function runSetup() {
  try {
    await setupDatabase();
    await setupStorage();
    console.log('Appwrite setup completed successfully');
  } catch (error) {
    console.error('Failed to complete Appwrite setup:', error);
  }
}

// Execute the setup
runSetup(); 