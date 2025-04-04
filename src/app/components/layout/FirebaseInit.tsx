"use client";

import { useEffect, useState } from "react";
import { watchSettings, watchContent } from "@/app/lib/firebase";
import { useStore } from "@/app/lib/store";

/**
 * This component initializes Firebase listeners on the client side
 * It's meant to be included once in the layout
 */
export default function FirebaseInit() {
  const { updateSiteSettings, updateContentSettings } = useStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    
    // Set up listeners for real-time updates
    const unsubSettings = watchSettings((firestoreSettings) => {
      if (firestoreSettings) {
        console.log('Received settings update from Firestore');
        // Update the local store without broadcasting back to Firebase
        updateSiteSettings(firestoreSettings, false);
      }
    });
    
    const unsubContent = watchContent((firestoreContent) => {
      if (firestoreContent) {
        console.log('Received content update from Firestore');
        // Update the local store without broadcasting back to Firebase
        updateContentSettings(firestoreContent, false);
      }
    });
    
    console.log("Firebase real-time listeners initialized");
    setInitialized(true);
    
    // Clean up listeners on unmount
    return () => {
      unsubSettings();
      unsubContent();
      console.log("Firebase listeners cleaned up");
    };
  }, [updateSiteSettings, updateContentSettings, initialized]);

  // This component doesn't render anything visible
  return null;
} 