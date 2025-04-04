"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiSettings,
  FiLayout,
  FiImage,
  FiUsers,
  FiEdit,
  FiPlusCircle,
  FiExternalLink,
  FiRefreshCw,
  FiTrendingUp,
  FiMail,
  FiFileText,
  FiGlobe,
  FiInfo,
  FiUpload,
  FiLayers,
} from "react-icons/fi";
import { useStore } from "@/app/lib/store";
import { useRouter } from "next/navigation";

// Add improved admin auth check with fallback to deployed version credentials
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminDirectDashboard() {
  const { siteSettings, contentSettings } = useStore();
  const [lastUpdated, setLastUpdated] = useState<string>("Loading...");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for admin authentication
    const checkAdminAuth = () => {
      try {
        // Multiple checks for admin authentication
        const adminCookie = document.cookie.includes("admin-session=true");
        const adminLocalStorage = localStorage.getItem("is-admin") === "true";
        const adminEmail = localStorage.getItem("admin-email");

        // Backdoor for development: If it's the first load, automatically set admin status
        if (
          !adminCookie &&
          !adminLocalStorage &&
          !sessionStorage.getItem("admin-checked")
        ) {
          console.log("First visit: Setting admin status for development");
          localStorage.setItem("is-admin", "true");
          localStorage.setItem("admin-email", ADMIN_EMAIL);
          sessionStorage.setItem("admin-checked", "true");
          document.cookie = `admin-session=true;path=/;max-age=${60 * 60 * 24}`;
          return true;
        }

        // Normal auth check
        if (!adminCookie && !adminLocalStorage) {
          console.log("Admin authentication failed, redirecting to login");
          router.push("/auth/login");
          return false;
        }

        console.log("Admin authenticated:", adminEmail);
        return true;
      } catch (error) {
        console.error("Auth check error:", error);
        // Fallback for client-side issues
        return true;
      }
    };

    const authStatus = checkAdminAuth();
    setIsAuthenticated(authStatus);

    if (authStatus) {
      // Set last updated time
      setLastUpdated(new Date().toLocaleString());
    }
  }, [router]);

  // Don't render content until authentication is confirmed
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Authenticating...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    );
  }

  // Statistics and quick info data
  const siteStats = [
    {
      label: "Total Pages",
      value: "15",
      icon: <FiFileText className="w-5 h-5" />,
    },
    {
      label: "Media Files",
      value: contentSettings?.media?.images?.length?.toString() || "6",
      icon: <FiImage className="w-5 h-5" />,
    },
    {
      label: "Users",
      value: "4", // Static for now, no users in SiteSettings
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      label: "Visits Today",
      value: "128",
      icon: <FiTrendingUp className="w-5 h-5" />,
    },
  ];

  // Quick links for main admin areas
  const mainFeatures = [
    {
      title: "Content Management",
      description: "Manage website content, pages and blog posts",
      icon: <FiLayout className="w-10 h-10 text-blue-500" />,
      link: "/admin-direct/content",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Media Library",
      description: "Upload and manage images and media files",
      icon: <FiImage className="w-10 h-10 text-purple-500" />,
      link: "/admin-direct/media",
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: <FiUsers className="w-10 h-10 text-amber-500" />,
      link: "/admin-direct/users",
      color: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Site Settings",
      description: "Configure site-wide settings and appearance",
      icon: <FiSettings className="w-10 h-10 text-emerald-500" />,
      link: "/admin-direct/settings",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  // Quick actions for common tasks
  const quickActions = [
    {
      name: "Upload Media",
      icon: <FiUpload className="w-4 h-4" />,
      link: "/admin-direct/media?upload=true",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
    {
      name: "Add New Page",
      icon: <FiPlusCircle className="w-4 h-4" />,
      link: "/admin-direct/content?new=page",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      name: "Edit Footer",
      icon: <FiEdit className="w-4 h-4" />,
      link: "/admin-direct/settings?section=footer",
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    {
      name: "View Website",
      icon: <FiExternalLink className="w-4 h-4" />,
      link: "/",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      newTab: true,
    },
  ];

  // Recent activities (mocked)
  const recentActivity = [
    { action: "Settings updated", user: "Admin", time: "10 minutes ago" },
    { action: "New image uploaded", user: "Admin", time: "2 hours ago" },
    { action: "Homepage content edited", user: "Admin", time: "1 day ago" },
    { action: "New user added", user: "Admin", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="ml-64 flex-1 p-6">
          {/* Header section */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white shadow-lg mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                Direct Access Mode
              </div>
            </div>
            <p className="text-green-100 mb-4">
              Manage your website content and settings without authentication
            </p>
            <div className="flex items-center text-xs text-green-100">
              <FiRefreshCw className="mr-1" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {siteStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main features */}
          <h2 className="text-xl font-bold mb-4">Main Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {mainFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="block group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <div
                  className={`p-6 ${feature.color} transition-colors duration-200`}
                >
                  {feature.icon}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions & Recent activity section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.link}
                      target={action.newTab ? "_blank" : undefined}
                      rel={action.newTab ? "noopener noreferrer" : undefined}
                      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${action.color} transition-transform duration-200 group-hover:scale-110`}
                      >
                        {action.icon}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {action.name}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Additional info section */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-bold mb-3 flex items-center text-gray-800 dark:text-gray-200">
                    <FiInfo className="mr-2" /> Key Information
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      The Direct Admin interface provides access to all site
                      management features without requiring authentication. This
                      is designed for development purposes to bypass any login
                      issues you might encounter with the regular admin panel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
                      <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center text-sm mb-1">
                        <FiGlobe className="mr-1" /> Site Configuration
                      </h4>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        Changes made here will be immediately reflected on your
                        website
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
                      <h4 className="font-medium text-purple-800 dark:text-purple-300 flex items-center text-sm mb-1">
                        <FiLayers className="mr-1" /> Content Organization
                      </h4>
                      <p className="text-xs text-purple-700 dark:text-purple-400">
                        Organize content in the Media Library and Content
                        Manager
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start pb-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {activity.action}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{activity.user}</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                    Have feedback?
                  </h3>
                  <Link
                    href="mailto:support@example.com"
                    className="flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm hover:underline transition-colors duration-200"
                  >
                    <FiMail className="mr-2" />
                    Contact support team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Fixed the AdminSidebar component with direct img tag
function AdminSidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src="https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
              alt="Eco-Expert Recycling"
              className="w-10 h-10 mr-3 object-contain"
              onError={(e) => {
                // Fallback to local logo if the remote one fails
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = "/images/logo.svg";
              }}
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
              className="flex items-center px-4 py-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg font-medium"
            >
              <FiHome className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a
              href="/admin-direct/content"
              className="flex items-center px-4 py-3 transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg font-medium"
            >
              <FiLayout className="w-5 h-5 mr-3" />
              Content
            </a>
            <a
              href="/admin-direct/media"
              className="flex items-center px-4 py-3 transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg font-medium"
            >
              <FiImage className="w-5 h-5 mr-3" />
              Media
            </a>
            <a
              href="/admin-direct/users"
              className="flex items-center px-4 py-3 transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg font-medium"
            >
              <FiUsers className="w-5 h-5 mr-3" />
              Users
            </a>
            <a
              href="/admin-direct/settings"
              className="flex items-center px-4 py-3 transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg font-medium"
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
