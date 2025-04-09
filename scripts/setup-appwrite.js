#!/usr/bin/env node

/**
 * Setup Appwrite script
 *
 * This script creates the necessary collections, attributes, indexes and storage buckets for the application.
 * Run with: npm run setup-appwrite
 *
 * Make sure you have the following environment variables set in .env.local or .env:
 * - NEXT_PUBLIC_APPWRITE_ENDPOINT
 * - NEXT_PUBLIC_APPWRITE_PROJECT_ID
 * - APPWRITE_API_KEY
 */

import { config } from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, "../.env.local") });
if (Object.keys(process.env).length === 0) {
  config({ path: resolve(__dirname, "../.env") });
}

// Configuration
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const BUCKET_ID = "media-bucket";

if (!APPWRITE_ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error(
    "Error: Missing environment variables. Please check your .env.local file."
  );
  console.error(
    "Required variables: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY"
  );
  process.exit(1);
}

// Collection definitions with their attributes
const collections = [
  {
    name: "settings",
    $id: "settings",
    attributes: [
      {
        key: "theme",
        type: "string",
        required: true,
        size: 20,
      },
      {
        key: "siteTitle",
        type: "string",
        required: true,
        size: 100,
      },
      {
        key: "siteDescription",
        type: "string",
        required: true,
        size: 500,
      },
      { key: "logo", type: "string", required: false, size: 255 },
      { key: "favicon", type: "string", required: false, size: 255 },
      {
        key: "navigation",
        type: "string",
        required: true,
        size: 16384,
      },
      {
        key: "footer",
        type: "string",
        required: true,
        size: 16384,
      },
      { key: "scripts", type: "string", required: false, size: 16384 },
    ],
  },
  {
    name: "content",
    $id: "content",
    attributes: [
      {
        key: "hero",
        type: "string",
        required: true,
        size: 16384,
      },
      {
        key: "mission",
        type: "string",
        required: true,
        size: 16384,
      },
      {
        key: "achievements",
        type: "string",
        required: true,
        size: 16384,
      },
      {
        key: "videos",
        type: "string",
        required: true,
        size: 16384,
      },
      {
        key: "media",
        type: "string",
        required: true,
        size: 16384,
      },
      {
        key: "pages",
        type: "string",
        required: true,
        size: 65535,
      },
      {
        key: "blog",
        type: "string",
        required: true,
        size: 65535,
      },
    ],
  },
  {
    name: "media",
    $id: "media",
    attributes: [
      { key: "name", type: "string", required: true, size: 255 },
      { key: "url", type: "string", required: true, size: 1024 },
      { key: "type", type: "string", required: true, size: 20 },
      { key: "size", type: "integer", required: false },
      {
        key: "includeInSlider",
        type: "boolean",
        required: true,
      },
      { key: "alt", type: "string", required: false, size: 255 },
      { key: "caption", type: "string", required: false, size: 500 },
      { key: "createdAt", type: "datetime", required: true },
      { key: "updatedAt", type: "datetime", required: true },
    ],
  },
];

// Helper function to make API requests
async function appwriteRequest(endpoint, method = "GET", body = null) {
  // Ensure we have the correct API endpoint
  const baseUrl = APPWRITE_ENDPOINT.endsWith("/v1")
    ? APPWRITE_ENDPOINT
    : `${APPWRITE_ENDPOINT}/v1`;

  const url = `${baseUrl}${endpoint}`;
  console.log("Making request to:", url); // Debug log
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT_ID,
      "X-Appwrite-Key": API_KEY,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        // 409 means resource already exists, which is fine for our setup
        return { exists: true, data };
      }
      throw new Error(
        `${data.message || "Unknown error"} (${response.status})`
      );
    }

    return { success: true, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Validate API key by checking if we can access the databases endpoint
console.log("🔑 Validating API key...");
const validation = await appwriteRequest("/databases");
if (validation.error) {
  console.error("❌ API key validation failed:", validation.error);
  console.error("❌ Setup failed: Invalid API key");
  process.exit(1);
}

console.log("✅ API key validated successfully");

// Get existing databases and use the first one
console.log("🗄️ Getting available databases...");
const databasesResponse = await appwriteRequest("/databases");
if (databasesResponse.error) {
  console.error("❌ Failed to get databases:", databasesResponse.error);
  process.exit(1);
}

if (
  !databasesResponse.data.databases ||
  databasesResponse.data.databases.length === 0
) {
  console.error(
    "❌ No databases found. Please create a database in the Appwrite console first."
  );
  process.exit(1);
}

const DATABASE_ID = databasesResponse.data.databases[0].$id;
console.log(`✅ Using existing database: ${DATABASE_ID}`);

// Create collections and attributes
async function createCollections() {
  console.log("📋 Setting up collections and attributes...");

  for (const collection of collections) {
    console.log(`🔍 Checking collection '${collection.$id}'...`);

    // Check if collection exists
    const checkResult = await appwriteRequest(
      `/databases/${DATABASE_ID}/collections/${collection.$id}`
    );

    // Create collection if it doesn't exist
    if (!checkResult.success && !checkResult.exists) {
      const createResult = await appwriteRequest(
        `/databases/${DATABASE_ID}/collections`,
        "POST",
        {
          collectionId: collection.$id,
          name: collection.name,
          permissions: [
            'read("any")',
            'create("any")',
            'update("any")',
            'delete("any")',
          ],
        }
      );

      if (createResult.error) {
        console.error(
          `❌ Failed to create collection '${collection.$id}': ${createResult.error}`
        );
        continue;
      }

      console.log(`✅ Created collection '${collection.$id}'`);
    } else {
      console.log(`✅ Collection '${collection.$id}' already exists`);
    }

    // Create attributes
    for (const attr of collection.attributes) {
      console.log(
        `🔍 Checking attribute '${attr.key}' in collection '${collection.$id}'...`
      );

      const attrCheckResult = await appwriteRequest(
        `/databases/${DATABASE_ID}/collections/${collection.$id}/attributes/${attr.key}`
      );

      if (attrCheckResult.success || attrCheckResult.exists) {
        console.log(
          `✅ Attribute '${attr.key}' already exists in collection '${collection.$id}'`
        );
        continue;
      }

      // Prepare attribute creation request
      const attributeData = {
        key: attr.key,
        type: attr.type,
        required: attr.required,
      };

      // Add type-specific properties
      if (attr.type === "string") {
        attributeData.size = attr.size;
        if (attr.default !== undefined) attributeData.default = attr.default;
      } else if (attr.type === "integer") {
        if (attr.min !== undefined) attributeData.min = attr.min;
        if (attr.max !== undefined) attributeData.max = attr.max;
        if (attr.default !== undefined) attributeData.default = attr.default;
      } else if (attr.type === "boolean") {
        if (attr.default !== undefined) attributeData.default = attr.default;
      }

      const attrCreateResult = await appwriteRequest(
        `/databases/${DATABASE_ID}/collections/${collection.$id}/attributes/${attr.type}`,
        "POST",
        attributeData
      );

      if (attrCreateResult.error) {
        console.error(
          `❌ Failed to create attribute '${attr.key}': ${attrCreateResult.error}`
        );
      } else {
        console.log(
          `✅ Created attribute '${attr.key}' in collection '${collection.$id}'`
        );
      }
    }
  }

  return true;
}

// Create storage bucket
async function createStorageBucket() {
  console.log(`🗂️ Checking storage bucket '${BUCKET_ID}'...`);

  // Check if bucket exists
  const checkResult = await appwriteRequest(`/storage/buckets/${BUCKET_ID}`);

  if (checkResult.success || checkResult.exists) {
    console.log(`✅ Storage bucket '${BUCKET_ID}' already exists`);

    // Update bucket permissions even if it exists
    const updateResult = await appwriteRequest(
      `/storage/buckets/${BUCKET_ID}`,
      "PUT",
      {
        name: "Media Storage",
        permissions: [
          'read("any")',
          'create("any")',
          'update("any")',
          'delete("any")',
        ],
        fileSecurity: false,
        enabled: true,
        maximumFileSize: 30000000, // 30MB
        allowedFileExtensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      }
    );

    if (updateResult.error) {
      console.error(
        `❌ Failed to update storage bucket permissions: ${updateResult.error}`
      );
      return false;
    }

    return true;
  }

  // Create bucket with comprehensive settings
  const createResult = await appwriteRequest("/storage/buckets", "POST", {
    bucketId: BUCKET_ID,
    name: "Media Storage",
    permissions: [
      'read("any")',
      'create("any")',
      'update("any")',
      'delete("any")',
    ],
    fileSecurity: false,
    enabled: true,
    maximumFileSize: 30000000, // 30MB
    allowedFileExtensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  });

  if (createResult.error) {
    console.error(`❌ Failed to create storage bucket: ${createResult.error}`);
    return false;
  }

  console.log(`✅ Created storage bucket '${BUCKET_ID}'`);
  return true;
}

async function initializeDefaultData() {
  console.log("📝 Initializing default data...");

  try {
    // Initialize settings with default values
    const settingsResult = await appwriteRequest(
      `/databases/${DATABASE_ID}/collections/settings/documents`,
      "POST",
      {
        documentId: "default",
        data: {
          theme: "light",
          siteTitle: "My Site",
          siteDescription: "Site Description",
          navigation: JSON.stringify([]),
          footer: JSON.stringify({}),
          logo: "",
          favicon: "",
          scripts: "",
          language: "en",
          updatedAt: new Date().toISOString(),
          sitename: "My Site",
          contactEmail: "contact@example.com",
          contactPhone: "+1234567890",
          createdAt: new Date().toISOString(),
        },
      }
    );

    if (settingsResult.error && !settingsResult.exists) {
      console.error("❌ Failed to initialize settings:", settingsResult.error);
    } else {
      console.log("✅ Settings initialized successfully");
    }

    // Initialize content with default values
    const contentResult = await appwriteRequest(
      `/databases/${DATABASE_ID}/collections/content/documents`,
      "POST",
      {
        documentId: "default",
        data: {
          hero: JSON.stringify({}),
          mission: JSON.stringify({}),
          achievements: JSON.stringify({}),
          videos: JSON.stringify([]),
          media: JSON.stringify([]),
          pages: JSON.stringify([]),
          blog: JSON.stringify([]),
          updatedAt: new Date().toISOString(),
          language: "en",
          createdAt: new Date().toISOString(),
        },
      }
    );

    if (contentResult.error && !contentResult.exists) {
      console.error("❌ Failed to initialize content:", contentResult.error);
    } else {
      console.log("✅ Content initialized successfully");
    }

    console.log("✅ Default data initialization completed");
  } catch (error) {
    console.error("❌ Error initializing default data:", error);
    throw error;
  }
}

// Main function to run setup
async function setup() {
  console.log("🚀 Starting Appwrite setup...");
  console.log(`📍 Endpoint: ${APPWRITE_ENDPOINT}`);
  console.log(`📂 Project: ${PROJECT_ID}`);

  // Create collections and attributes
  const collectionsCreated = await createCollections();
  if (!collectionsCreated) {
    console.warn(
      "⚠️ Some collections or attributes may not have been created properly"
    );
  }

  // Create storage bucket
  const bucketCreated = await createStorageBucket();
  if (!bucketCreated) {
    console.error("❌ Setup failed: Could not create or verify storage bucket");
    process.exit(1);
  }

  // Initialize default data
  await initializeDefaultData();

  console.log("✨ Appwrite setup completed successfully!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Update your .env.local file with your Appwrite credentials");
  console.log("2. Run your application with: npm run dev");

  process.exit(0);
}

// Run setup
setup().catch((error) => {
  console.error("❌ Unexpected error during setup:", error);
  process.exit(1);
});
