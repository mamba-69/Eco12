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

    console.log(
      "SiteBridge: Initialized fallback communication via localStorage"
    );
  }
}

/**
 * Broadcast settings changes efficiently
 */
export function broadcastSettingsChange(data: {
  settings?: Partial<SiteSettings>;
  contentSettings?: Partial<ContentSettings>;
  source: "admin" | "client";
}) {
  if (typeof window === "undefined") {
    console.warn("SiteBridge: Cannot broadcast in server environment");
    return;
  }

  console.log("SiteBridge: Broadcasting settings change:", data);

  const message: SettingsChangeMessage = {
    type: "settings-change",
    settings: data.settings,
    contentSettings: data.contentSettings,
    source: data.source,
  };

  // Try the BroadcastChannel first
  if (channel) {
    try {
      channel.postMessage(message);
      console.log("SiteBridge: Message sent via BroadcastChannel");
    } catch (error) {
      console.error(
        "SiteBridge: Error broadcasting via BroadcastChannel:",
        error
      );

      // Fallback to localStorage
      try {
        localStorage.setItem(
          "eco-expert-settings-bridge",
          JSON.stringify(message)
        );
        console.log("SiteBridge: Message sent via localStorage fallback");
      } catch (localStorageError) {
        console.error(
          "SiteBridge: Error broadcasting via localStorage:",
          localStorageError
        );
      }
    }
  } else {
    // No BroadcastChannel, use localStorage
    try {
      localStorage.setItem(
        "eco-expert-settings-bridge",
        JSON.stringify(message)
      );
      console.log("SiteBridge: Message sent via localStorage (primary)");
    } catch (error) {
      console.error("SiteBridge: Error broadcasting via localStorage:", error);
    }
  }

  // Always notify local listeners directly
  listeners.forEach((listener) => {
    try {
      listener(data);
    } catch (error) {
      console.error("SiteBridge: Error in local listener notification:", error);
    }
  });
}

/**
 * Performance-optimized hook to listen for settings changes
 */
export function useSettingsChangeListener(callback: SettingsChangeListener) {
  useEffect(() => {
    // Register the listener when the component mounts
    if (typeof window !== "undefined") {
      console.log("SiteBridge: Registering new settings change listener");

      // Add listener if it doesn't already exist
      if (!listeners.includes(callback)) {
        listeners.push(callback);
      }

      // Return cleanup function to remove listener
      return () => {
        console.log("SiteBridge: Removing settings change listener");
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      };
    }

    // Return no-op cleanup for SSR
    return () => {};
  }, [callback]);
}

/**
 * Simple, efficient debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Force refresh a component
 * This is useful for components that don't naturally react to store updates
 */
export function useForceRefresh() {
  const [, setForceUpdate] = useState(0);

  const forceRefresh = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  return forceRefresh;
}

// Close the channel when the page unloads
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (channel) {
      channel.close();
    }
  });
}
