"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Inter } from "next/font/google";
import "../globals.css";
import ThemeProvider from "../components/theme/ThemeProvider";
import { StoreProvider } from "../components/layout/StoreProvider";
import ClientAdminLayout from "./client-layout";

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

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/admin-direct/login");
    }
  }, [isAuthenticated, loading, router, mounted]);

  // Don't render anything until after hydration to prevent mismatch
  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} admin-layout`}
          suppressHydrationWarning
        >
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </body>
      </html>
    );
  }

  if (loading) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} admin-layout`}
          suppressHydrationWarning
        >
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} admin-layout`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <StoreProvider>
            <ClientAdminLayout>{children}</ClientAdminLayout>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
