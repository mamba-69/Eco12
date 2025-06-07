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

  const features = [
    {
      icon: FiRefreshCw,
      title: "Circular Economy",
      description:
        "We implement circular economy principles to maximize resource recovery and minimize waste, ensuring materials stay in use for as long as possible.",
    },
    {
      icon: FiShield,
      title: "Environmental Protection",
      description:
        "Our processes prevent harmful substances from entering landfills and ecosystems, protecting both human health and the environment.",
    },
    {
      icon: FiAward,
      title: "Certified Processes",
      description:
        "All our recycling operations follow international standards and are certified by recognized environmental management systems.",
    },
    {
      icon: FiPackage,
      title: "Resource Conservation",
      description:
        "By recovering valuable materials from e-waste, we reduce the need for raw material extraction and conserve natural resources.",
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
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Our Commitment to Sustainability
            </h2>
            <p className="text-muted-foreground">
              At Eco-Expert Recycling, we're dedicated to creating a sustainable future through responsible e-waste management and innovative recycling solutions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                flex items-start p-6 bg-card border border-border/40 rounded-xl shadow-md
                transition-all duration-500 hover:shadow-lg
                ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }
              `}
              style={{
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center bg-card border border-border/40 rounded-xl p-8 shadow-lg">
          <div
            className={`transition-all duration-500 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
            style={{ transitionDelay: "0.3s" }}
          >
            <h3 className="text-2xl font-bold mb-4">The E-Waste Challenge</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiCheck className="w-5 h-5 text-primary mr-2 mt-1" />
                <span>Electronic waste is the fastest growing waste stream globally</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="w-5 h-5 text-primary mr-2 mt-1" />
                <span>Only 17.4% of e-waste is formally collected and recycled</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="w-5 h-5 text-primary mr-2 mt-1" />
                <span>E-waste contains valuable recoverable materials worth billions</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="w-5 h-5 text-primary mr-2 mt-1" />
                <span>Improper disposal releases harmful toxins into the environment</span>
              </li>
            </ul>
          </div>
          <div
            className={`transition-all duration-500 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
            style={{ transitionDelay: "0.5s" }}
          >
            <div className="relative h-64 md:h-full min-h-[250px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-full h-full bg-[url('/images/earth-graphic.png')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
                <p className="text-muted-foreground mb-4">We're committed to implementing industry best practices and innovative solutions to address the growing e-waste challenge.</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="font-semibold">Responsible Recycling</div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="font-semibold">Data Security</div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="font-semibold">Resource Recovery</div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="font-semibold">Compliance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div
        className={`max-w-4xl mx-auto mt-20 bg-card border border-border rounded-xl p-8 relative z-10 shadow-lg transition-all duration-1000 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
        style={{ transitionDelay: "0.4s" }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-3">
            Stay Informed About Our Launch
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're preparing to revolutionize e-waste management with innovative, sustainable solutions. Be the first to know when we launch our services.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/contact"
            className="btn-primary px-8 py-3 text-center whitespace-nowrap w-full sm:w-auto"
          >
            Contact Us
          </Link>
          <Link
            href="/services"
            className="btn-outline px-6 py-3 text-center whitespace-nowrap w-full sm:w-auto"
          >
            Planned Services
          </Link>
          <Link
            href="/about"
            className="text-primary hover:underline px-6 py-3 text-center whitespace-nowrap w-full sm:w-auto"
          >
            Our Vision
          </Link>
        </div>
      </div>
    </section>
  );
}
