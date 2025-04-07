"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiStar, FiRefreshCw, FiShield, FiUsers } from "@/app/lib/icons";
import dynamic from "next/dynamic";

// Dynamically import framer-motion hooks and components
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const MotionButton = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.button),
  { ssr: false }
);

// Custom hook to replace useInView
function useClientInView(ref: React.RefObject<Element>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
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

// Simple animation control replacement
function useClientAnimation() {
  const [state, setState] = useState("hidden");

  const start = (newState: string) => {
    setState(newState);
  };

  return {
    start,
    state,
  };
}

export default function Mission() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const isInView = useClientInView(containerRef);
  const mainControls = useClientAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const missionPoints = [
    {
      icon: <FiStar className="w-6 h-6 text-primary" />,
      title: "Responsible Recycling",
      description:
        "We ensure all e-waste is processed through environmentally responsible methods that minimize pollution and maximize resource recovery.",
    },
    {
      icon: <FiRefreshCw className="w-6 h-6 text-primary" />,
      title: "Material Recovery",
      description:
        "Our advanced recycling processes recover valuable materials like gold, silver, copper, and rare earth elements from discarded electronics.",
    },
    {
      icon: <FiShield className="w-6 h-6 text-primary" />,
      title: "Data Security",
      description:
        "We provide certified data destruction services to ensure sensitive information is completely and securely erased from all devices.",
    },
    {
      icon: <FiUsers className="w-6 h-6 text-primary" />,
      title: "Community Education",
      description:
        "We work with communities to raise awareness about e-waste challenges and promote sustainable electronics management practices.",
    },
  ];

  const stats = [
    { value: 500, suffix: "K+", label: "Devices Recycled" },
    { value: 95, suffix: "%", label: "Recovery Rate" },
    { value: 100, suffix: "+", label: "Corporate Clients" },
    { value: 20, suffix: "+", label: "Years Experience" },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-card to-background opacity-80" />
        
        {/* Flowing circles */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
        {/* Section Header */}
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <span className="text-primary text-sm uppercase tracking-wider font-semibold">
            Our Purpose
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            Our <span className="text-primary">Mission</span> & Vision
          </h2>
          <p className="text-lg text-muted-foreground">
            We're on a mission to revolutionize e-waste management, creating a
            circular economy where every electronic device finds new purpose,
            protecting our planet for future generations.
          </p>
        </div>

        {/* Main content with earth image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side image with 3D effect */}
          <div
            ref={imageRef}
            className={`w-full transition-all duration-1000 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <div className="relative hover:scale-105 transition-transform duration-300">
              <div className="relative w-full max-w-[450px] h-[450px] mx-auto">
                <div className="w-full h-full pointer-events-none">
                  <img
                    src="https://i.postimg.cc/J4hR6v1V/earth-graphics.png"
                    alt="Earth with plants graphic"
                    className="w-full h-full object-contain rounded-xl pointer-events-none"
                  />

                  {/* Stats overlay - top */}
                  <div className="absolute top-5 right-5 p-3 rounded-lg bg-background/90 animate-pulse-slow pointer-events-none">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Devices Recycled
                    </p>
                    <p className="text-xl font-bold">50K+</p>
              </div>
              
                  {/* Stats overlay - bottom */}
                  <div className="absolute bottom-5 left-5 p-3 rounded-lg bg-background/90 animate-pulse-slow pointer-events-none">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Recovery Rate
                    </p>
                    <p className="text-xl font-bold">95%</p>
                  </div>
                </div>
                </div>
            </div>
          </div>

          {/* Right side mission points */}
          <div className="space-y-8">
            {missionPoints.map((point, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  isInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-50"
                }`}
                style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="bg-card hover:bg-card/90 border border-border/60 rounded-xl p-6 relative z-10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {point.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {point.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative line connecting points */}
                {index < missionPoints.length - 1 && (
                  <div className="absolute left-6 top-[4.5rem] h-[calc(100%-1rem)] w-0 border-l-2 border-dashed border-primary/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-30"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          {stats.map((stat, index) => (
            <div
              key={index} 
              className="text-center p-6 rounded-lg bg-card border border-border/60 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <CountUpAnimation 
                className="text-3xl md:text-4xl font-bold text-primary mb-2" 
                end={stat.value} 
                suffix={stat.suffix}
                isInView={isInView}
              />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={`text-center mt-16 transition-all duration-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ transitionDelay: "0.8s" }}
        >
          <button className="btn-primary py-3 px-8 text-lg inline-flex items-center gap-2 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
            Join Our Mission
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// Define interface for CountUpAnimation props
interface CountUpAnimationProps {
  end: number;
  className?: string;
  suffix?: string;
  isInView: boolean;
  duration?: number;
}

// CountUpAnimation component
function CountUpAnimation({ 
  end, 
  className = "", 
  suffix = "", 
  isInView,
  duration = 2.5,
}: CountUpAnimationProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | undefined;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, isInView]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
}
