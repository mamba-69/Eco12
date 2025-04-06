// Firebase configuration for Eco-Expert Recycling
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  enableIndexedDbPersistence,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

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

// Document references
export const siteSettingsDoc = doc(settingsCollection, "site");
export const contentSettingsDoc = doc(contentCollection, "site");

// Create a type for the callback function
export type SettingsCallback = (settings: SiteSettings) => void;
export type ContentCallback = (content: ContentSettings) => void;

/**
 * Save site settings to Firestore
 */
export async function saveSettingsToFirestore(settings: SiteSettings) {
  try {
    const settingsRef = doc(db, "settings", "site");
    const timestamp = Timestamp.now();

    // Log the settings we're about to save
    console.log("Saving settings to Firestore:", settings);

    await setDoc(settingsRef, {
      ...settings,
      updatedAt: timestamp,
    });

    console.log("Settings saved to Firestore successfully");
    return true;
  } catch (error) {
    console.error("Error saving settings to Firestore:", error);
    return false;
  }
}

/**
 * Save content settings to Firestore
 */
export async function saveContentToFirestore(content: ContentSettings) {
  try {
    const contentRef = doc(db, "content", "site");
    const timestamp = Timestamp.now();

    // Log the content we're about to save
    console.log("Saving content to Firestore:", content);

    await setDoc(contentRef, {
      ...content,
      updatedAt: timestamp,
    });

    console.log("Content saved to Firestore successfully");
    return true;
  } catch (error) {
    console.error("Error saving content to Firestore:", error);
    return false;
  }
}

/**
 * Watch for settings changes
 * @param callback Function to call when settings change
 */
export function watchSettings(callback: SettingsCallback) {
  const settingsRef = doc(db, "settings", "site");

  console.log("Setting up settings watcher on Firestore");

  return onSnapshot(
    settingsRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SiteSettings;
        console.log("Settings updated in Firestore:", data);
        callback(data);
      } else {
        console.log("No settings document found in Firestore");
      }
    },
    (error) => {
      console.error("Error watching settings in Firestore:", error);
    }
  );
}

/**
 * Watch for content changes
 * @param callback Function to call when content changes
 */
export function watchContent(callback: ContentCallback) {
  const contentRef = doc(db, "content", "site");

  return onSnapshot(
    contentRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ContentSettings;
        console.log("Content updated in Firestore:", data);
        callback(data);
      } else {
        console.log("No content document found in Firestore");
      }
    },
    (error) => {
      console.error("Error watching content in Firestore:", error);
    }
  );
}

export { app, db, storage };

// Helper function to check if Firestore is available
export function isFirestoreAvailable() {
  return typeof window !== "undefined" && !!getApps().length;
}

// Initialize Firestore with default data if needed
export async function initializeFirestoreData(
  defaultSettings: SiteSettings,
  defaultContent: ContentSettings
) {
  try {
    const settingsRef = doc(db, "settings", "site");
    const contentRef = doc(db, "content", "site");

    const settingsDoc = await getDoc(settingsRef);
    if (!settingsDoc.exists()) {
      console.log("Initializing default settings in Firestore");
      await saveSettingsToFirestore(defaultSettings);
    }

    const contentDoc = await getDoc(contentRef);
    if (!contentDoc.exists()) {
      console.log("Initializing default content in Firestore");
      await saveContentToFirestore(defaultContent);
    }

    return true;
  } catch (error) {
    console.error("Error initializing Firestore data:", error);
    return false;
  }
}
