"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiLayout,
  FiImage,
  FiUsers,
  FiSettings,
} from "@/app/lib/icons";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <FiHome className="w-5 h-5" />,
      href: "/admin-direct",
      active: isActiveLink("/admin-direct") && pathname === "/admin-direct",
    },
    {
      name: "Content",
      icon: <FiLayout className="w-5 h-5" />,
      href: "/admin-direct/content",
      active: isActiveLink("/admin-direct/content"),
    },
    {
      name: "Media",
      icon: <FiImage className="w-5 h-5" />,
      href: "/admin-direct/media",
      active: isActiveLink("/admin-direct/media"),
    },
    {
      name: "Users",
      icon: <FiUsers className="w-5 h-5" />,
      href: "/admin-direct/users",
      active: isActiveLink("/admin-direct/users"),
    },
    {
      name: "Settings",
      icon: <FiSettings className="w-5 h-5" />,
      href: "/admin-direct/settings",
      active: isActiveLink("/admin-direct/settings"),
    },
  ];

  return (
    <aside className="w-64 lg:w-72 hidden md:flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin-direct" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-lg font-semibold dark:text-white">
            Guj Admin
          </span>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Direct access mode
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                }`}
              >
                <span
                  className={`${
                    item.active
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-1">
            Direct Admin Access
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This admin panel bypasses authentication for development purposes.
          </p>
        </div>
      </div>
    </aside>
  );
}
