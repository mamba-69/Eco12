"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiRefreshCw,
  FiShield,
  FiHardDrive,
  FiTruck,
  FiFileText,
  FiPackage,
} from "react-icons/fi";

// Custom hook to check if element is in view
function useClientInView(ref: React.RefObject<Element>) {
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
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

const ServiceCard = ({
  title,
  description,

  index,
  slug,
  IconComponent,
}: {
  title: string;
  description: string;

  index: number;
  slug: string;
  IconComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => {
  const cardRef = useRef(null);
  const isCardInView = useClientInView(cardRef);

  return (
    <Link href={`/services/${slug}`} className="block">
      <div
        ref={cardRef}
        className={`
          bg-card hover:bg-card/80 rounded-xl p-6 shadow-md hover:shadow-xl 
          transition-all duration-500 flex flex-col items-center text-center 
          relative overflow-hidden group border border-border/40
          hover:scale-102 hover:-translate-y-1
          ${
            isCardInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }
        `}
        style={{ transitionDelay: `${index * 0.1}s` }}
      >
        {/* Accent line at top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <div className="w-8 h-8 text-primary">
            {IconComponent ? <IconComponent className="w-8 h-8" /> : null}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>

        {/* Learn More Button */}
        <div className="mt-4">
          <span className="text-primary text-sm font-medium inline-flex items-center group-hover:underline">
            Learn More
            <svg
              className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
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
          </span>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary/10 w-8 h-32 group-hover:bg-primary/20 transition-colors duration-300"></div>
        </div>
      </div>
    </Link>
  );
};

export default function ServicesPage() {
  const sectionRef = useRef(null);
  const isInView = useClientInView(sectionRef);

  const services = [
    {
      title: "E-Waste Recycling",
      description:
        "Comprehensive recycling services for all types of electronic waste and devices, ensuring proper disposal and resource recovery.",
      IconComponent: FiRefreshCw,
      slug: "e-waste-recycling",
    },
    {
      title: "Data Destruction",
      description:
        "Secure data destruction services ensuring your sensitive information is completely erased from all devices before recycling.",
      IconComponent: FiHardDrive,
      slug: "data-destruction",
    },
    {
      title: "IT Equipment Disposal",
      description:
        "Professional disposal services for outdated or broken IT equipment and electronics with environmentally responsible methods.",
      IconComponent: FiShield,
      slug: "it-equipment-disposal",
    },
    {
      title: "Asset Recovery",
      description:
        "Maximize the value of your end-of-life IT equipment through our comprehensive asset recovery services.",
      IconComponent: FiPackage,
      slug: "asset-recovery",
    },
    {
      title: "Compliance Certification",
      description:
        "Ensuring your business meets all regulatory requirements for e-waste disposal with our comprehensive compliance certification.",
      IconComponent: FiFileText,
      slug: "compliance-certification",
    },
    {
      title: "Collection Services",
      description:
        "Convenient collection solutions for businesses and organizations with large volumes of e-waste, including scheduled pickups.",
      IconComponent: FiTruck,
      slug: "collection-services",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-background"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-20 bottom-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We offer a comprehensive range of eco-friendly services to help
              you manage e-waste responsibly and comply with all regulations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              IconComponent={service.IconComponent}
              index={index}
              slug={service.slug}
            />
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center"
          >
            Contact Us For More Information
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
    </section>
  );
}
