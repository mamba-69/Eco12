"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
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

// Define the type for media items
interface MediaItem {
  type: "image" | "video";
  title: string;
  description: string;
  src: string;
  thumbnail?: string;
}

// Define props interface for the component
interface MediaSliderProps {
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  isPaused?: boolean;
}

export default function MediaSlider({
  autoPlay = true,
  autoPlaySpeed = 5000,
  isPaused = false,
}: MediaSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  // Preload all media
  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true);
      // Preload current and next images
      const imagesToPreload = [activeIndex];
      if (activeIndex < mediaItems.length - 1)
        imagesToPreload.push(activeIndex + 1);
      else imagesToPreload.push(0);

      try {
        await Promise.all(
          imagesToPreload.map((index) => {
            if (mediaItems[index].type === "image") {
              return new Promise((resolve) => {
                // Use DOM method to preload the image instead of constructor
                const img = document.createElement("img");
                img.src = mediaItems[index].src;
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
              });
            }
            return Promise.resolve();
          })
        );
      } catch (error) {
        console.error("Error preloading images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [activeIndex]);

  // Start animation when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Reset video when active index changes
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [activeIndex]);

  // Handle video play/pause
  const togglePlay = () => {
    if (mediaItems[activeIndex].type === "video") {
      if (videoRef.current?.paused) {
        // Use Promise to handle potential play errors
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
        setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              // Fallback for autoplay restrictions
              setIsPlaying(false);
            });
        }
      } else {
        videoRef.current?.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Go to next slide
  const nextSlide = () => {
    setIsPlaying(false); // Reset video state
    setActiveIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  // Go to previous slide
  const prevSlide = () => {
    setIsPlaying(false); // Reset video state
    setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    setIsPlaying(false); // Reset video state
    setActiveIndex(index);
  };

  // Show video controls on hover
  const handleMouseEnter = () => {
    setShowControls(true);
  };

  // Hide video controls when mouse leaves
  const handleMouseLeave = () => {
    if (!isPlaying) {
      setShowControls(false);
    }
  };

  // Request fullscreen
  const toggleFullscreen = () => {
    if (mediaItems[activeIndex].type === "video" && videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Media items data - mix of images and videos
  const mediaItems: MediaItem[] = [
    {
      type: "image",
      title: "Our Recycling Facility",
      description:
        "State-of-the-art e-waste processing center with advanced sorting technology.",
      src: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=320&h=180&q=80",
    },
    {
      type: "video",
      title: "Recycling Process Explained",
      description:
        "A detailed walkthrough of how we process and recycle electronic waste.",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1605600659873-d808a13e4e4c?auto=format&fit=crop&w=320&h=180&q=80",
    },
    {
      type: "image",
      title: "Community Collection Drive",
      description:
        "Local residents bringing their e-waste to our collection event.",
      src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=320&h=180&q=80",
    },
    {
      type: "video",
      title: "Environmental Impact",
      description:
        "How proper e-waste recycling helps reduce pollution and conserve resources.",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1498925008800-019c6d2a3910?auto=format&fit=crop&w=320&h=180&q=80",
    },
    {
      type: "image",
      title: "Recovered Materials",
      description:
        "Precious metals and other materials recovered from recycled electronics.",
      src: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1200&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=320&h=180&q=80",
    },
    {
      type: "video",
      title: "Corporate Sustainability Program",
      description:
        "How businesses partner with us to implement sustainable e-waste management.",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=320&h=180&q=80",
    },
  ];

  useEffect(() => {
    // Preload images for smooth transitions
    if (mediaItems.length > 0) {
      mediaItems.forEach((item) => {
        if (item.type !== "video") {
          try {
            // Create an image element to preload
            const img = document.createElement("img");
            img.src = item.src;
          } catch (error) {
            console.error("Error preloading image:", error);
          }
        }
      });
    }

    // Set appropriate auto-play duration
    const interval = autoPlaySpeed || 5000;
    let autoPlayTimer: NodeJS.Timeout | null = null;

    if (autoPlay && !isPaused) {
      autoPlayTimer = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
      }
    };
  }, [activeIndex, mediaItems, autoPlay, isPaused, autoPlaySpeed]);

  return (
    <section className="py-20 relative bg-background" ref={containerRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Media Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our visual content showcasing our facilities, processes, and
            environmental impact through images and videos.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          {/* Main slider */}
          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-card mb-8"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ aspectRatio: "16/9" }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-50">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                {mediaItems[activeIndex].type === "image" ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaItems[activeIndex].src}
                      alt={mediaItems[activeIndex].title}
                      fill
                      className="object-cover rounded-2xl"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      onLoadingComplete={() => setIsLoading(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-6">
                      <h3 className="text-xl font-bold">
                        {mediaItems[activeIndex].title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {mediaItems[activeIndex].description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={mediaItems[activeIndex].src}
                      className="absolute inset-0 w-full h-full object-cover"
                      onClick={togglePlay}
                      onEnded={() => setIsPlaying(false)}
                      onLoadedData={() => setIsLoading(false)}
                      onError={(e) => {
                        console.error("Video error:", e);
                        setIsLoading(false);
                      }}
                      muted={isMuted}
                      playsInline
                      preload="auto"
                    />
                    
                    {/* Media title and description */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 z-10">
                      <h3 className="text-xl font-bold text-white">
                        {mediaItems[activeIndex].title}
                      </h3>
                      <p className="text-sm text-white/80 mt-2">
                        {mediaItems[activeIndex].description}
                      </p>
                    </div>
                    
                    {/* Center play button (only when not playing) */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <button
                          onClick={togglePlay}
                          className="w-20 h-20 rounded-full bg-primary/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-primary transition-all transform hover:scale-105"
                        >
                          <FiPlay className="w-8 h-8" />
                        </button>
                      </div>
                    )}
                    
                    {/* Bottom controls bar */}
                    <div 
                      className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-background/90 to-transparent z-30 transition-opacity duration-300 ${
                        showControls || !isPlaying ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={togglePlay}
                          className="w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center hover:bg-primary transition-all"
                        >
                          {isPlaying ? (
                            <FiPause className="w-4 h-4" />
                          ) : (
                            <FiPlay className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button 
                          onClick={toggleMute}
                          className="w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center hover:bg-primary transition-all"
                        >
                          {isMuted ? (
                            <FiVolumeX className="w-4 h-4" />
                          ) : (
                            <FiVolume2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <button 
                        onClick={toggleFullscreen}
                        className="w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center hover:bg-primary transition-all"
                      >
                        <FiMaximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-primary transition-all z-10"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-primary transition-all z-10"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          {/* Thumbnails slider */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {mediaItems.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex-shrink-0 cursor-pointer transition-all relative rounded-lg overflow-hidden ${
                    activeIndex === index 
                      ? "ring-4 ring-primary scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => goToSlide(index)}
                  whileHover={{ scale: activeIndex === index ? 1.05 : 1.02 }}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                >
                  <div className="w-32 h-20 relative">
                    {item.type === "image" ? (
                      <Image
                        src={item.thumbnail || item.src}
                        alt={item.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.thumbnail || item.src}
                          alt={item.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                          <FiPlay className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
