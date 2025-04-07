import { client, databases, COLLECTIONS, DATABASE_ID } from "./appwrite";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { Models } from "appwrite";

export function useRealtimeUpdates() {
  const { loadSettingsFromStorage, loadContentFromStorage } = useStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let settingsUnsubscribe: (() => void) | undefined;
    let contentUnsubscribe: (() => void) | undefined;
    let mediaUnsubscribe: (() => void) | undefined;

    const setupSubscriptions = () => {
      try {
        // Subscribe to settings changes
        settingsUnsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.SETTINGS}.documents`,
          (response) => {
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.update"
              )
            ) {
              loadSettingsFromStorage();
            }
          }
        );

        // Subscribe to content changes
        contentUnsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.CONTENT}.documents`,
          (response) => {
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.update"
              )
            ) {
              loadContentFromStorage();
            }
          }
        );

        // Subscribe to media changes
        mediaUnsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.MEDIA}.documents`,
          (response) => {
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
              loadContentFromStorage();
            }
          }
        );

        setIsConnected(true);
      } catch (error) {
        console.error("Error setting up realtime subscriptions:", error);
        setIsConnected(false);
      }
    };

    // Initial setup
    setupSubscriptions();

    // Cleanup subscriptions
    return () => {
      if (settingsUnsubscribe) settingsUnsubscribe();
      if (contentUnsubscribe) contentUnsubscribe();
      if (mediaUnsubscribe) mediaUnsubscribe();
    };
  }, [loadSettingsFromStorage, loadContentFromStorage]);

  return { isConnected };
}
