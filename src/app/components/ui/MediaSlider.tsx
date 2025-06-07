"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useStore } from "@/app/lib/store";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotationDegree, setRotationDegree] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
            type: "image",
            inMediaSlider: true,
          },
          {
            id: "2",
            url: "https://i.postimg.cc/QM5P5Pb3/recycling.png",
            name: "Recycling Initiative",
            type: "image",
            inMediaSlider: true,
          },
          {
            id: "3",
            url: "https://i.postimg.cc/J4hR6v1V/earth-graphics.png",
            name: "Eco-Friendly Solutions",
            type: "image",
            inMediaSlider: true,
          },
          {
            id: "4",
            url: "https://i.postimg.cc/QM5P5Pb3/recycling.png",
            name: "Sustainable Practices",
            type: "image",
            inMediaSlider: true,
          },
        ]);
      }
    }
    setLoading(false);
  }, [contentSettings]);

  // Handle mouse down event for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  // Handle mouse move event for rotation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const newRotation = rotationDegree + deltaX * 0.5;
    setRotationDegree(newRotation);
    setStartX(e.clientX);
    
    // Calculate which item should be active based on rotation
    const itemCount = mediaItems.length;
    const degreesPerItem = 360 / itemCount;
    const normalizedRotation = ((newRotation % 360) + 360) % 360;
    const newIndex = Math.floor(normalizedRotation / degreesPerItem) % itemCount;
    setCurrentIndex(itemCount - 1 - newIndex);
  };

  // Handle mouse up event to stop rotation
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const newRotation = rotationDegree + deltaX * 0.5;
    setRotationDegree(newRotation);
    setStartX(e.touches[0].clientX);
    
    // Calculate which item should be active based on rotation
    const itemCount = mediaItems.length;
    const degreesPerItem = 360 / itemCount;
    const normalizedRotation = ((newRotation % 360) + 360) % 360;
    const newIndex = Math.floor(normalizedRotation / degreesPerItem) % itemCount;
    setCurrentIndex(itemCount - 1 - newIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Render loading state
  if (loading) {
    return <div className="media-slider-loading">Loading media...</div>;
  }

  // Render empty state
  if (mediaItems.length === 0) {
    return <div className="media-slider-empty">No media items available</div>;
  }

  return (
    <div className="media-gallery-container">
      <h2 className="media-gallery-title">Media Gallery</h2>
      <p className="media-gallery-subtitle">Explore our visual content showcasing our facilities, processes, and environmental impact.</p>
      
      <div 
        className="media-slider-360-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="media-slider-360-carousel"
          style={{ transform: `rotateY(${rotationDegree}deg)` }}
        >
          {mediaItems.map((item, index) => {
            const angle = (index * 360) / mediaItems.length;
            const radius = 250; // Adjust based on your container size
            const zTranslate = radius * Math.cos((angle * Math.PI) / 180);
            const xTranslate = radius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <div 
                key={item.id}
                className={`media-slider-360-item ${index === currentIndex ? 'active' : ''}`}
                style={{
                  transform: `rotateY(${-angle}deg) translateZ(${zTranslate}px) translateX(${xTranslate}px)`,
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="media-slider-360-media"
                    title={item.name}
                  />
                ) : (
                  <div className="media-slider-360-image-container">
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="media-slider-360-media"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <h3 className="media-slider-360-title">{item.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="media-slider-360-controls">
        <button 
          className="media-slider-360-control-btn"
          onClick={() => {
            const newRotation = rotationDegree - (360 / mediaItems.length);
            setRotationDegree(newRotation);
            setCurrentIndex((currentIndex + 1) % mediaItems.length);
          }}
        >
          &#10094; Previous
        </button>
        <button 
          className="media-slider-360-control-btn"
          onClick={() => {
            const newRotation = rotationDegree + (360 / mediaItems.length);
            setRotationDegree(newRotation);
            setCurrentIndex((currentIndex - 1 + mediaItems.length) % mediaItems.length);
          }}
        >
          Next &#10095;
        </button>
      </div>
    </div>
  );
}
