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
  contactEmail: "Ecoexpertreclycling@gmail.com",
  contactPhone: "+91 70964 44414",
  contactAddress: "Survey No. 209/1/2, Ward No. 08, Ambedkar Ward, Neemuch City, Neemuch-458441, Madhya Pradesh.",
  socialLinks: {
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/company/",
  },
  users: [],
};
