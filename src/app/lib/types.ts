/**
 * Type definitions for the site
 */

// Media item interface
export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  name: string;
  uploadedAt: string;
  type: "image" | "video";
  description?: string;
  inMediaSlider?: boolean;
  originalUrl?: string;
}

// Site settings interface
export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  logo?: {
    main: string;
    alt?: string;
  };
  footer?: {
    copyrightText?: string;
    showSocialMedia?: boolean;
    showContactInfo?: boolean;
    showLogo?: boolean;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  navigation?: {
    items: Array<{
      label: string;
      url: string;
    }>;
  };
}

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  featured?: boolean;
}

// Content settings interface
export interface ContentSettings {
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
    backgroundImage?: string;
  };
  about?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    features?: Array<{
      title: string;
      description: string;
    }>;
  };
  services?: {
    title?: string;
    subtitle?: string;
    description?: string;
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
      image?: string;
    }>;
  };
  testimonials?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      quote: string;
      author: string;
      company?: string;
      image?: string;
    }>;
  };
  contact?: {
    title?: string;
    subtitle?: string;
    description?: string;
    formFields?: {
      name?: { label: string; required: boolean };
      email?: { label: string; required: boolean };
      phone?: { label: string; required: boolean };
      message?: { label: string; required: boolean };
    };
    submitText?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      address?: string;
    };
  };
  faq?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      question: string;
      answer: string;
    }>;
  };
  blog?: {
    title?: string;
    subtitle?: string;
    description?: string;
    featuredPosts?: BlogPost[];
  };
  media: {
    images: MediaItem[];
  };
}
