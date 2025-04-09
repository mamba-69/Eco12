"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import AppwriteInit from "./components/layout/AppwriteInit";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ThemeProvider from "./components/theme/ThemeProvider";
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
  title: "E-Waste Recycling",
  description: "Sustainable e-waste recycling solutions",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/admin-direct/login");

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              {!isLoginPage && <AppwriteInit />}
              <div className="flex-1 flex flex-col">
                {!isLoginPage && <Navbar />}
                <main className="flex-1 isolate relative">{children}</main>
                {!isLoginPage && <Footer />}
              </div>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
