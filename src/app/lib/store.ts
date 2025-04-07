import { create } from "zustand";
import { persist } from "zustand/middleware";
import { broadcastSettingsChange } from "./sitebridge";
import {
  getDocument,
  updateDocument,
  createDocument,
  COLLECTIONS,
  DATABASE_ID,
} from "./appwrite";

// Define types for our store
export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  logoUrl: string;
  primaryColor: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  users?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin?: string | null;
  }>;
}

export interface ContentSettings {
  hero: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
  };
  mission: {
    heading: string;
    description: string;
    points: string[];
  };
  achievements: {
    heading: string;
    stats: Array<{ value: string; label: string }>;
  };
  videos: {
    heading: string;
    videos: Array<{ title: string; url: string; thumbnail: string }>;
  };
  media: {
    images: Array<{
      id: string;
      url: string;
      publicId: string;
      name: string;
      uploadedAt: string;
      inMediaSlider?: boolean;
      type?: "image" | "video";
      description?: string;
    }>;
  };
  pages?: Array<{
    id: string;
    title: string;
    path: string;
    content: string;
    lastUpdated: string;
  }>;
  blog?: Array<{
    id: string;
    title: string;
    excerpt: string;
    content: string;
    status: string;
    author: string;
    date: string;
  }>;
}

interface SiteStore {
  // Site settings (can be modified by admin)
  siteSettings: SiteSettings;

  // Content settings
  contentSettings: ContentSettings;

  // Actions
  updateSiteSettings: (
    settings: Partial<SiteSettings>,
    shouldBroadcast?: boolean
  ) => Promise<void>;
  updateContentSettings: (
    settings: Partial<ContentSettings>,
    shouldBroadcast?: boolean
  ) => Promise<void>;
  loadSettingsFromStorage: () => Promise<void>;
  loadContentFromStorage: () => Promise<void>;
}

// Default settings
export const defaultSiteSettings: SiteSettings = {
  siteName: "Eco-Expert Recycling",
  siteDescription: "Sustainable e-waste recycling solutions",
  logoUrl: "/logo.png",
  primaryColor: "#10B981",
  footerText: "© 2023 Eco-Expert Recycling. All rights reserved.",
  contactEmail: "info@ecoexpert.com",
  contactPhone: "+1 (555) 123-4567",
  contactAddress: "123 Recycling Lane, Green City, GC 12345",
  socialLinks: {
    facebook: "https://facebook.com/ecoexpert",
    twitter: "https://twitter.com/ecoexpert",
    instagram: "https://instagram.com/ecoexpert",
    linkedin: "https://linkedin.com/company/ecoexpert",
  },
};

export const defaultContentSettings: ContentSettings = {
  hero: {
    heading: "Sustainable E-Waste Recycling Solutions",
    subheading:
      "Properly dispose of your electronic waste with our eco-friendly recycling services",
    ctaText: "Get Started",
    ctaLink: "/contact",
  },
  mission: {
    heading: "Our Mission",
    description:
      "We are committed to reducing electronic waste and promoting sustainable recycling practices.",
    points: [
      "Reduce electronic waste in landfills",
      "Recover valuable materials from e-waste",
      "Promote sustainable recycling practices",
      "Educate communities about e-waste management",
    ],
  },
  achievements: {
    heading: "Our Impact",
    stats: [
      { value: "10,000+", label: "Devices Recycled" },
      { value: "50+", label: "Tons Processed" },
      { value: "100+", label: "Trees Saved" },
      { value: "25+", label: "Community Programs" },
    ],
  },
  videos: {
    heading: "Our Work in Action",
    videos: [
      {
        title: "Recycling Process",
        url: "https://www.youtube.com/embed/example1",
        thumbnail: "/videos/process-thumbnail.jpg",
      },
      {
        title: "Community Impact",
        url: "https://www.youtube.com/embed/example2",
        thumbnail: "/videos/impact-thumbnail.jpg",
      },
    ],
  },
  media: {
    images: [],
  },
};

// Helper functions to serialize/deserialize JSON data
const serializeJsonFields = (data: any) => {
  const result = { ...data };

  // Convert JSON objects to strings for Appwrite storage
  if (result.hero) result.hero = JSON.stringify(result.hero);
  if (result.mission) result.mission = JSON.stringify(result.mission);
  if (result.achievements)
    result.achievements = JSON.stringify(result.achievements);
  if (result.videos) result.videos = JSON.stringify(result.videos);
  if (result.media) result.media = JSON.stringify(result.media);
  if (result.pages) result.pages = JSON.stringify(result.pages);
  if (result.blog) result.blog = JSON.stringify(result.blog);
  if (result.socialLinks)
    result.socialLinks = JSON.stringify(result.socialLinks);

  return result;
};

const deserializeJsonFields = (data: any): any => {
  const result = { ...data };

  // Parse JSON strings back to objects
  try {
    if (typeof result.hero === "string") result.hero = JSON.parse(result.hero);
    if (typeof result.mission === "string")
      result.mission = JSON.parse(result.mission);
    if (typeof result.achievements === "string")
      result.achievements = JSON.parse(result.achievements);
    if (typeof result.videos === "string")
      result.videos = JSON.parse(result.videos);
    if (typeof result.media === "string")
      result.media = JSON.parse(result.media);
    if (typeof result.pages === "string")
      result.pages = JSON.parse(result.pages);
    if (typeof result.blog === "string") result.blog = JSON.parse(result.blog);
    if (typeof result.socialLinks === "string")
      result.socialLinks = JSON.parse(result.socialLinks);
  } catch (error) {
    console.error("Error parsing JSON fields:", error);
  }

  return result;
};

// Create the store
export const useStore = create<SiteStore>()(
  persist(
    (set, get) => ({
      // Initial state
      siteSettings: defaultSiteSettings,
      contentSettings: defaultContentSettings,

      // Actions
      updateSiteSettings: async (settings, shouldBroadcast = true) => {
        const currentSettings = get().siteSettings;
        const updatedSettings = { ...currentSettings, ...settings };

        try {
          // Serialize JSON fields before sending to Appwrite
          const serializedSettings = serializeJsonFields(updatedSettings);

          // Update in Appwrite
          await updateDocument(
            COLLECTIONS.SETTINGS,
            "main",
            serializedSettings
          );

          // Update local state
          set({ siteSettings: updatedSettings });

          // Broadcast changes if needed
          if (shouldBroadcast) {
            broadcastSettingsChange("siteSettings", updatedSettings);
          }
        } catch (error) {
          console.error("Error updating site settings:", error);
          throw error;
        }
      },

      updateContentSettings: async (settings, shouldBroadcast = true) => {
        const currentContent = get().contentSettings;
        const updatedContent = { ...currentContent, ...settings };

        try {
          // Serialize JSON fields before sending to Appwrite
          const serializedContent = serializeJsonFields(updatedContent);

          // Update in Appwrite
          await updateDocument(COLLECTIONS.CONTENT, "main", serializedContent);

          // Update local state
          set({ contentSettings: updatedContent });

          // Broadcast changes if needed
          if (shouldBroadcast) {
            broadcastSettingsChange("contentSettings", updatedContent);
          }
        } catch (error) {
          console.error("Error updating content settings:", error);
          throw error;
        }
      },

      loadSettingsFromStorage: async () => {
        try {
          const settings = await getDocument(COLLECTIONS.SETTINGS, "main");
          if (settings) {
            // Deserialize JSON strings back to objects
            const deserializedSettings = deserializeJsonFields(settings);
            set({ siteSettings: deserializedSettings as SiteSettings });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
          // If document doesn't exist, create it with defaults
          try {
            const serializedSettings = serializeJsonFields(defaultSiteSettings);
            await createDocument(
              COLLECTIONS.SETTINGS,
              serializedSettings,
              "main"
            );
          } catch (createError) {
            console.error("Error creating default settings:", createError);
          }
        }
      },

      loadContentFromStorage: async () => {
        try {
          const content = await getDocument(COLLECTIONS.CONTENT, "main");
          if (content) {
            // Deserialize JSON strings back to objects
            const deserializedContent = deserializeJsonFields(content);
            set({ contentSettings: deserializedContent as ContentSettings });
          }
        } catch (error) {
          console.error("Error loading content:", error);
          // If document doesn't exist, create it with defaults
          try {
            const serializedContent = serializeJsonFields(
              defaultContentSettings
            );
            await createDocument(
              COLLECTIONS.CONTENT,
              serializedContent,
              "main"
            );
          } catch (createError) {
            console.error("Error creating default content:", createError);
          }
        }
      },
    }),
    {
      name: "site-store",
    }
  )
);
