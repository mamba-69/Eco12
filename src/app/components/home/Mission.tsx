"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Image from "next/image";
import { FiStar, FiRefreshCw, FiShield, FiUsers } from "@/app/lib/icons";

export default function Mission() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-16"
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
        </motion.div>

        {/* Main content with earth image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side image with 3D effect */}
          <motion.div
            ref={imageRef}
            className="w-full"
            initial={{ x: 100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
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
            </motion.div>
          </motion.div>

          {/* Right side mission points */}
          <div className="space-y-8">
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <motion.div
                  className="bg-card hover:bg-card/90 border border-border/60 rounded-xl p-6 relative z-10 transition-all duration-300 group"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
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
                </motion.div>

                {/* Decorative line connecting points */}
                {index < missionPoints.length - 1 && (
                  <div className="absolute left-6 top-[4.5rem] h-[calc(100%-1rem)] w-0 border-l-2 border-dashed border-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-lg bg-card border border-border/60 shadow-sm"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CountUpAnimation
                className="text-3xl md:text-4xl font-bold text-primary mb-2"
                end={stat.value}
                suffix={stat.suffix}
                isInView={isInView}
              />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            className="btn-primary py-3 px-8 text-lg inline-flex items-center gap-2 shadow-lg"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
          >
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
          </motion.button>
        </motion.div>
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
    <div className={className}>
      {count}
      {suffix}
    </div>
  );
}

// Data
const missionPoints = [
  {
    icon: <FiRefreshCw className="w-6 h-6 text-primary" />,
    title: "Sustainable Recycling",
    description:
      "Our advanced recycling processes recover up to 95% of materials from e-waste, minimizing landfill impact and conserving natural resources.",
  },
  {
    icon: <FiShield className="w-6 h-6 text-primary" />,
    title: "Data Security",
    description:
      "We ensure complete data destruction on all recycled devices, protecting sensitive information with certified security protocols.",
  },
  {
    icon: <FiUsers className="w-6 h-6 text-primary" />,
    title: "Community Impact",
    description:
      "Through education and local partnerships, we raise awareness about responsible e-waste management and create green job opportunities.",
  },
  {
    icon: <FiStar className="w-6 h-6 text-primary" />,
    title: "Circular Economy",
    description:
      "We transform e-waste into valuable resources that can be reintegrated into manufacturing, completing the circular economy loop.",
  },
];

const stats = [
  { value: 50000, suffix: "+", label: "Devices Recycled" },
  { value: 500, suffix: "+", label: "Tons of E-Waste Processed" },
  { value: 5000, suffix: "+", label: "Trees Saved" },
  { value: 25, suffix: "%", label: "Carbon Footprint Reduction" },
];
