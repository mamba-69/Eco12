"use client";

import { client, databases, COLLECTIONS, DATABASE_ID } from "./appwrite";
import { useEffect, useState, useRef } from "react";
import { useStore } from "./store";
import { Models } from "appwrite";

export function useRealtimeUpdates() {
  const { loadSettingsFromStorage, loadContentFromStorage } = useStore();
  const [isConnected, setIsConnected] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let settingsUnsubscribe: (() => void) | undefined;
    let contentUnsubscribe: (() => void) | undefined;
    let mediaUnsubscribe: (() => void) | undefined;

    const setupSubscriptions = () => {
      try {
        console.log("Setting up Appwrite realtime subscriptions...");
        
        // Subscribe to settings changes
        settingsUnsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.SETTINGS}.documents`,
          (response) => {
            console.log("Received settings update:", response.events);
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.update"
              )
            ) {
              if (isMounted.current) {
                loadSettingsFromStorage();
              }
            }
          }
        );

        // Subscribe to content changes
        contentUnsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.CONTENT}.documents`,
          (response) => {
            console.log("Received content update:", response.events);
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.update"
              )
            ) {
              if (isMounted.current) {
                loadContentFromStorage();
              }
            }
          }
        );

        // Subscribe to media changes
        mediaUnsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.MEDIA}.documents`,
          (response) => {
            console.log("Received media update:", response.events);
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.create"
              ) ||
              response.events.includes(
                "databases.*.collections.*.documents.*.update"
              ) ||
              response.events.includes(
                "databases.*.collections.*.documents.*.delete"
              )
            ) {
              if (isMounted.current) {
                loadContentFromStorage();
              }
            }
          }
        );

        // Wait a bit and then check if we're connected
        setTimeout(() => {
          if (isMounted.current) {
            setIsConnected(true);
            console.log("Realtime subscriptions initialized successfully");
          }
        }, 1000);
      } catch (error) {
        console.error("Error setting up realtime subscriptions:", error);
        if (isMounted.current) {
          setIsConnected(false);
        }
      }
    };

    // Initial setup
    setupSubscriptions();

    // Cleanup subscriptions
    return () => {
      console.log("Cleaning up realtime subscriptions");
      if (settingsUnsubscribe) {
        try {
          settingsUnsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from settings:", error);
        }
      }
      
      if (contentUnsubscribe) {
        try {
          contentUnsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from content:", error);
        }
      }
      
      if (mediaUnsubscribe) {
        try {
          mediaUnsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from media:", error);
        }
      }
    };
  }, [loadSettingsFromStorage, loadContentFromStorage]);

  return { isConnected };
}
