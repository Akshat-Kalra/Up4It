# Appwrite Setup Scripts

This directory contains scripts for setting up and managing the Appwrite backend for Up4It.

## setup-appwrite.js

This script initializes the Appwrite database and storage buckets for the Up4It application.

### Prerequisites

1. **Appwrite API Key**: Create a new API key in the Appwrite console with the following permissions:

   - Databases (Read & Write)
   - Storage (Read & Write)

2. **Node.js Dependencies**: Install required dependencies:
   ```bash
   npm install node-appwrite dotenv
   ```

### Configuration

Create a `.env` file in the project root with the following variables:

```
# Appwrite Configuration
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=6811f9090020cdcb835a
APPWRITE_API_KEY=your-api-key-goes-here
```

Alternatively, you can directly edit the config object in the script.

### Running the Script

```bash
node scripts/setup-appwrite.js
```

### What the Script Does

1. **Database Setup**:

   - Creates a database using your project ID
   - Creates collections for profiles, activities, matches, and messages
   - Defines attributes/fields for each collection
   - Sets up indexes for faster queries
   - Configures appropriate permissions

2. **Storage Setup**:
   - Creates a profileImages bucket for user profile photos (5MB limit)
   - Creates an activityImages bucket for activity photos (10MB limit)
   - Sets permissions for file access

### After Running

After successful execution, you should have:

- A fully configured database with collections and attributes
- Storage buckets ready for file uploads
- Proper indexes for efficient queries
- Security rules applied through permissions

You can then proceed to update your client-side code to use these resources.
