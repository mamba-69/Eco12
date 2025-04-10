"use client";

import { Inter } from "next/font/google";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { DataProvider } from "@/app/contexts/DataContext";
import AppwriteInit from "./AppwriteInit";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ThemeProvider from "../theme/ThemeProvider";
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

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/admin-direct/login");

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <AppwriteInit />
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
