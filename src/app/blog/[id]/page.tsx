"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  author: string;
  date: string;
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const { contentSettings } = useStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (contentSettings?.blog) {
      const foundPost = contentSettings.blog.find(
        (p) => p.id === params.id && p.status === "Published"
      );

      if (foundPost) {
        setPost(foundPost);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
  }, [contentSettings, params.id]);

  // Listen for content setting changes
  useSettingsChangeListener((data) => {
    if (data.settings?.contentSettings?.blog) {
      const foundPost = data.settings.contentSettings.blog.find(
        (p) => p.id === params.id && p.status === "Published"
      );

      if (foundPost) {
        setPost(foundPost);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      console.log("Blog post updated from admin panel:", data.source);
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="w-full h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-6"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <span className="font-medium">{post.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
