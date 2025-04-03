"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/app/lib/store";
import { motion } from "framer-motion";
import { FiCheck, FiUpload } from "react-icons/fi";

export default function AppearanceSettings() {
  const { siteSettings, updateSiteSettings } = useStore();
  const [primaryColor, setPrimaryColor] = useState(siteSettings.primaryColor);
  const [logoUrl, setLogoUrl] = useState(siteSettings.logoUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Common predefined colors
  const predefinedColors = [
    "#2ECC71", // Green (Current)
    "#3498DB", // Blue
    "#9B59B6", // Purple
    "#E74C3C", // Red
    "#F39C12", // Orange
    "#1ABC9C", // Teal
    "#34495E", // Dark Blue
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateSiteSettings({
        primaryColor,
        logoUrl,
      });

      setIsLoading(false);
      setIsSaved(true);

      // Hide success message after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  // Reset to default settings
  const handleReset = () => {
    setPrimaryColor("#2ECC71");
    setLogoUrl("/images/logo.svg");
  };

  // Select a predefined color
  const selectColor = (color: string) => {
    setPrimaryColor(color);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Appearance Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize the look and feel of your website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Brand Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Brand Colors</h3>
            <div className="space-y-2">
              <label htmlFor="primaryColor" className="block text-sm font-medium">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <input
                  type="text"
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="#2ECC71"
                />
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 p-0 border-0"
                />
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Predefined Colors:
                </span>
                <div className="flex space-x-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => selectColor(color)}
                      className={`w-6 h-6 rounded-full ${
                        primaryColor === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logo Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Logo Settings</h3>
            <div className="space-y-2">
              <label htmlFor="logoUrl" className="block text-sm font-medium">
                Logo URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="/images/logo.svg"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center space-x-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiUpload size={18} />
                  <span>Upload</span>
                </button>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="text-sm font-medium mb-2">Logo Preview</div>
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-md">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-16 object-contain"
                  />
                ) : (
                  <span className="text-gray-400">No logo selected</span>
                )}
              </div>
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
              className="px-6 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? "Saving..." : "Save Changes"}
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
              <span>Settings saved successfully!</span>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
} 