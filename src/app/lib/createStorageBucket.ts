import { Client, Storage, Permission, Role } from "appwrite";

/**
 * In Appwrite SDK v17.0.1, storage bucket creation is limited.
 * This function simply checks if a bucket exists and provides guidance if it doesn't.
 */
export const createStorageBucket = async (
  endpoint: string,
  projectId: string,
  bucketId: string
) => {
  try {
    console.log("Checking if media storage bucket exists...");

    // Initialize Appwrite client
    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    const storage = new Storage(client);

    try {
      // Check if bucket exists by trying to get a file
      await storage.listFiles(bucketId);
      console.log(`✅ Storage bucket ${bucketId} exists.`);
      return true;
    } catch (error) {
      // Bucket doesn't exist or we don't have access
      console.error(`❌ Storage bucket ${bucketId} not found or inaccessible.`);
      console.log(`
      Please create a storage bucket in the Appwrite console with the following details:
      
      1. Bucket ID: ${bucketId}
      2. Name: "Media Storage"
      3. Permissions: Allow "Any" role for all operations (Create, Read, Update, Delete)
      4. Allowed file extensions: Allow all image and video formats
      
      After creating the bucket, restart the application.
      `);
      return false;
    }
  } catch (error) {
    console.error("Error checking storage bucket:", error);
    return false;
  }
};
