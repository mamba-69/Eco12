import { ContentSettings } from "./store";

/**
 * Default content settings used when initializing a new site or when content is missing
 */
export const defaultContent: ContentSettings = {
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
      content: "Explore our comprehensive recycling services.",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Contact",
      path: "/contact",
      content: "Get in touch with our recycling experts.",
      lastUpdated: new Date().toISOString(),
    },
  ],
  blog: [
    {
      id: "1",
      title: "The Importance of E-Waste Recycling",
      excerpt:
        "Learn why proper disposal of electronic waste is crucial for our environment.",
      content:
        "Electronic waste contains hazardous materials that can harm the environment if not properly disposed of. Recycling e-waste helps recover valuable materials and reduces the need for mining raw materials.",
      status: "published",
      author: "Eco-Expert Team",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      title: "How to Prepare Your Electronics for Recycling",
      excerpt: "Simple steps to take before recycling your old devices.",
      content:
        "Before recycling your electronic devices, make sure to back up your data, factory reset your devices, and remove any batteries or accessories that need separate recycling.",
      status: "published",
      author: "Recycling Specialist",
      date: new Date().toISOString(),
    },
  ],
};
