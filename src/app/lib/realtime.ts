"use client";

import { client, databases, COLLECTIONS, DATABASE_ID } from "./appwrite";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { Models } from "appwrite";

export function useRealtimeUpdates() {
  const [isConnected, setIsConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loadSettingsFromStorage, loadContentFromStorage } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run subscriptions on client-side
    if (!mounted) return;
    
    let settingsUnsubscribe: (() => void) | null = null;
    let contentUnsubscribe: (() => void) | null = null;
    let mediaUnsubscribe: (() => void) | null = null;
    
    try {
      // Subscribe to changes in settings
      settingsUnsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTIONS.SETTINGS}.documents`, (response) => {
        console.log("Realtime settings update:", response);
        setIsConnected(true);
        
        // Reload settings data when it changes
        if (response.events.includes("databases.*.collections.*.documents.*.update") || 
            response.events.includes("databases.*.collections.*.documents.*.create")) {
          loadSettingsFromStorage();
        }
      });

      // Subscribe to changes in content
      contentUnsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTIONS.CONTENT}.documents`, (response) => {
        console.log("Realtime content update:", response);
        setIsConnected(true);
        
        // Reload content data when it changes
        if (response.events.includes("databases.*.collections.*.documents.*.update") || 
            response.events.includes("databases.*.collections.*.documents.*.create")) {
          loadContentFromStorage();
        }
      });

      // Subscribe to changes in media
      mediaUnsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTIONS.MEDIA}.documents`, (response) => {
        console.log("Realtime media update:", response);
        setIsConnected(true);
        
        // Reload content data when media changes (since media is stored in content)
        if (response.events.includes("databases.*.collections.*.documents.*.update") || 
            response.events.includes("databases.*.collections.*.documents.*.create")) {
          loadContentFromStorage();
        }
      });

      setIsConnected(true);
    } catch (error) {
      console.error("Error setting up realtime subscriptions:", error);
      setIsConnected(false);
    }

    // Cleanup function to unsubscribe from all channels
    return () => {
      if (settingsUnsubscribe) settingsUnsubscribe();
      if (contentUnsubscribe) contentUnsubscribe();
      if (mediaUnsubscribe) mediaUnsubscribe();
    };
  }, [loadSettingsFromStorage, loadContentFromStorage, mounted]);

  return { isConnected };
}
