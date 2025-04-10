import { SiteSettings } from "./store";

/**
 * Default site settings used when initializing a new site or when settings are missing
 */
export const defaultSettings: SiteSettings = {
  siteName: "Eco-Expert Recycling",
  siteDescription:
    "Leading e-waste recycling company with sustainable solutions for a greener future.",
  logoUrl: "https://i.postimg.cc/2SW1kwbf/Final.png",
  primaryColor: "#2ECC71",
  footerText:
    "© " +
    new Date().getFullYear() +
    " Eco-Expert Recycling. All rights reserved.",
  contactEmail: "experttechnology2016@gmail.com",
  contactPhone: "+91 70964 44414",
  contactAddress: "123 Recycling Way, Green City, 12345",
  socialLinks: {
    facebook: "https://facebook.com/ecoexpertrecycling",
    twitter: "https://twitter.com/ecoexpertrecycling",
    instagram: "https://instagram.com/ecoexpertrecycling",
    linkedin: "https://linkedin.com/company/ecoexpertrecycling",
  },
  users: [],
};
