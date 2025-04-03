"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { AuthProvider } from "@/app/context/AuthContext";
import Link from "next/link";
import {
  FiHome,
  FiSettings,
  FiLayout,
  FiImage,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

// This is the actual component that uses the useAuth hook
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Protect the admin routes, but wait for auth to initialize
  useEffect(() => {
    // Set a timeout to allow the auth state to be properly loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (user === null) {
        // No user is logged in
        router.push("/auth/login");
      } else if (!isAdmin) {
        // User is logged in but not an admin
        router.push("/auth/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAdmin, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="animate-spin text-primary mb-4 mx-auto">
            <FiLoader size={48} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Loading</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access the admin area.
          </p>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      name: "Content",
      href: "/admin/content",
      icon: <FiLayout className="w-5 h-5" />,
    },
    {
      name: "Media",
      href: "/admin/media",
      icon: <FiImage className="w-5 h-5" />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings/footer",
      icon: <FiSettings className="w-5 h-5" />,
      submenu: [
        {
          name: "Footer",
          href: "/admin/settings/footer",
        },
        {
          name: "Appearance",
          href: "/admin/settings/appearance",
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full hidden md:block shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="bg-primary/10 p-2 rounded-md mr-2">
              <FiSettings className="w-5 h-5 text-primary" />
            </span>
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.submenu &&
                  link.submenu.some((sublink) => pathname === sublink.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>

                  {/* Submenu */}
                  {link.submenu && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {link.submenu.map((sublink) => {
                        const isSubActive = pathname === sublink.href;

                        return (
                          <li key={sublink.href}>
                            <Link
                              href={sublink.href}
                              className={`block px-4 py-2 rounded-md transition-colors ${
                                isSubActive
                                  ? "bg-primary/5 text-primary"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              {sublink.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 flex-1 p-6">
        {/* Mobile header */}
        <div className="block md:hidden mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <button
              className="p-2 rounded-md bg-white dark:bg-gray-800 shadow"
              onClick={() => {
                // Toggle mobile menu
                const sidebar = document.querySelector("aside");
                sidebar?.classList.toggle("hidden");
              }}
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Notification area for admin changes */}
        <div id="admin-notifications" className="sticky top-0 z-50 mb-4">
          {/* Real-time notifications will appear here through the SiteBridge system */}
        </div>

        {/* Page content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Wrapper component that provides the AuthProvider
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
