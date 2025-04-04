"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useStore } from "@/app/lib/store";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Custom styles for MediaSlider
import "./MediaSlider.css";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  description?: string;
  type?: "image" | "video";
  inMediaSlider?: boolean;
}

export default function MediaSlider() {
  const { contentSettings } = useStore();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});

  useEffect(() => {
    if (contentSettings?.media?.images) {
      // Filter only items marked for media slider
      const sliderItems = contentSettings.media.images.filter(
        (item) => item.inMediaSlider
      );

      if (sliderItems.length > 0) {
        setMediaItems(sliderItems);
      } else {
        // Fallback to default items if none are marked for slider
        setMediaItems([
          {
            id: "1",
            url: "https://i.postimg.cc/J4hR6v1V/earth-graphics.png",
            name: "Environmental Sustainability",
            description: "Working together for a greener future",
            type: "image",
            inMediaSlider: true,
          },
          {
            id: "2",
            url: "https://i.postimg.cc/QM5P5Pb3/recycling.png",
            name: "Recycling Initiative",
            description: "Making a difference through proper waste management",
            type: "image",
            inMediaSlider: true,
          },
        ]);
      }
    }
    setLoading(false);
  }, [contentSettings]);

  // Handle slide change to pause videos
  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);

    // Pause all videos when changing slides
    Object.values(videoRefs.current).forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });

    // Play the current video if it's a video slide
    const currentItem = mediaItems[newIndex];
    if (currentItem?.type === "video") {
      const video = videoRefs.current[currentItem.id];
      if (video) {
        video.play().catch((e) => console.log("Cannot autoplay video:", e));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No media items found</p>
      </div>
    );
  }

  return (
    <div className="media-slider bg-black rounded-lg overflow-hidden max-w-4xl mx-auto shadow-lg">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={mediaItems.length > 1}
        onSlideChange={handleSlideChange}
        className="media-swiper"
      >
        {mediaItems.map((item, index) => (
          <SwiperSlide key={item.id} className="p-2">
            <div className="relative w-full h-full">
              {item.type === "video" ? (
                <video
                  className="w-full max-h-[calc(100%-50px)] object-contain mx-auto rounded"
                  src={item.url}
                  controls
                  ref={(el) => {
                    if (el) videoRefs.current[item.id] = el;
                  }}
                  muted={false}
                  playsInline
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full max-h-[calc(100%-50px)] object-contain mx-auto rounded"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-70 rounded-b">
                <h3 className="text-white text-sm sm:text-base font-medium truncate">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-white text-opacity-80 text-xs sm:text-sm mt-0.5 truncate">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="text-white text-xs text-right px-4 pb-1">
        {activeIndex + 1} / {mediaItems.length}
      </div>
    </div>
  );
}
