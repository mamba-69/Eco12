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
  logoUrl: "https://i.postimg.cc/2SW1kwbf/Final.png",
  primaryColor: "#10B981",
  footerText: "© 2025 Eco-Expert Recycling. All rights reserved.",
  contactEmail: "Ecoexpertrecycling@gmail.com",
  contactPhone: "+91 70964 44414",
  contactAddress: "Survey No. 209/1/2, Ward No. 08, Ambedkar Ward, Neemuch City, Neemuch-458441, Madhya Pradesh.",
  socialLinks: {
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/company/",
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

// Helper function to safely parse JSON strings
const safeJsonParse = (jsonString: string, fallback: any = null) => {
  if (!jsonString) {
    console.warn(
      "Attempted to parse empty or null JSON string, using fallback value"
    );
    return fallback;
  }

  try {
    // Trim the string to avoid whitespace issues
    const trimmed = jsonString.trim();

    // Quick validation check
    if (
      (!trimmed.startsWith("{") && !trimmed.startsWith("[")) ||
      (!trimmed.endsWith("}") && !trimmed.endsWith("]"))
    ) {
      console.warn(
        "JSON string doesn't appear to be valid JSON format:",
        trimmed.length > 50 ? `${trimmed.substring(0, 50)}...` : trimmed
      );
      return fallback;
    }

    return JSON.parse(trimmed);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error parsing JSON: ${error.message}`);
      if (jsonString.length < 100) {
        console.error("Invalid JSON string:", jsonString);
      } else {
        console.error(
          "Invalid JSON string (truncated):",
          jsonString.substring(0, 100) + "..."
        );
      }
    } else {
      console.error("Unknown error parsing JSON:", error);
    }
    return fallback;
  }
};

// Helper functions to serialize/deserialize JSON data
const serializeJsonFields = (data: any) => {
  if (!data) return {};

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
  if (!data) return {};

  const result = { ...data };

  // Parse JSON strings back to objects
  try {
    if (typeof result.hero === "string") {
      result.hero = safeJsonParse(result.hero, {
        heading: "Default Heading",
        subheading: "Default Subheading",
        ctaText: "Get Started",
        ctaLink: "/contact",
      });
    }

    if (typeof result.mission === "string") {
      result.mission = safeJsonParse(result.mission, {
        heading: "Our Mission",
        description:
          "We are committed to reducing electronic waste and promoting sustainable recycling practices.",
        points: ["Reduce electronic waste in landfills"],
      });
    }

    if (typeof result.achievements === "string") {
      result.achievements = safeJsonParse(result.achievements, {
        heading: "Our Impact",
        stats: [{ value: "0", label: "Devices Recycled" }],
      });
    }

    if (typeof result.videos === "string") {
      result.videos = safeJsonParse(result.videos, {
        heading: "Our Work in Action",
        videos: [],
      });
    }

    if (typeof result.media === "string") {
      result.media = safeJsonParse(result.media, {
        images: [],
      });
    }

    if (typeof result.pages === "string") {
      result.pages = safeJsonParse(result.pages, []);
    }

    if (typeof result.blog === "string") {
      result.blog = safeJsonParse(result.blog, []);
    }

    if (typeof result.socialLinks === "string") {
      result.socialLinks = safeJsonParse(result.socialLinks, {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      });
    }

    // Handle potential nested string fields (for Appwrite's string fields for JSON)
    if (result.media && typeof result.media.images === "string") {
      result.media.images = safeJsonParse(result.media.images, []);
    }

    // Add fallback for media.images if it doesn't exist
    if (result.media && !result.media.images) {
      result.media.images = [];
    }
  } catch (error) {
    console.error("Error parsing JSON fields:", error);
    // Return default values if parsing fails completely
    return defaultContentSettings;
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

          console.log("Updating settings in Appwrite:", serializedSettings);

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

          console.log("Updating content in Appwrite:", serializedContent);

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
          console.log("Loading settings from Appwrite storage");
          const settings = await getDocument(COLLECTIONS.SETTINGS, "main");
          console.log("Raw settings from Appwrite:", settings);

          if (settings) {
            // Deserialize JSON strings back to objects
            const deserializedSettings = deserializeJsonFields(settings);
            console.log("Deserialized settings:", deserializedSettings);
            set({ siteSettings: deserializedSettings as SiteSettings });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
          // If document doesn't exist, create it with defaults
          try {
            console.log("Creating default settings in Appwrite");
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
          console.log("Loading content from Appwrite storage");
          const content = await getDocument(COLLECTIONS.CONTENT, "main");
          console.log("Raw content from Appwrite:", content);

          if (content) {
            // Deserialize JSON strings back to objects
            const deserializedContent = deserializeJsonFields(content);
            console.log("Deserialized content:", deserializedContent);
            set({ contentSettings: deserializedContent as ContentSettings });
          }
        } catch (error) {
          console.error("Error loading content:", error);
          // If document doesn't exist, create it with defaults
          try {
            console.log("Creating default content in Appwrite");
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
