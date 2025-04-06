import { Inter } from "next/font/google";
import "../globals.css";
import ThemeProvider from "../components/theme/ThemeProvider";
import { StoreProvider } from "../components/layout/StoreProvider";
import FirebaseInit from "../components/layout/FirebaseInit";
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

export const metadata = {
  title: "Admin Panel - Eco-Expert Recycling",
  description: "Admin dashboard for Eco-Expert Recycling website",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} admin-layout`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <StoreProvider>
            <FirebaseInit />
            <ClientAdminLayout>{children}</ClientAdminLayout>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
