/**
 * SiteBridge Module - Lightweight communication between admin and client components
 * Optimized for performance with minimal overhead
 */

import { useEffect, useState, useCallback } from "react";
import type { SiteSettings, ContentSettings } from "./store";

// Custom event name
const SETTINGS_CHANGED = "site-settings-changed";




// Define the types for messages sent over the channel
interface SettingsChangeMessage {
  type: "settings-change";
  settings?: Partial<SiteSettings>;
  contentSettings?: Partial<ContentSettings>;
  source: "admin" | "client";
}

// Create a type for the callback function
type SettingsChangeListener = (data: {
  settings?: Partial<SiteSettings>;
  contentSettings?: Partial<ContentSettings>;
  source: string;
}) => void;

// Store active listeners
const listeners: SettingsChangeListener[] = [];

// Initialize the broadcast channel
let channel: BroadcastChannel | null = null;

// Initialize the channel if in browser environment
if (typeof window !== "undefined") {
  try {
    channel = new BroadcastChannel("eco-expert-settings");

    // Listen for messages
    channel.onmessage = (event) => {
      const data = event.data as SettingsChangeMessage;

      if (data.type === "settings-change") {
        console.log(
          "SiteBridge: Received settings change via BroadcastChannel:",
          data
        );

        // Notify all listeners
        listeners.forEach((listener) => {
          try {
            listener({
              settings: data.settings,
              contentSettings: data.contentSettings,
              source: data.source,
            });
          } catch (error) {
            console.error("SiteBridge: Error in listener callback:", error);
          }
        });
      }
    };

    console.log("SiteBridge: Successfully initialized with BroadcastChannel");
  } catch (error) {
    console.error("SiteBridge: Failed to initialize BroadcastChannel:", error);

    // Create a fallback mechanism using localStorage
    window.addEventListener("storage", (event) => {
      if (event.key === "eco-expert-settings-bridge") {
        try {
          const data = JSON.parse(
            event.newValue || "{}"
          ) as SettingsChangeMessage;
          if (data.type === "settings-change") {
            console.log(
              "SiteBridge: Received settings change via localStorage:",
              data
            );

            listeners.forEach((listener) => {
              try {
                listener({
                  settings: data.settings,
                  contentSettings: data.contentSettings,
                  source: data.source,
                });
              } catch (error) {
                console.error(
                  "SiteBridge: Error in fallback listener callback:",
                  error
                );
              }
            });
          }
        } catch (error) {
          console.error(
            "SiteBridge: Error processing localStorage event:",
            error
          );
        }
      }
    });

    console.log("SiteBridge: Fallback to localStorage initialized");
  }
}

/**
 * Broadcast settings changes to all connected components
 * @param data The settings data to broadcast
 */
export function broadcastSettingsChange(
  type: "siteSettings" | "contentSettings",
  data: any
) {
  const message: SettingsChangeMessage = {
    type: "settings-change",
    source: "admin",
  };

  if (type === "siteSettings") {
    message.settings = data;
  } else if (type === "contentSettings") {
    message.contentSettings = data;
  }

  // Try to use BroadcastChannel first
  if (channel) {
    try {
      channel.postMessage(message);
      console.log("SiteBridge: Settings change broadcast via BroadcastChannel");
      return;
    } catch (error) {
      console.error("SiteBridge: Error using BroadcastChannel:", error);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "eco-expert-settings-bridge",
        JSON.stringify(message)
      );
      console.log("SiteBridge: Settings change broadcast via localStorage");
    } catch (error) {
      console.error("SiteBridge: Error using localStorage fallback:", error);
    }
  }
}

/**
 * Hook to listen for settings changes
 * @param callback Function to call when settings change
 */
export function useSettingsChangeListener(callback: SettingsChangeListener) {
  useEffect(() => {
    // Add the callback to the listeners array
    listeners.push(callback);

    // Clean up when the component unmounts
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, [callback]);
}

/**
 * Debounce function to limit how often a function can be called
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Hook to force a refresh of the component
 */
export function useForceRefresh() {
  const [, setTick] = useState(0);
  
  const refresh = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  
  return refresh;
}

// Close the channel when the page unloads
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (channel) {
      channel.close();
    }
  });
}
