"use client";

import { useEffect, useState, useRef } from "react";
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

  // Cleanup function to prevent updates on unmounted component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Debug appwrite configuration
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
              "Some collections are missing. Please check the Appwrite console and make sure the collections are created."
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

  // Display error message if initialization failed
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-bold text-red-600 mb-4">
            Appwrite Error
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{error}</p>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mb-4">
            <p className="text-sm text-yellow-800">Debug Info:</p>
            <ul className="text-xs text-yellow-700 mt-1 list-disc pl-4">
              <li>Database ID: {DATABASE_ID || "Not set"}</li>
              <li>
                Bucket ID:{" "}
                {process.env.NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET_ID || "Not set"}
              </li>
              <li>
                Collections Available: {collectionsAvailable ? "Yes" : "No"}
              </li>
              <li>
                Storage Bucket Available: {bucketAvailable ? "Yes" : "No"}
              </li>
              <li>WebSocket Connected: {isConnected ? "Yes" : "No"}</li>
              <li>Retry Count: {retryCount}</li>
            </ul>
          </div>
          <button
            onClick={() => {
              if (isMounted.current) {
                setError(null);
                setInitialized(false);
                setRetryCount(0);
                setCollectionsAvailable(false);
                setCreatingCollections(false);
                setCreatingBucket(false);
                setBucketAvailable(false);
                window.location.reload();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Display loading message during initialization
  if (!initialized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {creatingCollections
              ? "Creating Appwrite collections..."
              : creatingBucket
              ? "Creating Appwrite storage bucket..."
              : !collectionsAvailable
              ? "Checking Appwrite collections..."
              : !bucketAvailable
              ? "Checking Appwrite storage bucket..."
              : retryCount > 0
              ? `Initializing data... (Attempt ${retryCount + 1})`
              : "Initializing data..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  return null;
}
