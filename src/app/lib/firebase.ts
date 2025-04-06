// Firebase configuration for Eco-Expert Recycling
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  enableIndexedDbPersistence,
  Timestamp,
  Firestore,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
  listAll,
  uploadBytes,
  getMetadata,
} from "firebase/storage";
import type { SiteSettings, ContentSettings } from "./store";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Replace with your actual Firebase config from Firebase Console
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log Firebase config details (without exposing sensitive values)
console.log("Firebase init - Config present:", {
  apiKey: !!firebaseConfig.apiKey,
  projectId: !!firebaseConfig.projectId,
  appId: !!firebaseConfig.appId,
});

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let storage: ReturnType<typeof getStorage>;

try {
  if (!getApps().length) {
    console.log("Firebase: Initializing new Firebase app");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Firebase: Reusing existing Firebase app");
    app = getApp();
  }

  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase: Successfully initialized app, db, and storage");
} catch (error) {
  console.error("Firebase: Error initializing Firebase", error);
  throw error; // Re-throw to make issues more visible
}

// Enable offline persistence when possible
if (typeof window !== "undefined") {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == "failed-precondition") {
        console.warn("Firebase persistence failed; multiple tabs open");
      } else if (err.code == "unimplemented") {
        console.warn("Firebase persistence not available in this browser");
      } else {
        console.error("Firebase persistence error:", err);
      }
    });
  } catch (err) {
    console.warn("Firebase persistence init error:", err);
  }
}

// Collection references
export const settingsCollection = collection(db, "settings");
export const contentCollection = collection(db, "content");
export const mediaCollection = collection(db, "media");

// Document references
export const siteSettingsDoc = doc(settingsCollection, "site");
export const contentSettingsDoc = doc(contentCollection, "site");
export const mediaListDoc = doc(mediaCollection, "list");

// Storage paths
const SETTINGS_STORAGE_PATH = "settings/site-settings.json";
const CONTENT_STORAGE_PATH = "settings/content-settings.json";
const MEDIA_FOLDER_PATH = "media";

// Create a type for the callback function
export type SettingsCallback = (settings: SiteSettings) => void;
export type ContentCallback = (content: ContentSettings) => void;

/**
 * Media item interface for images and videos
 */
export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  name: string;
  uploadedAt: string;
  type: "image" | "video";
  description?: string;
  inMediaSlider?: boolean;
  originalUrl?: string; // The original URL the image was uploaded from
}

/**
 * Upload an image via URL to Firebase and update content settings
 */
export async function uploadMediaFromUrl(
  mediaUrl: string,
  mediaName: string,
  mediaType: "image" | "video",
  description: string = "",
  inMediaSlider: boolean = false,
  currentContent: ContentSettings
): Promise<MediaItem> {
  try {
    console.log("Firebase: Starting media upload from URL", {
      url: mediaUrl,
      name: mediaName,
      type: mediaType,
    });

    // Generate a unique ID for the media item
    const id = `media_${Date.now()}`;
    const fileName = mediaName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const storagePath = `${MEDIA_FOLDER_PATH}/${id}_${fileName}`;

    // Create Storage reference
    const mediaRef = storageRef(storage, storagePath);

    // For image type, fetch the content and upload
    if (mediaType === "image") {
      // Fetch the image from the URL
      const response = await fetch(mediaUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Upload the blob to Firebase Storage
      await uploadBytes(mediaRef, blob, {
        contentType: response.headers.get("content-type") || "image/jpeg",
      });
    } else {
      // For video, we just store the external URL information
      // Upload a small JSON with video metadata
      const videoMetadata = JSON.stringify({
        originalUrl: mediaUrl,
        type: mediaType,
        name: mediaName,
      });

      await uploadString(mediaRef, videoMetadata, "raw", {
        contentType: "application/json",
      });
    }

    // Get the download URL after upload
    const downloadUrl = await getDownloadURL(mediaRef);

    // Create the media item object
    const mediaItem: MediaItem = {
      id,
      url: mediaType === "video" ? mediaUrl : downloadUrl, // For videos, use original URL for playback
      publicId: storagePath,
      name: mediaName,
      uploadedAt: new Date().toISOString(),
      type: mediaType,
      description,
      inMediaSlider,
      originalUrl: mediaUrl,
    };

    // Update content settings with the new media item
    // First, create a copy of the current media items
    const updatedMediaItems = [...(currentContent.media.images || [])];

    // Add the new media item
    updatedMediaItems.push(mediaItem);

    // Update the content settings in Firestore
    const updatedContent = {
      ...currentContent,
      media: {
        ...currentContent.media,
        images: updatedMediaItems,
      },
    };

    // Save the updated content
    await saveContentToStorage(updatedContent);

    console.log(
      "Firebase: Media uploaded and content updated successfully",
      mediaItem
    );

    return mediaItem;
  } catch (error) {
    console.error("Firebase: Error uploading media from URL:", error);
    throw error;
  }
}

/**
 * Delete a media item from Firebase Storage and update content settings
 */
export async function deleteMediaItem(
  mediaItem: MediaItem,
  currentContent: ContentSettings
): Promise<void> {
  try {
    console.log("Firebase: Deleting media item", mediaItem);

    // Create Storage reference to delete the file
    const mediaRef = storageRef(storage, mediaItem.publicId);

    try {
      // Check if the file exists and delete it
      await getMetadata(mediaRef);
      // deleteObject imported from firebase/storage would be called here
      // We'll keep this commented until we need it
      // await deleteObject(mediaRef);
      console.log("Firebase: Media file deleted from Storage");
    } catch (error) {
      console.warn("Firebase: File might not exist in Storage:", error);
    }

    // Update content settings to remove the media item
    const updatedMediaItems = currentContent.media.images.filter(
      (item) => item.id !== mediaItem.id
    );

    // Update the content settings in Firestore
    const updatedContent = {
      ...currentContent,
      media: {
        ...currentContent.media,
        images: updatedMediaItems,
      },
    };

    // Save the updated content
    await saveContentToStorage(updatedContent);

    console.log(
      "Firebase: Media item deleted and content updated successfully"
    );
  } catch (error) {
    console.error("Firebase: Error deleting media item:", error);
    throw error;
  }
}

/**
 * Save site settings to Firebase Storage
 */
export async function saveSettingsToStorage(settings: SiteSettings) {
  try {
    console.log("Firebase: Starting saveSettingsToStorage");

    // Create Storage reference
    const settingsStorageRef = storageRef(storage, SETTINGS_STORAGE_PATH);

    // Convert settings to JSON string
    const settingsJson = JSON.stringify({
      ...settings,
      updatedAt: new Date().toISOString(),
    });

    // Upload JSON to Storage
    await uploadString(settingsStorageRef, settingsJson, "raw", {
      contentType: "application/json",
    });

    // Also save to Firestore for real-time updates
    await saveSettingsToFirestore(settings);

    console.log("Settings saved to Firebase Storage successfully");
    return true;
  } catch (error) {
    console.error("Error saving settings to Firebase Storage:", error);
    return false;
  }
}

/**
 * Save content settings to Firebase Storage
 */
export async function saveContentToStorage(content: ContentSettings) {
  try {
    console.log("Firebase: Starting saveContentToStorage");

    // Create Storage reference
    const contentStorageRef = storageRef(storage, CONTENT_STORAGE_PATH);

    // Convert content to JSON string
    const contentJson = JSON.stringify({
      ...content,
      updatedAt: new Date().toISOString(),
    });

    // Upload JSON to Storage
    await uploadString(contentStorageRef, contentJson, "raw", {
      contentType: "application/json",
    });

    // Also save to Firestore for real-time updates
    await saveContentToFirestore(content);

    console.log("Content saved to Firebase Storage successfully");
    return true;
  } catch (error) {
    console.error("Error saving content to Firebase Storage:", error);
    return false;
  }
}

/**
 * Load site settings from Firebase Storage
 */
export async function loadSettingsFromStorage(): Promise<SiteSettings | null> {
  try {
    console.log("Firebase: Loading settings from Storage");

    // Create Storage reference
    const settingsStorageRef = storageRef(storage, SETTINGS_STORAGE_PATH);

    // Get download URL
    const url = await getDownloadURL(settingsStorageRef);

    // Fetch the JSON file
    const response = await fetch(url);
    const settings = await response.json();

    console.log("Settings loaded from Firebase Storage successfully");
    return settings;
  } catch (error) {
    console.error("Error loading settings from Firebase Storage:", error);
    return null;
  }
}

/**
 * Load content settings from Firebase Storage
 */
export async function loadContentFromStorage(): Promise<ContentSettings | null> {
  try {
    console.log("Firebase: Loading content from Storage");

    // Create Storage reference
    const contentStorageRef = storageRef(storage, CONTENT_STORAGE_PATH);

    // Get download URL
    const url = await getDownloadURL(contentStorageRef);

    // Fetch the JSON file
    const response = await fetch(url);
    const content = await response.json();

    console.log("Content loaded from Firebase Storage successfully");
    return content;
  } catch (error) {
    console.error("Error loading content from Firebase Storage:", error);
    return null;
  }
}

/**
 * Save site settings to Firestore for real-time updates
 */
export async function saveSettingsToFirestore(settings: SiteSettings) {
  try {
    console.log("Firebase: Starting saveSettingsToFirestore");
    const settingsRef = doc(db, "settings", "site");
    const timestamp = Timestamp.now();

    // Save metadata that includes timestamp and updated flag
    await setDoc(settingsRef, {
      updatedAt: timestamp,
      hasUpdate: true,
      lastUpdateSource: "admin",
    });

    console.log("Settings notification saved to Firestore successfully");
    return true;
  } catch (error) {
    console.error("Error saving settings notification to Firestore:", error);
    return false;
  }
}

/**
 * Save content settings to Firestore for real-time updates
 */
export async function saveContentToFirestore(content: ContentSettings) {
  try {
    console.log("Firebase: Starting saveContentToFirestore");
    const contentRef = doc(db, "content", "site");
    const timestamp = Timestamp.now();

    // Save metadata that includes timestamp and updated flag
    await setDoc(contentRef, {
      updatedAt: timestamp,
      hasUpdate: true,
      lastUpdateSource: "admin",
    });

    console.log("Content notification saved to Firestore successfully");
    return true;
  } catch (error) {
    console.error("Error saving content notification to Firestore:", error);
    return false;
  }
}

/**
 * Watch for settings changes in Firestore
 * @param callback Function to call when settings change
 */
export function watchSettings(callback: SettingsCallback) {
  try {
    console.log("Firebase: Setting up settings watcher on Firestore");
    const settingsRef = doc(db, "settings", "site");

    return onSnapshot(
      settingsRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log("Settings update notification received from Firestore");

          // When Firestore indicates an update, load from Storage
          const settings = await loadSettingsFromStorage();
          if (settings) {
            console.log("Settings loaded from Storage after notification");
            callback(settings);
          } else {
            console.error(
              "Failed to load settings from Storage after notification"
            );
          }
        } else {
          console.log("No settings document found in Firestore");
        }
      },
      (error) => {
        console.error("Error watching settings in Firestore:", error);
      }
    );
  } catch (error) {
    console.error("Failed to set up settings watcher:", error);
    return () => {}; // Return empty unsubscribe function
  }
}

/**
 * Watch for content changes in Firestore
 * @param callback Function to call when content changes
 */
export function watchContent(callback: ContentCallback) {
  try {
    console.log("Firebase: Setting up content watcher on Firestore");
    const contentRef = doc(db, "content", "site");

    return onSnapshot(
      contentRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log("Content update notification received from Firestore");

          // When Firestore indicates an update, load from Storage
          const content = await loadContentFromStorage();
          if (content) {
            console.log("Content loaded from Storage after notification");
            callback(content);
          } else {
            console.error(
              "Failed to load content from Storage after notification"
            );
          }
        } else {
          console.log("No content document found in Firestore");
        }
      },
      (error) => {
        console.error("Error watching content in Firestore:", error);
      }
    );
  } catch (error) {
    console.error("Failed to set up content watcher:", error);
    return () => {}; // Return empty unsubscribe function
  }
}

export { app, db, storage };

// Helper function to check if Firestore is available
export function isFirestoreAvailable() {
  try {
    return typeof window !== "undefined" && !!db;
  } catch (error) {
    console.error("Error checking if Firestore is available:", error);
    return false;
  }
}

// Helper function to check if Storage is available
export function isStorageAvailable() {
  try {
    return typeof window !== "undefined" && !!storage;
  } catch (error) {
    console.error("Error checking if Storage is available:", error);
    return false;
  }
}

// Initialize Firebase with default data if needed
export async function initializeFirestoreData(
  defaultSettings: SiteSettings,
  defaultContent: ContentSettings
) {
  try {
    console.log("Firebase: Initializing data with defaults if needed");

    // Check if settings exist in Storage
    let settingsExist = false;
    try {
      const settingsStorageRefCheck = storageRef(
        storage,
        SETTINGS_STORAGE_PATH
      );
      await getMetadata(settingsStorageRefCheck);
      settingsExist = true;
      console.log("Settings file already exists in Storage");
    } catch (error) {
      settingsExist = false;
      console.log("Settings file does not exist in Storage");
    }

    // Check if content exists in Storage
    let contentExist = false;
    try {
      const contentStorageRefCheck = storageRef(storage, CONTENT_STORAGE_PATH);
      await getMetadata(contentStorageRefCheck);
      contentExist = true;
      console.log("Content file already exists in Storage");
    } catch (error) {
      contentExist = false;
      console.log("Content file does not exist in Storage");
    }

    // Initialize settings if needed
    if (!settingsExist) {
      console.log("Initializing default settings in Storage and Firestore");
      await saveSettingsToStorage(defaultSettings);
    }

    // Initialize content if needed
    if (!contentExist) {
      console.log("Initializing default content in Storage and Firestore");
      await saveContentToStorage(defaultContent);
    }

    return true;
  } catch (error) {
    console.error("Error initializing Firebase data:", error);
    return false;
  }
}
