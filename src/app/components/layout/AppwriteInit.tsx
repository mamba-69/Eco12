"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/app/lib/store";
import { usePathname } from "next/navigation";
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
import { createCollections } from "@/app/lib/createCollections";
import { createStorageBucket } from "@/app/lib/createStorageBucket";

export default function AppwriteInit() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [collectionsAvailable, setCollectionsAvailable] = useState(false);
  const [creatingCollections, setCreatingCollections] = useState(false);
  const [bucketAvailable, setBucketAvailable] = useState(false);
  const [creatingBucket, setCreatingBucket] = useState(false);
  const { loadSettingsFromStorage, loadContentFromStorage } = useStore();
  const isMounted = useRef(true);
  const pathname = usePathname();

  // Cleanup function to prevent updates on unmounted component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Debug appwrite configuration - silently log to console only
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const mediaBucketId = process.env.NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET_ID;

    console.log("Appwrite Configuration:");
    console.log("ENDPOINT:", endpoint);
    console.log("PROJECT_ID:", projectId);
    console.log("DATABASE_ID:", databaseId);
    console.log("MEDIA_BUCKET_ID:", mediaBucketId);

    // Check if all required environment variables are set
    if (!endpoint || !projectId || !databaseId || !mediaBucketId) {
      console.error("Missing required Appwrite environment variables!");
      setError(`Missing required Appwrite environment variables.`);
      return;
    }

    console.log("COLLECTIONS:", COLLECTIONS);
    console.log("Client Configured:", !!client);

    // Test connection
    const testConnection = async () => {
      try {
        // Simple ping to Appwrite to test connection
        if (endpoint) {
          console.log("Testing connection to Appwrite...");
          const response = await fetch(endpoint + "/ping");
          const data = await response.text();
          console.log("Appwrite connection test:", data);
        } else {
          console.error("Endpoint not configured");
        }
      } catch (error) {
        console.error("Failed to connect to Appwrite:", error);
      }
    };

    testConnection();
  }, []);

  // First, ensure collections exist
  useEffect(() => {
    const setupCollections = async () => {
      try {
        if (creatingCollections) return;

        setCreatingCollections(true);
        console.log("Setting up collections...");

        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

        if (!endpoint || !projectId || !databaseId) {
          throw new Error("Missing required Appwrite configuration");
        }

        const result = await createCollections(endpoint, projectId, databaseId);

        if (isMounted.current) {
          if (result) {
            console.log("Collections setup successful");
            setCollectionsAvailable(true);
          } else {
            setError(
              "Failed to set up collections. Please check Appwrite console."
            );
          }
          setCreatingCollections(false);
        }
      } catch (err) {
        console.error("Error setting up collections:", err);
        if (isMounted.current) {
          setError(
            "Failed to set up collections. Please check your Appwrite configuration."
          );
          setCreatingCollections(false);
        }
      }
    };

    if (!collectionsAvailable && !creatingCollections) {
      setupCollections();
    }
  }, [collectionsAvailable, creatingCollections]);

  // Check collections secondarily
  useEffect(() => {
    const checkCollections = async () => {
      if (collectionsAvailable) return;

      try {
        console.log("Double-checking collections...");
        const settingsCollection = await ensureCollection(COLLECTIONS.SETTINGS);
        const contentCollection = await ensureCollection(COLLECTIONS.CONTENT);
        const mediaCollection = await ensureCollection(COLLECTIONS.MEDIA);

        if (isMounted.current) {
          if (settingsCollection && contentCollection && mediaCollection) {
            console.log("All collections are available");
            setCollectionsAvailable(true);
          } else {
            setError(
              "Some collections are missing. Please check the Appwrite console."
            );
          }
        }
      } catch (err) {
        console.error("Error checking collections:", err);
        if (isMounted.current) {
          setError(
            "Failed to check collections. Please check your Appwrite configuration."
          );
        }
      }
    };

    if (!collectionsAvailable && !creatingCollections) {
      checkCollections();
    }
  }, [collectionsAvailable, creatingCollections]);

  // Initialize real-time updates with connection status
  const { isConnected } = useRealtimeUpdates();

  // Check WebSocket connection
  useEffect(() => {
    if (!isConnected && initialized && retryCount < 3) {
      console.log("WebSocket connection failed, retrying...");
      // Wait a bit before retrying
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setRetryCount((prev) => prev + 1);
          setInitialized(false); // This will trigger reinitialization
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isConnected, initialized, retryCount]);

  // Setup storage bucket
  useEffect(() => {
    const setupStorageBucket = async () => {
      try {
        if (creatingBucket) return;

        setCreatingBucket(true);
        console.log("Setting up storage bucket...");

        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET_ID;

        if (!endpoint || !projectId || !bucketId) {
          throw new Error(
            "Missing required Appwrite configuration for storage bucket"
          );
        }

        const result = await createStorageBucket(endpoint, projectId, bucketId);

        if (isMounted.current) {
          if (result) {
            console.log("Storage bucket setup successful");
            setBucketAvailable(true);
          } else {
            setError(
              "Failed to set up storage bucket. Please check Appwrite console."
            );
          }
          setCreatingBucket(false);
        }
      } catch (err) {
        console.error("Error setting up storage bucket:", err);
        if (isMounted.current) {
          setError(
            "Failed to set up storage bucket. Please check your Appwrite configuration."
          );
          setCreatingBucket(false);
        }
      }
    };

    if (!bucketAvailable && !creatingBucket) {
      setupStorageBucket();
    }
  }, [bucketAvailable, creatingBucket]);

  // Initialize data only when both collections and bucket are available
  useEffect(() => {
    const initializeData = async () => {
      if (!collectionsAvailable || !bucketAvailable) {
        console.log("Collections or bucket not available yet. Waiting...");
        return;
      }

      try {
        console.log("Initializing Appwrite data...");

        // Force create settings document
        await forceCreateDocuments();

        // Then load settings from storage
        await loadSettingsFromStorage();
        await loadContentFromStorage();

        if (isMounted.current) {
          setInitialized(true);
          setError(null);
          console.log("Appwrite data initialized successfully");
        }
      } catch (err) {
        console.error("Error initializing Appwrite data:", err);
        if (isMounted.current) {
          setError("Failed to initialize data. Please refresh the page.");
        }
      }
    };

    if (!initialized && collectionsAvailable && bucketAvailable) {
      initializeData();
    }
  }, [
    loadSettingsFromStorage,
    loadContentFromStorage,
    initialized,
    collectionsAvailable,
    bucketAvailable,
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
        console.log("Data:", serializedSettings);

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
        console.log("Data:", serializedContent);

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

  // Handle retry manually without showing any UI
  useEffect(() => {
    if (error) {
      console.error("AppwriteInit error:", error);
      // Attempt silent retry after 3 seconds
      const timer = setTimeout(() => {
        if (isMounted.current) {
          console.log("Attempting silent retry...");
          setError(null);
          setInitialized(false);
          setRetryCount((prev) => prev + 1);
          setCollectionsAvailable(false);
          setCreatingCollections(false);
          setCreatingBucket(false);
          setBucketAvailable(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // No visible UI - everything happens invisibly
  return null;
}
