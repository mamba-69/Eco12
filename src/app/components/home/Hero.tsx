"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import animation libraries to avoid SSR issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const MotionP = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.p),
  { ssr: false }
);

const MotionH1 = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.h1),
  { ssr: false }
);

// Static image component for better compatibility
interface StaticImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

function StaticImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
}: StaticImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        console.error(`Failed to load image: ${src}`);
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          // Use a default placeholder if no fallback is provided
          setImgSrc("/images/placeholder.jpg");
        }
      }}
    />
  );
}

// Component for animated particles that only renders on client-side to avoid hydration mismatch
interface Particle {
  id: number;
  top: string;
  left: string;
  animationDuration: number;
  animationDelay: number;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Only generate random values on client-side
    const newParticles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: 3 + Math.random() * 5,
      animationDelay: Math.random() * 2,
    }));
    
    setParticles(newParticles);
  }, []);
  
  return (
    <>
      {particles.map((particle) => (
        <MotionDiv
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{
            top: particle.top,
            left: particle.left,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.animationDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.animationDelay,
          }}
        />
      ))}
    </>
  );
}

export default function Hero() {
  const earthRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Only import GSAP on the client side
    if (typeof window !== "undefined") {
      // Safe import of GSAP
      import("gsap")
        .then((gsapModule) => {
          const gsap = gsapModule.gsap;

          // Rotating Earth animation with error handling
          try {
    const earthRotation = gsap.to(earthRef.current, {
      rotation: 360,
      duration: 60,
      repeat: -1,
              ease: "linear",
    });
    
    return () => {
      earthRotation.kill();
    };
          } catch (error) {
            console.error("Error creating GSAP animation:", error);
          }
        })
        .catch((err) => {
          console.error("Failed to load GSAP:", err);
        });
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card to-background" />
      
      {/* Floating particles - only rendered client-side */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && <FloatingParticles />}
      </div>
      
      {/* Content grid */}
      <div className="container relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-screen items-center pt-20 lg:pt-0">
        {/* Left side - Text content */}
        <div className="px-4 lg:px-8">
          {mounted ? (
            <>
              <MotionDiv
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block bg-primary text-white py-1.5 px-4 mb-6 text-sm font-medium rounded-full animate-pulse">
              Leading E-Waste Recycling in India
            </div>
              </MotionDiv>
          
              <MotionH1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span>Eco-Expert Solutions</span> <br />
            <span className="text-primary">for a Greener Future</span>
              </MotionH1>
          
              <MotionP
            className="text-lg mb-8 text-foreground/80 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
                We transform electronic waste into valuable resources through
                innovative recycling solutions. Join us in our mission to create
                a sustainable, circular economy for electronics.
              </MotionP>

              <MotionDiv
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
                <Link href="/contact" className="btn-primary text-center">
              Get Started Today
            </Link>
                <Link href="/services" className="btn-outline text-center">
              Explore Services
            </Link>
              </MotionDiv>
          
              <MotionDiv
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
                <p className="text-sm text-muted-foreground mb-4">
                  Trusted by Industry Leaders:
                </p>
            <div className="flex gap-6 items-center">
              <div className="w-24 h-12 bg-card rounded-md shadow-sm flex items-center justify-center">
                <div className="text-primary font-bold">TechCorp</div>
              </div>
              <div className="w-24 h-12 bg-card rounded-md shadow-sm flex items-center justify-center">
                <div className="text-accent font-bold">EcoTech</div>
              </div>
              <div className="w-24 h-12 bg-card rounded-md shadow-sm flex items-center justify-center">
                <div className="text-secondary font-bold">GreenIT</div>
              </div>
            </div>
              </MotionDiv>
            </>
          ) : (
            // Static content while animations are loading
            <div>
              <div className="inline-block bg-primary text-white py-1.5 px-4 mb-6 text-sm font-medium rounded-full">
                Leading E-Waste Recycling in India
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span>Eco-Expert Solutions</span> <br />
                <span className="text-primary">for a Greener Future</span>
              </h1>
              <p className="text-lg mb-8 text-foreground/80 max-w-lg">
                We transform electronic waste into valuable resources through
                innovative recycling solutions. Join us in our mission to create
                a sustainable, circular economy for electronics.
              </p>
            </div>
          )}
        </div>
        
        {/* Right side - Earth graphic & 3D elements - only render when mounted */}
        {mounted && (
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Glowing background circle */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 animate-pulse-slow" />
            <div
              className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            />
            
            {/* Rotating earth image */}
            <div
              ref={earthRef}
              className="relative w-[350px] h-[350px] pointer-events-none"
            >
              <div className="earth-container">
                <img
                  src="https://i.postimg.cc/J4hR6v1V/earth-graphics.png"
                  alt="Earth graphic"
                  className="animate-rotate pointer-events-none"
                />
              </div>

              {/* Stats overlay - upper right */}
              <div className="absolute top-0 right-0 p-3 rounded-lg bg-background/80 animate-pulse-slow pointer-events-none">
                <p className="text-xs font-semibold text-muted-foreground">
                  E-Waste Recycled
                </p>
                <p className="text-lg font-bold">500,000+ Devices</p>
              </div>

              {/* Stats overlay - lower left */}
              <div className="absolute bottom-0 left-0 p-3 rounded-lg bg-background/80 animate-pulse-slow pointer-events-none">
                <p className="text-xs font-semibold text-muted-foreground">
                  CO₂ Reduced
                </p>
                <p className="text-lg font-bold">1,200+ Tons</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll indicator */}
      <MotionDiv
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <p className="text-sm text-muted-foreground mb-2">Scroll to explore</p>
        <MotionDiv
          className="w-6 h-10 border-2 border-muted rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <MotionDiv
            className="w-1.5 h-1.5 bg-primary rounded-full mt-2"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </MotionDiv>
      </MotionDiv>
    </div>
  );
} 
