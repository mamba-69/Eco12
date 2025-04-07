"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { databases, COLLECTIONS, DATABASE_ID } from "../lib/appwrite";
import { Models } from "appwrite";

interface ContentSettings {
  hero: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
  };
  mission: {
    description: string;
    points: string[];
  };
  achievements: {
    devicesRecycled: number;
    tonsProcessed: number;
    treesSaved: number;
    communityPrograms: number;
  };
  videos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  media: {
    id: string;
    name: string;
    url: string;
    type: "image" | "video";
    description: string;
    inSlider: boolean;
  }[];
  pages: {
    id: string;
    title: string;
    path: string;
    content: string;
    lastUpdated: string;
  }[];
  blog: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    status: "draft" | "published";
    author: string;
    publishedAt: string;
  }[];
}

interface DataContextType {
  contentSettings: ContentSettings | null;
  loading: boolean;
  error: string | null;
  updateContent: (data: Partial<ContentSettings>) => Promise<void>;
  refreshContent: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  contentSettings: null,
  loading: true,
  error: null,
  updateContent: async () => {},
  refreshContent: async () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [contentSettings, setContentSettings] =
    useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.CONTENT,
        "main"
      );
      setContentSettings(response as unknown as ContentSettings);
      setError(null);
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (data: Partial<ContentSettings>) => {
    try {
      if (!contentSettings) return;

      const updatedContent = {
        ...contentSettings,
        ...data,
      };

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CONTENT,
        "main",
        updatedContent
      );

      setContentSettings(updatedContent);
      setError(null);
    } catch (error) {
      console.error("Error updating content:", error);
      setError("Failed to update content");
      throw error;
    }
  };

  const refreshContent = async () => {
    setLoading(true);
    await fetchContent();
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <DataContext.Provider
      value={{
        contentSettings,
        loading,
        error,
        updateContent,
        refreshContent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
