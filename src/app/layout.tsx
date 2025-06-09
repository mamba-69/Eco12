import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "./components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "ECO-EXPERT Recycling Pvt. Ltd. | E-Waste Management",
  description: "Eco-Expert is India's top e-waste recycling company turning electronic waste into nature’s revival. Explore our sustainable tech solutions today.",
  keywords: "E-waste recycling, electronics waste, Eco Expert Recycling, sustainable tech India, e-waste management",
  verification: {
    google: "q4w13wAXU8uvOCDogG6g1ONxyqt_idPQCE1suAT385Q",
  },
  authors: [{ name: "Eco-Expert" }],
  creator: "Eco-Expert",
  publisher: "Eco-Expert",
  openGraph: {
    title: "Eco-Expert Recycling Pvt. Ltd.",
    description: "Turning e-waste into Earth’s second chance.",
    url: "https://ecoexpertrecycling.com/",
    siteName: "Eco-Expert",
    images: [
      {
        url: "https://ecoexpertrecycling.com/your-og-image.jpg",
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
    title: "Eco-Expert Recycling Pvt. Ltd.",
    description: "Turning e-waste into Earth’s second chance.",
    creator: "@EcoExpert", // Replace with actual Twitter handle
    images: ["https://ecoexpertrecycling.com/your-og-image.jpg"], // Replace with actual Twitter image
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://ecoexpertrecycling.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
