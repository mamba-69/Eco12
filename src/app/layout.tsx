"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/theme/ThemeProvider";
import { StoreProvider } from "./components/layout/StoreProvider";
import FirebaseInit from "./components/layout/FirebaseInit";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { usePathname } from "next/navigation";

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
  title: "Eco-Expert Recycling - Electronic Waste Management Solutions",
  description:
    "Specialized in electronic waste recycling, data destruction, and IT asset management. Eco-friendly solutions for businesses and organizations.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin-direct");

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <StoreProvider>
            <FirebaseInit />
            <div className="flex-1 flex flex-col">
              {!isAdminPage && <Navbar />}
              <main className="flex-1 isolate relative">{children}</main>
              {!isAdminPage && (
                <div className="mt-auto">
                  <Footer />
                </div>
              )}
            </div>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
