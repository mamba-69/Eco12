"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
} from "react-icons/fi";
import { useStore } from "@/app/lib/store";

// Client component wrapper
interface MotionProps {
  children?: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  variants?: any;
  transition?: any;
  ref?: React.RefObject<any>;
  style?: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const MotionDiv = ({ children, ...props }: MotionProps) => {
  const [Component, setComponent] = useState<any>(() => (props: any) => (
    <div {...props}>{props.children}</div>
  ));

  useEffect(() => {
    let isMounted = true;
    import("framer-motion").then((mod) => {
      if (isMounted) {
        setComponent(() => mod.motion.div);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return <Component {...props}>{children}</Component>;
};

// Custom hook to replace useInView
function useClientInView(ref: React.RefObject<Element>, options = {}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "-100px" }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInView;
}

// Define the type for media items
interface MediaItem {
  type?: "image" | "video";
  title?: string;
  description?: string;
  src?: string;
  thumbnail?: string;
  id?: string;
  name?: string;
  url?: string;
  publicId?: string;
  uploadedAt?: string;
  inMediaSlider?: boolean;
}

// Define props interface for the component
interface MediaSliderProps {
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  isPaused?: boolean;
}

// Define the default media items
const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    type: "image",
    title: "Environmental Sustainability",
    description: "Working together for a greener future",
    src: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=320&h=180&q=80",
  },
  {
    type: "image",
    title: "Recycling Initiative",
    description: "Making a difference through proper waste management",
    src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=320&h=180&q=80",
  },
  {
    type: "image",
    title: "E-Waste Management",
    description: "Proper disposal and recycling of electronic waste",
    src: "https://images.unsplash.com/photo-1605600659873-d808a13e4d29?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d29?auto=format&fit=crop&w=320&h=180&q=80",
  },
];

export function MediaSlider() {
  // Get media items from store
  const { contentSettings } = useStore();

  // States for slider functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // Default media items to use if none in store
  const FALLBACK_MEDIA_ITEMS: MediaItem[] = [
    {
      type: "image",
      title: "Environmental Sustainability",
      description: "Working together for a greener future",
      src: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      name: "Environmental Sustainability",
      id: "1",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Recycling Initiative",
      description: "Making a difference through proper waste management",
      src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
      url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
      name: "Recycling Initiative",
      id: "2",
      inMediaSlider: true,
    },
  ];

  // Initialize media items and set up auto-advance timer
  useEffect(() => {
    // Set loading state
    setLoading(true);

    // Check if we have media items from content settings
    if (contentSettings?.media?.images?.length > 0) {
      // Filter only items marked for slider
      const sliderItems = contentSettings.media.images.filter(
        (item) => item.inMediaSlider
      );

      if (sliderItems.length > 0) {
        console.log("Using media items from store:", sliderItems);
        setMediaItems(sliderItems);
      } else {
        console.log("No slider items found in store, using defaults");
        setMediaItems(FALLBACK_MEDIA_ITEMS);
      }
    } else {
      console.log("No media items in store, using defaults");
      setMediaItems(FALLBACK_MEDIA_ITEMS);
    }

    setLoading(false);

    // Auto advance slides when playing is true
    const interval = setInterval(() => {
      if (isPlaying) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [contentSettings, isPlaying]);

  // Function to go to next slide
  const nextSlide = () => {
    if (mediaItems.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to previous slide
  const prevSlide = () => {
    if (mediaItems.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute for videos
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-lg">
        <div className="text-gray-400 dark:text-gray-500">Loading media...</div>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <div className="text-center px-4">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No Media Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add media items to the slider in the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];
  const isVideo =
    currentItem?.url?.match(/\.(mp4|webm|ogg)$/i) ||
    currentItem?.src?.match(/\.(mp4|webm|ogg)$/i);
  const imageUrl = currentItem?.url || currentItem?.src;
  const itemTitle = currentItem?.name || currentItem?.title;
  const itemDescription = currentItem?.description;

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-black rounded-lg shadow-lg">
      {/* Current slide */}
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            src={imageUrl}
            className="w-full h-full object-contain"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={(e) => {
              console.error("Video error:", e);
              const target = e.target as HTMLVideoElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <img
              src={imageUrl}
              alt={itemTitle || "Slide image"}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                console.error("Image error:", imageUrl);
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>
        )}

        {/* Overlay for better text contrast - only at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 text-shadow-sm">
          {itemTitle || "Eco-Expert Initiative"}
        </h2>
        <p className="text-shadow-sm max-w-2xl">
          {itemDescription || "Transforming waste into valuable resources"}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 transform -translate-y-1/2">
        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-colors"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-colors"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-6 space-x-1 z-10">
        {mediaItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex
                ? "bg-green-500"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause and Mute controls (for videos) */}
      <div className="absolute top-4 right-4 space-x-2 flex">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white transition-colors"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>

        {isVideo && (
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  clipRule="evenodd"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
