"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/app/lib/store";
import {
  watchSettings,
  watchContent,
  initializeFirestoreData,
  isFirestoreAvailable,
  isStorageAvailable,
  loadSettingsFromStorage,
  loadContentFromStorage,
} from "@/app/lib/firebase";
import { usePathname } from "next/navigation";

/**
 * This component initializes Firebase listeners on the client side
 * It's meant to be included once in the layout
 */
export default function FirebaseInit() {
  const {
    siteSettings,
    contentSettings,
    updateSiteSettings,
    updateContentSettings,
  } = useStore();
  const [initialized, setInitialized] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Get the current pathname directly
  const pathname = usePathname();

  // Check if we're on an admin page
  const isAdminPage = pathname?.includes("/admin-direct") || false;

  // Use refs to hold the latest settings without triggering re-renders
  const settingsRef = useRef(siteSettings);
  const contentRef = useRef(contentSettings);

  // Update refs when props change
  useEffect(() => {
    settingsRef.current = siteSettings;
    contentRef.current = contentSettings;
  }, [siteSettings, contentSettings]);

  // Initialize Firebase and load initial data
  useEffect(() => {
    const initializeFirebase = async () => {
      // Only run this on the client side and once
      if (typeof window === "undefined" || initialized) {
        return;
      }

      console.log("FirebaseInit: Starting Firebase initialization");
      console.log("FirebaseInit: Current path:", pathname);
      console.log("FirebaseInit: Is admin page:", isAdminPage);

      // Log Firebase configuration status
      console.log(
        "FirebaseInit: Firebase config available:",
        !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      );

      // First check if Firestore and Storage are available
      const firestoreAvailable = isFirestoreAvailable();
      const storageAvailable = isStorageAvailable();

      console.log("FirebaseInit: Firestore available:", firestoreAvailable);
      console.log("FirebaseInit: Storage available:", storageAvailable);

      if (!firestoreAvailable || !storageAvailable) {
        console.error(
          "FirebaseInit: Firebase services not available, skipping initialization"
        );
        return;
      }

      try {
        // Initialize Firebase with default data if needed
        console.log("FirebaseInit: Initializing Firebase with default data");
        await initializeFirestoreData(settingsRef.current, contentRef.current);

        // Initial load of settings and content from Storage
        console.log("FirebaseInit: Loading initial settings from Storage");
        const initialSettings = await loadSettingsFromStorage();
        if (initialSettings) {
          console.log("FirebaseInit: Initial settings loaded successfully");
          updateSiteSettings(initialSettings, false);
        }

        console.log("FirebaseInit: Loading initial content from Storage");
        const initialContent = await loadContentFromStorage();
        if (initialContent) {
          console.log("FirebaseInit: Initial content loaded successfully");
          updateContentSettings(initialContent, false);
        }

        // Set up watchers for settings and content on all pages
        console.log("FirebaseInit: Setting up Firestore watchers for changes");

        const unsubscribeSettings = watchSettings((newSettings) => {
          console.log(
            "FirebaseInit: New settings from Storage via Firestore notification:",
            Object.keys(newSettings)
          );
          // Update store without broadcasting to avoid circular updates
          updateSiteSettings(newSettings, false);
        });

        const unsubscribeContent = watchContent((newContent) => {
          console.log(
            "FirebaseInit: New content from Storage via Firestore notification:",
            Object.keys(newContent)
          );
          // Update store without broadcasting to avoid circular updates
          updateContentSettings(newContent, false);
        });

        setFirebaseReady(true);
        setInitialized(true);
        console.log("FirebaseInit: Firebase initialization complete");

        // Cleanup function
        return () => {
          if (unsubscribeSettings) unsubscribeSettings();
          if (unsubscribeContent) unsubscribeContent();
          console.log("FirebaseInit: Unsubscribed from Firestore watchers");
        };
      } catch (error) {
        console.error(
          "FirebaseInit: Error during Firebase initialization:",
          error
        );
      }
    };

    initializeFirebase();
  }, [
    updateSiteSettings,
    updateContentSettings,
    initialized,
    isAdminPage,
    pathname,
  ]);

  // Log startup status for debugging
  useEffect(() => {
    if (firebaseReady) {
      console.log("FirebaseInit: Firebase is ready and listening for changes");
    }
  }, [firebaseReady]);

  // This component doesn't render anything
  return null;
}
