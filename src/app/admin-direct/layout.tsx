import { Inter } from "next/font/google";
import "../globals.css";
import AdminClientLayout from "./client-admin-layout";

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
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
