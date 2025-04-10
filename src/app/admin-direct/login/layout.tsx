"use client";

import { Inter } from "next/font/google";
import "../../globals.css";
import ThemeProvider from "../../components/theme/ThemeProvider";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { DataProvider } from "@/app/contexts/DataContext";

// Configure Inter font
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
