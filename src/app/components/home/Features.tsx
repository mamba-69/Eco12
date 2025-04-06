"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  FiRefreshCw,
  FiTruck,
  FiAward,
  FiShield,
  FiPackage,
  FiCheck,
} from "@/app/lib/icons";
import dynamic from "next/dynamic";

// Dynamically import framer-motion components
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

// Custom hook to replace useInView
function useClientInView(ref: React.RefObject<Element>, options = {}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "-100px", ...options }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInView;
}

interface ServiceCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
  index: number;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  href,
  index,
}: ServiceCardProps) => {
  const cardRef = useRef(null);
  const isCardInView = useClientInView(cardRef);

  return (
    <div
      ref={cardRef}
      className={`
        group relative bg-card hover:bg-card/80 rounded-xl overflow-hidden shadow-md
        border border-border/40 transition-all duration-500
        hover:scale-102 hover:shadow-lg
        ${
          isCardInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }
      `}
      style={{
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      {/* Gradient background that animates on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 p-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground mb-4">{description}</p>

        <Link
          href={href}
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          Learn more
          <svg
            className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
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
        </Link>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary/10 w-8 h-32 group-hover:bg-primary/20 transition-colors duration-300"></div>
      </div>
    </div>
  );
};

// Interface for the dot object
interface Dot {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  duration: number;
}

// Animated dots component that renders only client-side
function AnimatedDots() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    // Generate consistent dots on client side
    const newDots: Dot[] = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      width: `${10 + i * 5}px`,
      height: `${10 + i * 4}px`,
      top: `${20 + i * 15}%`,
      left: `${15 + i * 18}%`,
      duration: 5 + i * 1.5,
    }));

    setDots(newDots);
  }, []);

  return (
    <>
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-primary/20 animate-float"
          style={{
            width: dot.width,
            height: dot.height,
            top: dot.top,
            left: dot.left,
            animationDuration: `${dot.duration}s`,
            animationDelay: `${dot.id * 0.5}s`,
          }}
        />
      ))}
    </>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const isInView = useClientInView(sectionRef);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const services = [
    {
      icon: FiRefreshCw,
      title: "E-Waste Recycling",
      description:
        "Environmentally sound recycling services for all types of electronic waste and devices.",
      href: "/services/e-waste-recycling",
    },
    {
      icon: FiShield,
      title: "Data Destruction",
      description:
        "Secure data destruction services ensuring your sensitive information is completely erased.",
      href: "/services/data-destruction",
    },
    {
      icon: FiTruck,
      title: "Collection Services",
      description:
        "Convenient pickup services for businesses and organizations with large volumes of e-waste.",
      href: "/services/collection",
    },
    {
      icon: FiAward,
      title: "Compliance Certification",
      description:
        "Ensuring your business meets all regulatory requirements for e-waste disposal.",
      href: "/services/compliance",
    },
    {
      icon: FiPackage,
      title: "Asset Recovery",
      description:
        "Maximize the value of your retired IT equipment through our asset recovery program.",
      href: "/services/asset-recovery",
    },
    {
      icon: FiCheck,
      title: "IT Equipment Disposal",
      description:
        "Professional disposal services for outdated or broken IT equipment and electronics.",
      href: "/services/it-disposal",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 top-40 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute right-20 bottom-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />

        {/* Animated dots pattern - only client-side */}
        {mounted && <AnimatedDots />}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`transition-all duration-500 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Comprehensive Recycling Solutions
            </h2>
            <p className="text-muted-foreground">
              From e-waste collection to certified data destruction, we offer
              end-to-end solutions for responsible electronic waste management
              and recycling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          <Link
            href="/services"
            className="btn-primary inline-flex items-center"
          >
            View All Services
            <svg
              className="ml-2 w-5 h-5"
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
          </Link>
        </div>
      </div>

      {/* Call to action section */}
      <div
        className={`max-w-4xl mx-auto mt-20 bg-card border border-border rounded-xl p-8 relative z-10 shadow-lg transition-all duration-1000 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
        style={{ transitionDelay: "0.4s" }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-3">
              Ready to recycle your e-waste?
            </h3>
            <p className="text-muted-foreground mb-0">
              Contact us today for a consultation and let us help you dispose of
              your electronic waste responsibly.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link
              href="/contact"
              className="btn-primary px-8 py-3 text-center whitespace-nowrap"
            >
              Get Started
            </Link>
            <Link
              href="/services"
              className="btn-outline ml-3 px-6 py-3 text-center whitespace-nowrap"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
