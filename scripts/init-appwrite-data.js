#!/usr/bin/env node

/**
 * Initialize Appwrite Data script
 *
 * This script creates the initial content in the Appwrite database.
 * Run with: node scripts/init-appwrite-data.js
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { Client, Databases, ID } from "node-appwrite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envResult = config({ path: resolve(__dirname, "../.env.local") });
if (!envResult.parsed) {
  config({ path: resolve(__dirname, "../.env") });
}

// Configuration
const {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: PROJECT_ID,
  APPWRITE_API_KEY: API_KEY,
} = process.env;

if (!APPWRITE_ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error(
    "Error: Missing environment variables. Please check your .env.local file."
  );
  console.error(
    "Required variables: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY"
  );
  process.exit(1);
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Default content
const defaultContent = {
  hero: {
    heading: "Welcome to Eco Expert Recycling",
    subheading: "Your Partner in Sustainable E-Waste Management",
    ctaText: "Get Started",
    ctaLink: "/contact",
  },
  mission: {
    description:
      "At Eco Expert Recycling, we are committed to making e-waste recycling accessible, efficient, and environmentally responsible. Our mission is to protect our planet while helping businesses and individuals manage their electronic waste sustainably.",
    points: [
      "Certified e-waste recycling processes",
      "Secure data destruction",
      "Environmental compliance",
      "Community engagement",
    ],
  },
  achievements: {
    devicesRecycled: 50000,
    eWasteTons: 250,
    treesSaved: 5000,
    communityPrograms: 120,
  },
  videos: [
    {
      title: "Our Recycling Process",
      url: "https://www.youtube.com/watch?v=example1",
      thumbnail: "/images/video-thumb-1.jpg",
    },
    {
      title: "Environmental Impact",
      url: "https://www.youtube.com/watch?v=example2",
      thumbnail: "/images/video-thumb-2.jpg",
    },
  ],
  media: [],
  pages: [
    {
      id: "about",
      title: "About Us",
      path: "/about",
      content: "Learn about our commitment to sustainable e-waste recycling...",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "services",
      title: "Our Services",
      path: "/services",
      content: "Discover our comprehensive e-waste recycling services...",
      lastUpdated: new Date().toISOString(),
    },
  ],
  blog: [
    {
      id: "getting-started",
      title: "Getting Started with E-Waste Recycling",
      excerpt: "Learn the basics of responsible e-waste disposal...",
      content: "Full blog post content here...",
      status: "published",
      author: "Eco Expert Team",
      publishedAt: new Date().toISOString(),
    },
  ],
};

// Default settings
const defaultSettings = {
  siteTitle: "Eco Expert Recycling",
  siteDescription:
    "Leading e-waste recycling solutions for a sustainable future. We help businesses and individuals responsibly dispose of electronic waste while protecting the environment.",
  theme: "light",
  language: "en",
  sitename: "Eco Expert Recycling",
  contactEmail: "Ecoexpertrecycling@gmail.com",
  contactPhone: "+91 70964 44414",
  navigation: JSON.stringify([
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ]),
  footer: JSON.stringify({
    company: "Eco Expert Recycling",
    address: "Survey No. 209/1/2, Ward No. 08, Ambedkar Ward, Neemuch City, Neemuch-458441, Madhya Pradesh.",
    phone: "+91 70964 44414",
    email: "Ecoexpertrecycling@gmail.com",
    social: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/company/",
    },
  }),
  updatedAt: new Date().toISOString(),
};

async function initializeData() {
  try {
    console.log("🚀 Starting data initialization...");
    console.log("📍 Endpoint:", APPWRITE_ENDPOINT);
    console.log("📂 Project:", PROJECT_ID);

    // Get the database ID
    console.log("🔍 Getting database list...");
    const dbListResponse = await databases.list();
    console.log("📊 Database list response:", dbListResponse);

    const { databases: dbList } = dbListResponse;
    if (!dbList || dbList.length === 0) {
      throw new Error("No databases found");
    }
    const databaseId = dbList[0].$id;
    console.log(`📦 Using database: ${databaseId}`);

    // Initialize settings
    console.log("⚙️ Initializing settings...");
    console.log("📝 Settings data:", defaultSettings);
    try {
      const settingsDoc = await databases.createDocument(
        databaseId,
        "settings",
        ID.unique(),
        defaultSettings
      );
      console.log("✅ Settings initialized successfully:", settingsDoc);
    } catch (error) {
      console.log("⚠️ Settings error:", error);
      if (error.code === 409) {
        console.log("ℹ️ Settings already exist, skipping...");
      } else {
        throw error;
      }
    }

    // Initialize content
    console.log("📝 Initializing content...");
    const contentData = {
      hero: JSON.stringify({
        heading: "Welcome to Eco Expert Recycling",
        subheading: "Your Partner in Sustainable E-Waste Management",
        ctaText: "Get Started",
        ctaLink: "/contact",
      }),
      mission: JSON.stringify({
        description:
          "At Eco Expert Recycling, we are committed to making e-waste recycling accessible, efficient, and environmentally responsible. Our mission is to protect our planet while helping businesses and individuals manage their electronic waste sustainably.",
        points: [
          "Certified e-waste recycling processes",
          "Secure data destruction",
          "Environmental compliance",
          "Community engagement",
        ],
      }),
      achievements: JSON.stringify({
        devicesRecycled: 50000,
        eWasteTons: 250,
        treesSaved: 5000,
        communityPrograms: 120,
      }),
      videos: JSON.stringify([
        {
          title: "Our Recycling Process",
          url: "https://www.youtube.com/watch?v=example1",
          thumbnail: "/images/video-thumb-1.jpg",
        },
        {
          title: "Environmental Impact",
          url: "https://www.youtube.com/watch?v=example2",
          thumbnail: "/images/video-thumb-2.jpg",
        },
      ]),
      media: JSON.stringify([]),
      pages: JSON.stringify([
        {
          id: "about",
          title: "About Us",
          path: "/about",
          content:
            "Learn about our commitment to sustainable e-waste recycling...",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "services",
          title: "Our Services",
          path: "/services",
          content: "Discover our comprehensive e-waste recycling services...",
          lastUpdated: new Date().toISOString(),
        },
      ]),
      blog: JSON.stringify([
        {
          id: "getting-started",
          title: "Getting Started with E-Waste Recycling",
          excerpt: "Learn the basics of responsible e-waste disposal...",
          content: "Full blog post content here...",
          status: "published",
          author: "Eco Expert Team",
          publishedAt: new Date().toISOString(),
        },
      ]),
      updatedAt: new Date().toISOString(),
    };
    console.log("📝 Content data:", contentData);
    try {
      const contentDoc = await databases.createDocument(
        databaseId,
        "content",
        ID.unique(),
        contentData
      );
      console.log("✅ Content initialized successfully:", contentDoc);
    } catch (error) {
      console.log("⚠️ Content error:", error);
      if (error.code === 409) {
        console.log("ℹ️ Content already exists, skipping...");
      } else {
        throw error;
      }
    }

    console.log("✨ Data initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error initializing data:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeData().catch((error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
