// Firebase configuration for Eco-Expert Recycling
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  enableIndexedDbPersistence,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Replace with your actual Firebase config from Firebase Console
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC-ecoexpert-example-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "eco-expert-recycling.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "eco-expert-recycling",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "eco-expert-recycling.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:123456789012:web:abcdef1234567890abcdef",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-EXAMPLE123",
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

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
export const contentSettingsDoc = doc(contentCollection, "main");

/**
 * Save site settings to Firestore
 */
export async function saveSettingsToFirestore(settings: any) {
  try {
    // First get the current document to merge with new settings
    const docSnap = await getDoc(siteSettingsDoc);
    const currentData = docSnap.exists() ? docSnap.data() : {};

    // Get admin email from localStorage (client-side only)
    const adminEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("admin-email") || "unknown"
        : "unknown";

    // Merge current data with new settings
    const updatedData = {
      ...currentData,
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    };

    // Save to Firestore
    await setDoc(siteSettingsDoc, updatedData, { merge: true });
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
export async function saveContentToFirestore(content: any) {
  try {
    // First get the current document to merge with new content
    const docSnap = await getDoc(contentSettingsDoc);
    const currentData = docSnap.exists() ? docSnap.data() : {};

    // Get admin email from localStorage (client-side only)
    const adminEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("admin-email") || "unknown"
        : "unknown";

    // Merge current data with new content
    const updatedData = {
      ...currentData,
      ...content,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    };

    // Save to Firestore
    await setDoc(contentSettingsDoc, updatedData, { merge: true });
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
export function watchSettings(callback: (data: any) => void) {
  try {
    return onSnapshot(
      siteSettingsDoc,
      // Success handler
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log(
            "Settings updated in Firestore:",
            docSnapshot.metadata.hasPendingWrites ? "Local" : "Server"
          );
          callback(data);
        }
      },
      // Error handler
      (error) => {
        console.error("Error watching settings:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up settings watcher:", error);
    // Return a no-op unsubscribe function
    return () => {};
  }
}

/**
 * Watch for content changes
 * @param callback Function to call when content changes
 */
export function watchContent(callback: (data: any) => void) {
  try {
    return onSnapshot(
      contentSettingsDoc,
      // Success handler
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log(
            "Content updated in Firestore:",
            docSnapshot.metadata.hasPendingWrites ? "Local" : "Server"
          );
          callback(data);
        }
      },
      // Error handler
      (error) => {
        console.error("Error watching content:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up content watcher:", error);
    // Return a no-op unsubscribe function
    return () => {};
  }
}
