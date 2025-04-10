"use client";

import { useEffect, useRef } from "react";
import "../../globals.css";
import ThemeProvider from "../../components/theme/ThemeProvider";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { DataProvider } from "@/app/contexts/DataContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMounted = useRef(true);

  // Prevent memory leaks and updates after unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
