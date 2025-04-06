"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ThemeProvider from "../components/theme/ThemeProvider";
import { StoreProvider } from "../components/layout/StoreProvider";
import FirebaseInit from "../components/layout/FirebaseInit";
import { useEffect, useState } from "react";

// Configure Inter font with fallback to system fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Admin Panel - Eco-Expert Recycling",
  description: "Admin dashboard for Eco-Expert Recycling website",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use client-side only rendering for the admin section
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Add a class to the body to prevent the main layout's footer from appearing
    document.body.classList.add("admin-page");

    // Clean up on unmount
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  // Don't render anything during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning></body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} admin-layout`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <StoreProvider>
            <FirebaseInit />
            {/* Admin-specific layout that doesn't include the global footer */}
            <div className="min-h-screen flex flex-col isolate bg-gray-100 dark:bg-gray-900">
              {children}
            </div>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
