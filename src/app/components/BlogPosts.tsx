"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";

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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Load blog posts from store
  useEffect(() => {
    if (contentSettings?.blog && contentSettings.blog.length > 0) {
      // Only show published posts
      const publishedPosts = contentSettings.blog.filter(
        (post: BlogPost) => post.status === "Published"
      );
      setBlogPosts(publishedPosts);
    }
    setLoading(false);
  }, [contentSettings]);

  // Listen for content setting changes
  useSettingsChangeListener((data) => {
    if (data.settings?.contentSettings?.blog) {
      const publishedPosts = data.settings.contentSettings.blog.filter(
        (post: BlogPost) => post.status === "Published"
      );
      setBlogPosts(publishedPosts);
      console.log("Blog posts updated from admin panel:", data.source);
    }
  });

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="w-full p-8 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No blog posts available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {post.featuredImage && (
            <div className="h-48 overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.id}`}
              className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Read More
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
