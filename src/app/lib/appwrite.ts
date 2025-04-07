import {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
} from "appwrite";

// Initialize Appwrite client only on the client side
let client: Client;
let account: Account;
let databases: Databases;
let storage: Storage;

// Check if code is running in browser environment
if (typeof window !== 'undefined') {
  client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  // Initialize Appwrite services
  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
} else {
  // Create dummy instances for server-side that will be replaced on client
  client = new Client();
  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
}

// Database and collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTIONS = {
  SETTINGS: "settings",
  CONTENT: "content",
  MEDIA: "media",
  BLOG: "blog",
  USERS: "users",
};

// Storage bucket IDs
const BUCKETS = {
  MEDIA: process.env.NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET_ID!,
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
    // First, let's see if we can list documents in the collection
    // This will throw an error if the collection doesn't exist
    await databases.listDocuments(DATABASE_ID, collectionId);
    console.log(`Collection ${collectionId} exists and is accessible`);
    return true;
  } catch (error) {
    console.error(`Error accessing collection ${collectionId}:`, error);
    console.log(
      `Make sure collection ${collectionId} exists in the Appwrite console`
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
export const createUserAccount = async (email: string, password: string, name: string) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

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
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS,
};
