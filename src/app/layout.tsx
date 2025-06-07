import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "./components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "Eco-Expert E-Waste Recycling - Sustainable Solutions for a Greener Future",
  description: "Eco-Expert provides comprehensive e-waste recycling solutions, material recovery, data destruction, and community education. Join us in building a sustainable future by responsibly managing electronic waste.",
  keywords: "e-waste recycling, electronic waste, sustainable solutions, material recovery, data destruction, community education, eco-friendly, recycling services, responsible disposal, green technology",
  authors: [{ name: "Eco-Expert" }],
  creator: "Eco-Expert",
  publisher: "Eco-Expert",
  openGraph: {
    title: "Eco-Expert E-Waste Recycling",
    description: "Sustainable e-waste recycling solutions for a greener planet.",
    url: "https://www.ecoexpert.com", // Replace with actual domain
    siteName: "Eco-Expert",
    images: [
      {
        url: "https://www.ecoexpert.com/og-image.jpg", // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: "Eco-Expert E-Waste Recycling",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco-Expert E-Waste Recycling",
    description: "Sustainable e-waste recycling solutions for a greener planet.",
    creator: "@EcoExpert", // Replace with actual Twitter handle
    images: ["https://www.ecoexpert.com/twitter-image.jpg"], // Replace with actual Twitter image
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
