"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/app/lib/store";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  author: string;
  date: string;
  featuredImage?: string;
}

export default function BlogPosts() {
  const { contentSettings } = useStore();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Load blog posts from content settings
  useEffect(() => {
    setLoading(true);

    const blogPosts = contentSettings?.blog || [];

    if (blogPosts.length > 0) {
      // Only show published posts
      const publishedPosts = blogPosts.filter(
        (post) => post.status === "Published"
      );
      setPosts(publishedPosts);
    } else {
      // Default posts if none exist
      setPosts([
        {
          id: "1",
          title: "Understanding E-Waste Management",
          excerpt: "Learn about the importance of proper e-waste disposal.",
          content: "E-waste management is crucial for our planet's health...",
          status: "Published",
          author: "Admin",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          title: "The Impact of Recycling Electronics",
          excerpt: "Discover how recycling electronics can make a difference.",
          content: "Recycling electronics has a significant positive impact...",
          status: "Published",
          author: "Admin",
          date: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  }, [contentSettings]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No Blog Posts Yet</h3>
        <p className="text-muted-foreground mb-6">
          Check back soon for articles on e-waste management and sustainability.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-card hover:bg-card/80 transition-colors rounded-lg overflow-hidden shadow-sm border border-border"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">
              <Link
                href={`/blog/${post.id}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>By {post.author}</span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
