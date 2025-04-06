"use client";

import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";
import { useEffect, useState, ReactNode } from "react";

// Simple fallback
const SectionFallback = () => <section className="opacity-0" />;

// Client component wrapper
interface MotionProps {
  children?: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  variants?: any;
}

const MotionSection = ({ children, ...props }: MotionProps) => {
  const [Component, setComponent] = useState<any>(() => (
    (props: any) => <section {...props}>{props.children}</section>
  ));

  useEffect(() => {
    let isMounted = true;
    import('framer-motion').then((mod) => {
      if (isMounted) {
        setComponent(() => mod.motion.section);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return <Component {...props}>{children}</Component>;
};

// This component will display content from the store and update when changes happen
export const HomepageContent = () => {
  // Get content from store
  const storeContent = useStore((state) => state.contentSettings);

  // Create local state to avoid direct dependency on the store for rendering
  // (prevents potential re-render loops)
  const [content, setContent] = useState(storeContent);

  // Update local state when store changes
  useEffect(() => {
    setContent(storeContent);
  }, [storeContent]);

  // Listen for changes broadcasted from admin panel
  useSettingsChangeListener((data) => {
    if (data.settings?.contentSettings) {
      // Content will update automatically via the store
    }
  });

  // Define fade-in animation for sections
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="space-y-8 py-8">
      {/* Hero content display */}
      {content.hero && (
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h2 className="text-2xl font-bold mb-4">{content.hero.heading}</h2>
          <p className="mb-6">{content.hero.subheading}</p>
          <a
            href={content.hero.ctaLink}
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {content.hero.ctaText}
          </a>
        </MotionSection>
      )}

      {/* Mission content display */}
      {content.mission && (
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {content.mission.heading}
          </h2>
          <p className="mb-6 text-center">{content.mission.description}</p>

          <ul className="space-y-3">
            {content.mission.points.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </MotionSection>
      )}

      {/* Achievements content display */}
      {content.achievements && (
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="py-8"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            {content.achievements.heading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.achievements.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg text-center shadow-md"
              >
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </MotionSection>
      )}

      {/* Videos content display */}
      {content.videos && content.videos.videos.length > 0 && (
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="py-8"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            {content.videos.heading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.videos.videos.map((video, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
              >
                <div className="aspect-video">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </MotionSection>
      )}
    </div>
  );
};
