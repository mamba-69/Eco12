"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function BlogPostPage() {
  const params = useParams();
  const postId = (params?.id as string) || "";
  const { contentSettings } = useStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!postId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Find the post in contentSettings
    const blogPosts = contentSettings?.blog || [];
    const foundPost = blogPosts.find((p) => p?.id === postId);

    if (foundPost) {
      setPost(foundPost);
      setLoading(false);
      return;
    }

    // If post not found, use a default
    setPost({
      id: postId,
      title: "Understanding E-Waste Management",
      excerpt: "Learn about the importance of proper e-waste disposal.",
      content: `
        <p>E-waste management is crucial for our planet's health. As technology evolves at an ever-increasing pace, electronic devices quickly become obsolete, contributing to the growing electronic waste crisis.</p>
        
        <h2>Why E-Waste Management Matters</h2>
        
        <p>Electronic waste contains hazardous materials that can be harmful to the environment and human health if not properly handled:</p>
        
        <ul>
          <li>Lead and mercury from circuits and displays can contaminate soil and water</li>
          <li>Flame retardants in plastic components can release toxic chemicals</li>
          <li>Valuable metals like gold, silver, and copper are lost when devices are disposed of improperly</li>
        </ul>
        
        <p>By implementing proper e-waste management practices, we can mitigate these risks and recover valuable resources.</p>
        
        <h2>Best Practices for E-Waste Disposal</h2>
        
        <p>Here are some best practices for handling electronic waste:</p>
        
        <ol>
          <li>Consider repairing or upgrading devices before replacing them</li>
          <li>Donate working electronics to schools, charities, or community organizations</li>
          <li>Use manufacturer or retailer take-back programs</li>
          <li>Find certified e-waste recyclers for end-of-life devices</li>
          <li>Remove and properly dispose of batteries before recycling</li>
        </ol>
        
        <p>At Eco-Expert, we provide comprehensive e-waste management solutions for businesses and individuals. Contact us to learn more about our services.</p>
      `,
      status: "Published",
      author: "Admin",
      date: new Date().toISOString(),
    });

    setLoading(false);
  }, [contentSettings, postId]);

  // Listen for content setting changes
  useSettingsChangeListener((data) => {
    if (data?.contentSettings?.blog) {
      const blogPosts = data.contentSettings.blog || [];
      const foundPost = blogPosts.find(
        (p: BlogPost) => p.id === postId && p.status === "Published"
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>

            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>

            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to all posts
        </Link>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center text-muted-foreground mb-8">
          <span className="mr-4">By {post.author}</span>
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
