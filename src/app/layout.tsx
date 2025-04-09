import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "./components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "E-Waste Recycling",
  description: "Sustainable e-waste recycling solutions",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
