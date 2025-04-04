import { create } from "zustand";
import { persist } from "zustand/middleware";
import { broadcastSettingsChange } from "./sitebridge";

// Define types for our store
export interface SiteSettings {
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

interface ContentSettings {
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
  ) => void;
  updateContentSettings: (
    settings: Partial<ContentSettings>,
    shouldBroadcast?: boolean
  ) => void;
}

// Default site settings
const defaultSettings: SiteSettings = {
  logoUrl: "/images/logo.svg",
  primaryColor: "#2ECC71",
  footerText:
    "© " + new Date().getFullYear() + " EcoVerva. All rights reserved.",
  contactEmail: "connect@ecoverva.com",
  contactPhone: "1800-120-ECOV",
  contactAddress:
    "Unit 1116, 1117 & 1119, 11th Floor BPTP Park Centra, Sector 30 NH8, Gurgaon, Haryana 122001",
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  users: [],
};

// Default content settings
const defaultContentSettings: ContentSettings = {
  hero: {
    heading: "Recycle E-Waste for a Greener Tomorrow",
    subheading:
      "Join our mission to create a sustainable future through responsible electronics recycling",
    ctaText: "Recycle Now",
    ctaLink: "/recycle",
  },
  mission: {
    heading: "Our Mission",
    description:
      "We are committed to reducing e-waste through responsible recycling practices, education, and community engagement. Our goal is to create a sustainable future where electronics are recycled properly, reducing environmental impact and conserving valuable resources.",
    points: [
      "Reduce environmental pollution from e-waste",
      "Recover valuable materials from old electronics",
      "Provide safe disposal of hazardous components",
      "Educate communities on responsible recycling",
    ],
  },
  achievements: {
    heading: "Our Impact",
    stats: [
      { value: "50,000+", label: "Devices Recycled" },
      { value: "500+", label: "Tons of E-Waste Processed" },
      { value: "5,000+", label: "Trees Saved" },
      { value: "25+", label: "Community Programs" },
    ],
  },
  videos: {
    heading: "See Our Work in Action",
    videos: [
      {
        title: "Recycling Process",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "/images/video-thumbnail-1.jpg",
      },
      {
        title: "Community Impact",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "/images/video-thumbnail-2.jpg",
      },
      {
        title: "Customer Stories",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "/images/video-thumbnail-3.jpg",
      },
    ],
  },
  media: {
    images: [],
  },
  pages: [
    {
      id: "1",
      title: "Home Page",
      path: "/",
      content: "Welcome to our eco-friendly recycling service.",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      title: "About Us",
      path: "/about",
      content: "Learn about our mission and values.",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Services",
      path: "/services",
      content: "Explore our recycling services.",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Contact",
      path: "/contact",
      content: "Get in touch with our team.",
      lastUpdated: new Date().toISOString(),
    },
  ],
  blog: [
    {
      id: "1",
      title: "Understanding E-Waste Management",
      excerpt: "Learn about the importance of proper e-waste disposal.",
      content: "E-waste management is crucial for our planet's health...",
      status: "Published",
      author: "Admin",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      title: "The Impact of Recycling Electronics",
      excerpt: "Discover how recycling electronics can make a difference.",
      content: "Recycling electronics has a significant positive impact...",
      status: "Published",
      author: "Admin",
      date: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Corporate Sustainability Programs",
      excerpt: "How businesses can implement effective recycling programs.",
      content:
        "Corporate sustainability is not just good for the environment...",
      status: "Draft",
      author: "Admin",
      date: new Date().toISOString(),
    },
  ],
};

// Create the store with persistence
export const useStore = create<SiteStore>()(
  persist(
    (set) => ({
      // Initial state
      siteSettings: defaultSettings,
      contentSettings: defaultContentSettings,

      // Actions
      updateSiteSettings: (settings, shouldBroadcast = true) => {
        // First update the store state
        set((state) => {
          const updatedSettings = {
            ...state.siteSettings,
            ...settings,
          };

          // When shouldBroadcast is false, we're receiving updates from elsewhere
          // so we don't want to trigger another broadcast
          if (shouldBroadcast) {
            // Broadcast changes to other components via SiteBridge
            setTimeout(() => {
              broadcastSettingsChange(settings, "store-update");
            }, 0);
          }

          // Save to store
          return { siteSettings: updatedSettings };
        });
      },

      updateContentSettings: (settings, shouldBroadcast = true) => {
        // First update the store state
        set((state) => {
          const updatedSettings = {
            ...state.contentSettings,
            ...settings,
          };

          // When shouldBroadcast is false, we're receiving updates from elsewhere
          if (shouldBroadcast) {
            // Broadcast changes to other components via SiteBridge
            setTimeout(() => {
              broadcastSettingsChange(
                { contentSettings: settings },
                "content-update"
              );
            }, 0);
          }

          // Save to store
          return { contentSettings: updatedSettings };
        });
      },
    }),
    {
      name: "ecoverva-store", // name of the item in local storage
      partialize: (state) => ({
        siteSettings: state.siteSettings,
        contentSettings: state.contentSettings,
      }),
    }
  )
);
