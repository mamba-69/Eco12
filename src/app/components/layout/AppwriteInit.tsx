"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/app/lib/store";
import {
  databases,
  COLLECTIONS,
  DATABASE_ID,
  client,
  createDocument,
  ensureCollection,
} from "@/app/lib/appwrite";
import { useRealtimeUpdates } from "@/app/lib/realtime";
import { defaultContentSettings, defaultSiteSettings } from "@/app/lib/store";

export default function AppwriteInit() {
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [collectionsAvailable, setCollectionsAvailable] = useState(false);
  const { loadSettingsFromStorage, loadContentFromStorage } = useStore();

  // First, ensure we're only running on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug appwrite configuration only when mounted on client
  useEffect(() => {
    if (!mounted) return;

    console.log("Appwrite Configuration:");
    console.log("DATABASE_ID:", DATABASE_ID);
    console.log("COLLECTIONS:", COLLECTIONS);
    console.log("Client Configured:", !!client);
  }, [mounted]);

  // Check collections after mounting
  useEffect(() => {
    if (!mounted) return;

    const checkCollections = async () => {
      try {
        console.log("Checking collections...");
        const settingsCollection = await ensureCollection(COLLECTIONS.SETTINGS);
        const contentCollection = await ensureCollection(COLLECTIONS.CONTENT);
        const mediaCollection = await ensureCollection(COLLECTIONS.MEDIA);

        if (settingsCollection && contentCollection && mediaCollection) {
          console.log("All collections are available");
          setCollectionsAvailable(true);
        } else {
          setError(
            "Some collections are missing. Please check the Appwrite console and make sure the collections are created."
          );
        }
      } catch (err) {
        console.error("Error checking collections:", err);
        setError(
          "Failed to check collections. Please check your Appwrite configuration."
        );
      }
    };

    checkCollections();
  }, [mounted]);

  // Initialize real-time updates with connection status
  const { isConnected } = useRealtimeUpdates();

  // Check WebSocket connection
  useEffect(() => {
    if (!mounted) return;

    if (!isConnected && initialized && retryCount < 3) {
      console.log("WebSocket connection failed, retrying...");
      // Wait a bit before retrying
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setInitialized(false); // This will trigger reinitialization
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isConnected, initialized, retryCount, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (!collectionsAvailable) return;
    if (initialized) return;

    const initializeData = async () => {
      try {
        console.log("Initializing Appwrite data...");

        // Force create settings document
        await forceCreateDocuments();

        // Then load settings from storage
        await loadSettingsFromStorage();
        await loadContentFromStorage();

        setInitialized(true);
        setError(null);
        console.log("Appwrite data initialized successfully");
      } catch (err) {
        console.error("Error initializing Appwrite data:", err);
        setError("Failed to initialize data. Please refresh the page.");
      }
    };

    initializeData();
  }, [
    loadSettingsFromStorage,
    loadContentFromStorage,
    initialized,
    collectionsAvailable,
    mounted,
  ]);

  // Function to force create initial documents
  const forceCreateDocuments = async () => {
    console.log("Forcing creation of initial documents...");

    try {
      // Check for settings document
      try {
        await databases.getDocument(DATABASE_ID, COLLECTIONS.SETTINGS, "main");
        console.log("Settings document exists");
      } catch (error) {
        console.log("Creating settings document", error);
        // Serialize the settings object for Appwrite
        const serializedSettings: Record<string, any> = {};
        for (const [key, value] of Object.entries(defaultSiteSettings)) {
          if (typeof value === "object") {
            serializedSettings[key] = JSON.stringify(value);
          } else {
            serializedSettings[key] = value;
          }
        }

        // Log what we're trying to create
        console.log("Attempting to create settings document with ID: main");
        console.log("Collection ID:", COLLECTIONS.SETTINGS);
        console.log("Database ID:", DATABASE_ID);

        try {
          // Create settings document
          const result = await createDocument(
            COLLECTIONS.SETTINGS,
            serializedSettings,
            "main"
          );
          console.log("Settings document created successfully:", result);
        } catch (createError) {
          console.error("Failed to create settings document:", createError);
        }
      }

      // Check for content document
      try {
        await databases.getDocument(DATABASE_ID, COLLECTIONS.CONTENT, "main");
        console.log("Content document exists");
      } catch (error) {
        console.log("Creating content document", error);
        // Serialize the content object for Appwrite
        const serializedContent: Record<string, any> = {};
        for (const [key, value] of Object.entries(defaultContentSettings)) {
          if (typeof value === "object") {
            serializedContent[key] = JSON.stringify(value);
          } else {
            serializedContent[key] = value;
          }
        }

        // Log what we're trying to create
        console.log("Attempting to create content document with ID: main");
        console.log("Collection ID:", COLLECTIONS.CONTENT);

        try {
          // Create content document
          const result = await createDocument(
            COLLECTIONS.CONTENT,
            serializedContent,
            "main"
          );
          console.log("Content document created successfully:", result);
        } catch (createError) {
          console.error("Failed to create content document:", createError);
        }
      }
    } catch (error) {
      console.error("Error creating initial documents:", error);
      throw error;
    }
  };

  // If not mounted, don't render anything to prevent hydration mismatch
  if (!mounted) return null;

  // Display error message if initialization failed
  if (error) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
        {error}
        <button
          onClick={() => {
            setError(null);
            setInitialized(false);
            setRetryCount(0);
            setCollectionsAvailable(false);
            window.location.reload();
          }}
          className="ml-4 bg-white text-red-500 px-2 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Display loading message during initialization
  if (!initialized) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 text-center z-50">
        {!collectionsAvailable
          ? "Checking Appwrite collections..."
          : retryCount > 0
          ? `Initializing data... (Attempt ${retryCount + 1})`
          : "Initializing data..."}
      </div>
    );
  }

  return null;
}
