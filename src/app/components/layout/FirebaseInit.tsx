"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/app/lib/store";
import {
  watchSettings,
  watchContent,
  initializeFirestoreData,
  isFirestoreAvailable,
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

  useEffect(() => {
    // Only run this on the client side and once
    if (typeof window !== "undefined" && !initialized) {
      console.log("FirebaseInit: Initializing with current path:", pathname);
      console.log("FirebaseInit: Is admin page:", isAdminPage);

      // First check if Firestore is available
      if (isFirestoreAvailable()) {
        // Initialize Firestore with default data if needed
        initializeFirestoreData(settingsRef.current, contentRef.current)
          .then(() => {
            console.log(
              "FirebaseInit: Firestore initialized with default data if needed"
            );

            // Never set up Firestore watchers on admin pages to avoid conflicts
            if (isAdminPage) {
              console.log(
                "FirebaseInit: Admin page detected, skipping watchers"
              );
              setInitialized(true);
              return;
            }

            // Set up watchers for settings and content only on non-admin pages
            const unsubscribeSettings = watchSettings((newSettings) => {
              console.log(
                "FirebaseInit: New settings from Firestore:",
                newSettings
              );
              // Update store without broadcasting to avoid circular updates
              updateSiteSettings(newSettings, false);
            });

            const unsubscribeContent = watchContent((newContent) => {
              console.log(
                "FirebaseInit: New content from Firestore:",
                newContent
              );
              // Update store without broadcasting to avoid circular updates
              updateContentSettings(newContent, false);
            });

            setInitialized(true);

            // Cleanup function
            return () => {
              if (unsubscribeSettings) unsubscribeSettings();
              if (unsubscribeContent) unsubscribeContent();
              console.log("FirebaseInit: Unsubscribed from Firestore watchers");
            };
          })
          .catch((error) => {
            console.error("FirebaseInit: Error initializing Firestore:", error);
          });
      } else {
        console.log(
          "FirebaseInit: Firestore not available, skipping initialization"
        );
      }
    }
  }, [
    updateSiteSettings,
    updateContentSettings,
    initialized,
    isAdminPage,
    pathname,
  ]);

  // This component doesn't render anything
  return null;
}
