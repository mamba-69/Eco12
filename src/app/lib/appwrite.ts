import {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
} from "appwrite";

// Ensure that environment variables are defined
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const MEDIA_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET_ID || "";

// Check environment variables early
if (typeof window !== "undefined") {
  if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID || !MEDIA_BUCKET_ID) {
    console.error("Appwrite environment variables missing:", {
      endpoint: !ENDPOINT ? "missing" : "set",
      projectId: !PROJECT_ID ? "missing" : "set",
      databaseId: !DATABASE_ID ? "missing" : "set",
      mediaBucketId: !MEDIA_BUCKET_ID ? "missing" : "set",
    });
  }
}

// Initialize Appwrite client only on the client side
let client: Client;
let account: Account;
let databases: Databases;
let storage: Storage;

// Check if code is running in browser environment
if (typeof window !== "undefined") {
  try {
    // Add debug logging
    console.log("Initializing Appwrite client with:", {
      endpoint: ENDPOINT ? "configured" : "missing",
      projectId: PROJECT_ID ? "configured" : "missing",
      databaseId: DATABASE_ID ? "configured" : "missing",
      bucketId: MEDIA_BUCKET_ID ? "configured" : "missing",
    });

    client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

    // Initialize Appwrite services
    account = new Account(client);
    databases = new Databases(client);
    storage = new Storage(client);

    console.log("Appwrite client initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Appwrite client:", error);

    // Create dummy/fallback instances that will show errors when used
    client = new Client();
    account = new Account(client);
    databases = new Databases(client);
    storage = new Storage(client);
  }
} else {
  // Create dummy instances for server-side that will be replaced on client
  client = new Client();
  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
}

// Database and collection IDs
const COLLECTIONS = {
  SETTINGS: "settings",
  CONTENT: "content",
  MEDIA: "media",
  BLOG: "blog",
  USERS: "users",
};

// Storage bucket IDs
const BUCKETS = {
  MEDIA: MEDIA_BUCKET_ID,
};

// MediaItem type definition
export interface MediaItem {
  id: string;
  name: string;
  url: string;
  publicId: string;
  uploadedAt: string;
  inMediaSlider?: boolean;
  type?: "image" | "video";
  description?: string;
}

// A function to check or create database collections if needed
export const ensureCollection = async (collectionId: string) => {
  try {
    console.log(`Checking collection ${collectionId}...`);

    // Validate database ID
    if (!DATABASE_ID) {
      console.error("Database ID is missing in environment configuration");
      return false;
    }

    // First, let's see if we can list documents in the collection
    // This will throw an error if the collection doesn't exist
    const documents = await databases.listDocuments(DATABASE_ID, collectionId);

    console.log(`Collection ${collectionId} exists and is accessible`);
    console.log(`Found ${documents.total} documents`);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error accessing collection ${collectionId}:`,
        error.message
      );

      // Provide more specific error information based on error type
      if (error.message.includes("not found")) {
        console.error(
          `Collection '${collectionId}' does not exist in database '${DATABASE_ID}'`
        );
      } else if (error.message.includes("permission")) {
        console.error(
          `Permission denied for collection '${collectionId}'. Check your Appwrite permissions.`
        );
      } else if (error.message.includes("Network")) {
        console.error(
          "Network error accessing Appwrite. Check your internet connection."
        );
      }
    } else {
      console.error(
        `Unknown error accessing collection ${collectionId}:`,
        error
      );
    }

    console.log(
      `Make sure collection ${collectionId} exists in the Appwrite console with "any" permissions for document operations.`
    );
    return false;
  }
};

// Media Functions (replacing Firebase functions)
export const uploadMediaFromUrl = async (
  url: string,
  name: string,
  type: "image" | "video",
  description: string = "",
  inMediaSlider: boolean = false,
  contentSettings: any
) => {
  try {
    // First, download the file from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch media from URL: ${response.statusText}`);
    }

    // Convert to blob for upload
    const blob = await response.blob();

    // Create a File object for Appwrite
    const file = new File([blob], name, { type: blob.type });

    // Upload to Appwrite Storage
    const uploadedFile = await storage.createFile(
      BUCKETS.MEDIA,
      ID.unique(),
      file
    );

    // Get file URL
    const fileUrl = storage.getFileView(BUCKETS.MEDIA, uploadedFile.$id);

    // Create a new media item
    const newMediaItem: MediaItem = {
      id: uploadedFile.$id,
      name: name,
      url: fileUrl.toString(),
      publicId: uploadedFile.$id,
      uploadedAt: new Date().toISOString(),
      type: type,
      description: description,
      inMediaSlider: inMediaSlider,
    };

    // Add to content settings
    const currentMediaItems = contentSettings?.media?.images || [];
    const updatedMediaItems = [...currentMediaItems, newMediaItem];

    // Update content settings in Appwrite
    await updateDocument(COLLECTIONS.CONTENT, "main", {
      media: JSON.stringify({ images: updatedMediaItems }),
    });

    return newMediaItem;
  } catch (error) {
    console.error("Error uploading media from URL:", error);
    throw error;
  }
};

export const deleteMediaItem = async (
  mediaItem: MediaItem,
  contentSettings: any
) => {
  try {
    // Delete file from storage
    await storage.deleteFile(BUCKETS.MEDIA, mediaItem.publicId);

    // Remove from content settings
    const currentMediaItems = contentSettings?.media?.images || [];
    const updatedMediaItems = currentMediaItems.filter(
      (item: MediaItem) => item.id !== mediaItem.id
    );

    // Update content settings in Appwrite
    await updateDocument(COLLECTIONS.CONTENT, "main", {
      media: JSON.stringify({ images: updatedMediaItems }),
    });

    return true;
  } catch (error) {
    console.error("Error deleting media item:", error);
    throw error;
  }
};

// Authentication functions
export const createUserAccount = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;

    const session = await signInUser(email, password);

    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const session = await account.createSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Database functions
export const getDocument = async (collectionId: string, documentId: string) => {
  try {
    return await databases.getDocument(DATABASE_ID, collectionId, documentId);
  } catch (error) {
    console.error("Get document error:", error);
    throw error;
  }
};

export const createDocument = async (
  collectionId: string,
  data: any,
  documentId: string = ID.unique()
) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data
    );
  } catch (error) {
    console.error("Create document error:", error);
    throw error;
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: any
) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data
    );
  } catch (error) {
    console.error("Update document error:", error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionId: string,
  documentId: string
) => {
  try {
    await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
  } catch (error) {
    console.error("Delete document error:", error);
    throw error;
  }
};

// Storage functions
export const uploadFile = async (
  file: File,
  bucketId: string = BUCKETS.MEDIA
) => {
  try {
    return await storage.createFile(bucketId, ID.unique(), file);
  } catch (error) {
    console.error("Upload file error:", error);
    throw error;
  }
};

export const getFilePreview = (
  fileId: string,
  bucketId: string = BUCKETS.MEDIA
) => {
  return storage.getFilePreview(bucketId, fileId);
};

export const deleteFile = async (
  fileId: string,
  bucketId: string = BUCKETS.MEDIA
) => {
  try {
    await storage.deleteFile(bucketId, fileId);
  } catch (error) {
    console.error("Delete file error:", error);
    throw error;
  }
};

// Export constants and services
export {
  client,
  account,
  databases,
  storage,
  COLLECTIONS,
  BUCKETS,
};
