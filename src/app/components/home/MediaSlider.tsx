"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/app/lib/store";
import { FiChevronLeft, FiChevronRight, FiMaximize } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

export function MediaSlider() {
  // Get media items from store
  const { contentSettings } = useStore();

  // States for slider functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Default media items to use if none in store
  const FALLBACK_MEDIA_ITEMS: MediaItem[] = [
    {
      type: "image",
      title: "E-waste mountains",
      src: "https://iili.io/F20DHfp.md.jpg",
      url: "https://iili.io/F20DHfp.md.jpg",
      name: "E-waste mountains",
      id: "1",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Toxic components",
      src: "https://iili.io/F20ti0B.md.jpg",
      url: "https://iili.io/F20ti0B.md.jpg",
      name: "Toxic components",
      id: "2",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Informal recycling dangers",
      src: "https://iili.io/F20tZ5F.md.jpg",
      url: "https://iili.io/F20tZ5F.md.jpg",
      name: "Informal recycling dangers",
      id: "3",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Child labor in e-waste",
      src: "https://iili.io/F20tDba.md.jpg",
      url: "https://iili.io/F20tDba.md.jpg",
      name: "Child labor in e-waste",
      id: "4",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Resource depletion",
      src: "https://iili.io/F20DRee.md.jpg",
      url: "https://iili.io/F20DRee.md.jpg",
      name: "Resource depletion",
      id: "5",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Certified recycling facility",
      src: "https://iili.io/F20D11V.md.jpg",
      url: "https://iili.io/F20D11V.md.jpg",
      name: "Certified recycling facility",
      id: "6",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Automated sorting",
      src: "https://iili.io/F20D0qQ.md.jpg",
      url: "https://iili.io/F20D0qQ.md.jpg",
      name: "Automated sorting",
      id: "7",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Material recovery",
      src: "https://iili.io/F20DMdP.md.jpg",
      url: "https://iili.io/F20DMdP.md.jpg",
      name: "Material recovery",
      id: "8",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Refurbished electronics",
      src: "https://iili.io/F20DV71.md.jpg",
      url: "https://iili.io/F20DV71.md.jpg",
      name: "Refurbished electronics",
      id: "9",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Community drop-off point",
      src: "https://iili.io/F20DwhJ.md.jpg",
      url: "https://iili.io/F20DwhJ.md.jpg",
      name: "Community drop-off point",
      id: "10",
      inMediaSlider: true,
    },
    {
      type: "image",
      title: "Sustainable product design",
      src: "https://iili.io/F20DXmg.md.jpg",
      url: "https://iili.io/F20DXmg.md.jpg",
      name: "Sustainable product design",
      id: "11",
      inMediaSlider: true,
    },
  ];

  // Initialize media items and set up auto-rotation
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
        setMediaItems(sliderItems);
      } else {
        setMediaItems(FALLBACK_MEDIA_ITEMS);
      }
    } else {
      setMediaItems(FALLBACK_MEDIA_ITEMS);
    }

    setLoading(false);

    // Auto rotate the 3D slider
    const interval = setInterval(() => {
      if (!isDragging) {
        setRotation((prev) => prev - 36); // Rotate 36 degrees (360 / 10 items)
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [contentSettings, isDragging]);

  // State for fullscreen preview
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

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

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && !showFullscreen) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isDragging, mediaItems.length, showFullscreen]);

  // Handle fullscreen preview
  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setShowFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
    document.body.style.overflow = "";
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

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-gray-800">
      {/* Main Slider */}
      <div ref={sliderRef} className="relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {mediaItems[currentIndex]?.type === "video" ? (
              <div className="relative w-full h-full">
                <video
                  src={
                    mediaItems[currentIndex].url || mediaItems[currentIndex].src
                  }
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    {mediaItems[currentIndex].name ||
                      mediaItems[currentIndex].title}
                  </h3>
                </div>
              </div>
            ) : (
              <div
                className="relative w-full h-full group cursor-pointer"
                onClick={() => openFullscreen(currentIndex)}
              >
                {mediaItems[currentIndex]?.url && (
                  <Image
                    src={mediaItems[currentIndex].url}
                    alt={mediaItems[currentIndex].name || "Media item"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-4 right-4">
                    <FiMaximize className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    {mediaItems[currentIndex].name ||
                      mediaItems[currentIndex].title}
                  </h3>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-primary/10 to-transparent opacity-50"></div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all transform hover:scale-110 hover:-translate-x-1 shadow-lg"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all transform hover:scale-110 hover:translate-x-1 shadow-lg"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-6 left-0 right-0 px-8 z-10">
        <div className="flex justify-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          {mediaItems.map((item, index) => (
            <button
              key={item.id || index}
              className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? "ring-2 ring-primary scale-105"
                  : "ring-1 ring-white/30 hover:ring-white/70"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
              ) : (
                item.url && (
                  <Image
                    src={item.url}
                    alt={item.name || "Thumbnail"}
                    fill
                    className="object-cover"
                  />
                )
              )}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/20"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <button
            className="absolute top-4 right-4 z-10 text-white bg-black/50 p-2 rounded-full"
            onClick={closeFullscreen}
            aria-label="Close fullscreen"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="relative w-[90vw] h-[90vh]">
            {mediaItems[fullscreenIndex]?.url && (
              <Image
                src={mediaItems[fullscreenIndex].url}
                alt={mediaItems[fullscreenIndex].name || "Media item"}
                fill
                className="object-contain"
              />
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex((prev) =>
                prev === 0 ? mediaItems.length - 1 : prev - 1
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex((prev) =>
                prev === mediaItems.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            aria-label="Next image"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
