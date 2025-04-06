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
        console.log("Received settings change via BroadcastChannel:", data);

        // Notify all listeners
        listeners.forEach((listener) => {
          listener({
            settings: data.settings,
            contentSettings: data.contentSettings,
            source: data.source,
          });
        });
      }
    };

    console.log("SiteBridge initialized with BroadcastChannel");
  } catch (error) {
    console.error("Failed to initialize BroadcastChannel:", error);
    // Fallback could be implemented here if needed
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
  if (channel) {
    try {
      const message: SettingsChangeMessage = {
        type: "settings-change",
        settings: data.settings,
        contentSettings: data.contentSettings,
        source: data.source,
      };

      console.log("Broadcasting settings change:", message);
      channel.postMessage(message);

      // Also notify local listeners directly
      listeners.forEach((listener) => {
        listener(data);
      });
    } catch (error) {
      console.error("Error broadcasting settings change:", error);
    }
  } else {
    console.warn("BroadcastChannel not available, local notification only");

    // Fallback to just local notification
    listeners.forEach((listener) => {
      listener(data);
    });
  }
}

/**
 * Performance-optimized hook to listen for settings changes
 */
export function useSettingsChangeListener(callback: SettingsChangeListener) {
  // Register the listener when the component mounts
  if (typeof window !== "undefined") {
    // Add listener if it doesn't already exist
    if (!listeners.includes(callback)) {
      listeners.push(callback);
    }

    // Return cleanup function to remove listener
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // Return no-op cleanup for SSR
  return () => {};
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
