"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/app/lib/store";
import { motion } from "framer-motion";
import { FiCheck, FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import { broadcastSettingsChange, debounce } from "@/app/lib/sitebridge";

// Lightweight form component
export default function FooterSettings() {
  const { siteSettings, updateSiteSettings } = useStore();
  
  // Form state
  const [footerText, setFooterText] = useState(siteSettings.footerText);
  const [contactEmail, setContactEmail] = useState(siteSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(siteSettings.contactPhone);
  const [contactAddress, setContactAddress] = useState(siteSettings.contactAddress);
  const [socialLinks, setSocialLinks] = useState({
    facebook: siteSettings.socialLinks.facebook,
    twitter: siteSettings.socialLinks.twitter,
    instagram: siteSettings.socialLinks.instagram,
    linkedin: siteSettings.socialLinks.linkedin,
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [livePreview, setLivePreview] = useState(false);

  // Create efficient preview function
  const previewChanges = debounce((settings) => {
    broadcastSettingsChange(settings, 'admin-footer-preview');
  }, 300); // Faster debounce for preview

  // Update social link
  const updateSocialLink = (platform: keyof typeof socialLinks, value: string) => {
    const updatedLinks = {
      ...socialLinks,
      [platform]: value,
    };
    
    setSocialLinks(updatedLinks);
    
    // If live preview is enabled, broadcast changes
    if (livePreview) {
      previewChanges({ socialLinks: updatedLinks });
    }
  };
  
  // Handle input change with optional live preview
  const handleInputChange = (
    setter: (value: string) => void,
    field: string,
    value: string
  ) => {
    setter(value);
    
    // If live preview is enabled, broadcast changes
    if (livePreview) {
      previewChanges({ [field]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Create new settings object with changes
    const updatedSettings = {
      footerText,
      contactEmail,
      contactPhone,
      contactAddress,
      socialLinks,
    };

    // Update store and broadcast
    updateSiteSettings(updatedSettings);
    broadcastSettingsChange(updatedSettings, 'admin-footer-save');

    // Show success message
    setIsLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Reset to default settings
  const handleReset = () => {
    const defaultSettings = {
      footerText: `© ${new Date().getFullYear()} EcoVerva. All rights reserved.`,
      contactEmail: "connect@ecoverva.com",
      contactPhone: "1800-120-ECOV",
      contactAddress: "Unit 1116, 1117 & 1119, 11th Floor BPTP Park Centra, Sector 30 NH8, Gurgaon, Haryana 122001",
      socialLinks: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
      }
    };
    
    // Update local state
    setFooterText(defaultSettings.footerText);
    setContactEmail(defaultSettings.contactEmail);
    setContactPhone(defaultSettings.contactPhone);
    setContactAddress(defaultSettings.contactAddress);
    setSocialLinks(defaultSettings.socialLinks);
    
    // Save and broadcast
    updateSiteSettings(defaultSettings);
    broadcastSettingsChange(defaultSettings, 'admin-footer-reset');
    
    // Show success message
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Toggle live preview
  const toggleLivePreview = () => {
    const newPreviewState = !livePreview;
    setLivePreview(newPreviewState);
    
    // If turning on preview, broadcast current state
    if (newPreviewState) {
      const currentSettings = {
        footerText,
        contactEmail,
        contactPhone,
        contactAddress,
        socialLinks,
      };
      broadcastSettingsChange(currentSettings, 'admin-footer-preview-toggle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Footer Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Customize the footer information and social links
            </p>
          </div>
          
          <button
            type="button"
            onClick={toggleLivePreview}
            className={`flex items-center px-3 py-1.5 rounded text-sm transition-colors ${
              livePreview 
                ? "bg-primary/20 text-primary" 
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {livePreview ? <FiEye className="mr-1" /> : <FiEyeOff className="mr-1" />}
            {livePreview ? "Live Preview" : "Live Preview Off"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Footer Text */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Footer Text</h3>
            <div className="space-y-2">
              <label htmlFor="footerText" className="block text-sm font-medium">
                Copyright Text
              </label>
              <input
                type="text"
                id="footerText"
                value={footerText}
                onChange={(e) => handleInputChange(setFooterText, 'footerText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="© 2023 EcoVerva. All rights reserved."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => handleInputChange(setContactEmail, 'contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="connect@ecoverva.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => handleInputChange(setContactPhone, 'contactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="1800-120-ECOV"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactAddress" className="block text-sm font-medium">
                Address
              </label>
              <textarea
                id="contactAddress"
                value={contactAddress}
                onChange={(e) => handleInputChange(setContactAddress, 'contactAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Your company address"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Links</h3>
            
            <div className="space-y-2">
              <label htmlFor="facebook" className="block text-sm font-medium">
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                value={socialLinks.facebook}
                onChange={(e) => updateSocialLink("facebook", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="https://facebook.com/your-page"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="twitter" className="block text-sm font-medium">
                Twitter
              </label>
              <input
                type="url"
                id="twitter"
                value={socialLinks.twitter}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="https://twitter.com/your-handle"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="instagram" className="block text-sm font-medium">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                value={socialLinks.instagram}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="https://instagram.com/your-handle"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="linkedin" className="block text-sm font-medium">
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="https://linkedin.com/company/your-company"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium transition-colors"
            >
              Reset to Default
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 flex items-center"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md flex items-center"
            >
              <FiCheck className="mr-2" />
              <span>Footer settings saved successfully!</span>
            </motion.div>
          )}
          
          {/* Live Preview Notice */}
          {livePreview && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md flex items-center text-sm">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
              <span>Live preview enabled - changes will be visible on other pages in real-time.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 