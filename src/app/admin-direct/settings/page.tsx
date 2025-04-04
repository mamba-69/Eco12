"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiSettings,
  FiLayout,
  FiImage,
  FiUsers,
  FiSave,
  FiGlobe,
  FiType,
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import { useStore } from "@/app/lib/store";
import { broadcastSettingsChange } from "@/app/lib/sitebridge";
import { useRouter } from "next/navigation";

// Add improved admin auth check with consistent values for deployed version
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Inline AdminSidebar component for deployment compatibility
function AdminSidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src="https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
              alt="Eco-Expert Recycling"
              className="w-10 h-10 mr-3"
            />
            <div>
              <h2 className="text-lg font-bold flex items-center">
                <span className="text-green-600 dark:text-green-400">Eco-</span>
                Expert
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <a
              href="/admin-direct"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiHome className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a
              href="/admin-direct/content"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiLayout className="w-5 h-5 mr-3" />
              Content
            </a>
            <a
              href="/admin-direct/media"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiImage className="w-5 h-5 mr-3" />
              Media
            </a>
            <a
              href="/admin-direct/users"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiUsers className="w-5 h-5 mr-3" />
              Users
            </a>
            <a
              href="/admin-direct/settings"
              className="flex items-center px-4 py-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg font-medium"
            >
              <FiSettings className="w-5 h-5 mr-3" />
              Settings
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-1">
              Direct Admin Access
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This admin panel bypasses authentication for development purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectSettingsManagement() {
  const { siteSettings, updateSiteSettings } = useStore();
  const [activeTab, setActiveTab] = useState("general");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Form states with defaults from store
  const [siteName, setSiteName] = useState("Eco-Expert Recycling");
  const [siteDescription, setSiteDescription] = useState(
    "Leading e-waste recycling company with sustainable solutions for a greener future."
  );
  const [primaryColor, setPrimaryColor] = useState("#2ECC71");
  const [logoUrl, setLogoUrl] = useState(
    "https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
  );
  const [footerText, setFooterText] = useState(
    `© ${new Date().getFullYear()} EcoExpert. All rights reserved.`
  );
  const [contactEmail, setContactEmail] = useState("connect@ecoverva.com");
  const [contactPhone, setContactPhone] = useState("1800-120-ECOV");
  const [contactAddress, setContactAddress] = useState(
    "Unit 1116, 1117 & 1119, 11th Floor BPTP Park Centra, Sector 30 NH8, Gurgaon, Haryana 122001"
  );
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  });

  // Check for admin authentication
  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminCookie = document.cookie.includes("admin-session=true");
        const adminLocalStorage = localStorage.getItem("is-admin") === "true";

        if (!adminCookie && !adminLocalStorage) {
          console.log("Admin authentication required");
          router.push("/auth/login");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth/login");
        return false;
      }
    };

    if (!checkAdminAuth()) {
      return;
    }

    // Load settings from store when component mounts
    if (siteSettings) {
      setSiteName(siteSettings.siteName || "Eco-Expert Recycling");
      setSiteDescription(
        siteSettings.siteDescription ||
          "Leading e-waste recycling company with sustainable solutions for a greener future."
      );
      setPrimaryColor(siteSettings.primaryColor || "#2ECC71");
      setLogoUrl(
        siteSettings.logoUrl ||
          "https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
      );
      setFooterText(
        siteSettings.footerText ||
          `© ${new Date().getFullYear()} EcoExpert. All rights reserved.`
      );
      setContactEmail(siteSettings.contactEmail || "connect@ecoverva.com");
      setContactPhone(siteSettings.contactPhone || "1800-120-ECOV");
      setContactAddress(
        siteSettings.contactAddress ||
          "Unit 1116, 1117 & 1119, 11th Floor BPTP Park Centra, Sector 30 NH8, Gurgaon, Haryana 122001"
      );
      setSocialLinks(
        siteSettings.socialLinks || {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
        }
      );
    }
  }, [siteSettings, router]);

  // Handle form submission for General settings
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      siteName,
      siteDescription,
    };

    // Update the store
    updateSiteSettings(updatedSettings);

    // Broadcast the changes to client components
    broadcastSettingsChange(updatedSettings, "settings-update");

    showSuccessMessage();
  };

  // Handle form submission for Appearance settings
  const handleAppearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      primaryColor,
      logoUrl,
    };

    // Update the store
    updateSiteSettings(updatedSettings);

    // Broadcast the changes to client components
    broadcastSettingsChange(updatedSettings, "appearance-update");

    showSuccessMessage();
  };

  // Handle form submission for Footer settings
  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      footerText,
      contactEmail,
      contactPhone,
      contactAddress,
      socialLinks,
    };

    // Update the store
    updateSiteSettings(updatedSettings);

    // Broadcast the changes to client components
    broadcastSettingsChange(updatedSettings, "footer-update");

    showSuccessMessage();
  };

  // Helper for showing success message
  const showSuccessMessage = () => {
    setSuccessMessage(
      "Settings updated successfully! Changes are now live on the website."
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Handle social link changes
  const handleSocialLinkChange = (
    platform: keyof typeof socialLinks,
    value: string
  ) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="ml-64 flex-1 p-6 overflow-x-hidden">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your website's appearance and functionality
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center">
              <FiGlobe className="mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">{successMessage}</p>
                <p className="text-sm mt-1">
                  Changes have been applied to the live website.
                </p>
              </div>
            </div>
          )}

          {/* Settings Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto flex whitespace-nowrap">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "general"
                  ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FiType className="inline mr-1" /> General
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "appearance"
                  ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FiSettings className="inline mr-1" /> Appearance
            </button>
            <button
              onClick={() => setActiveTab("footer")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "footer"
                  ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FiClock className="inline mr-1" /> Footer & Contact
            </button>
          </div>

          {/* General Settings Tab */}
          {activeTab === "general" && (
            <form
              onSubmit={handleGeneralSubmit}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This appears in the browser tab and in SEO metadata
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Used for SEO and appears in search engine results
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600 transition-colors"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Appearance Settings Tab */}
          {activeTab === "appearance" && (
            <form
              onSubmit={handleAppearanceSubmit}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brand Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Primary color used throughout the website
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the URL of your logo image (upload via Media Library
                    first)
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600 transition-colors"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Footer Settings Tab */}
          {activeTab === "footer" && (
            <form
              onSubmit={handleFooterSubmit}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiMail className="inline mr-1" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiPhone className="inline mr-1" /> Contact Phone
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FiMapPin className="inline mr-1" /> Contact Address
                  </label>
                  <textarea
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <h3 className="font-medium border-b border-gray-200 dark:border-gray-700 pb-2">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiFacebook className="inline mr-1" /> Facebook URL
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) =>
                        handleSocialLinkChange("facebook", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiTwitter className="inline mr-1" /> Twitter URL
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter}
                      onChange={(e) =>
                        handleSocialLinkChange("twitter", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiInstagram className="inline mr-1" /> Instagram URL
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) =>
                        handleSocialLinkChange("instagram", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiLinkedin className="inline mr-1" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin}
                      onChange={(e) =>
                        handleSocialLinkChange("linkedin", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600 transition-colors"
                  >
                    <FiSave className="mr-2" />
                    Save Footer Settings
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Development Notice */}
          <div className="mt-6 text-center p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 rounded-lg">
            This is a development page designed to help bypass login issues. All
            changes made here will be synchronized in real-time with the live
            website.
          </div>
        </main>
      </div>
    </div>
  );
}
