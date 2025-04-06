"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";

// Client-side only motion components
interface MotionProps {
  children?: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  variants?: any;
  transition?: any;
}

const MotionDiv = ({ children, ...props }: MotionProps) => {
  const [Component, setComponent] = useState<any>(() => (props: any) => (
    <div {...props}>{props.children}</div>
  ));

  useEffect(() => {
    let isMounted = true;
    import("framer-motion").then((mod) => {
      if (isMounted) {
        setComponent(() => mod.motion.div);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return <Component {...props}>{children}</Component>;
};

const MotionP = ({ children, ...props }: MotionProps) => {
  const [Component, setComponent] = useState<any>(() => (props: any) => (
    <p {...props}>{props.children}</p>
  ));

  useEffect(() => {
    let isMounted = true;
    import("framer-motion").then((mod) => {
      if (isMounted) {
        setComponent(() => mod.motion.p);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return <Component {...props}>{children}</Component>;
};

const MotionSpan = ({ children, ...props }: MotionProps) => {
  const [Component, setComponent] = useState<any>(() => (props: any) => (
    <span {...props}>{props.children}</span>
  ));

  useEffect(() => {
    let isMounted = true;
    import("framer-motion").then((mod) => {
      if (isMounted) {
        setComponent(() => mod.motion.span);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return <Component {...props}>{children}</Component>;
};

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Animation variants for the recycling arrows
  const arrowVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 360, transition: { duration: 1.5, ease: "easeInOut" } },
  };

  return (
    <Link href="/">
      <div
        className="flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mr-2 flex items-center justify-center">
          {/* Main circle */}
          <MotionDiv
            className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-teal-500 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Recycling symbol */}
            <MotionDiv
              className="w-8 h-8 relative"
              initial={{ rotate: 0 }}
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* Arrow 1 */}
              <MotionDiv
                className="absolute w-3 h-5 top-0 left-2.5"
                variants={arrowVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
              >
                <div className="w-full h-full border-t-2 border-r-2 border-white rounded-tr-md transform rotate-45"></div>
                <div className="absolute -bottom-1 left-0 w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-t-white border-r-[5px] border-r-transparent transform -rotate-90"></div>
              </MotionDiv>

              {/* Arrow 2 */}
              <MotionDiv
                className="absolute w-3 h-5 bottom-0 right-0"
                variants={arrowVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
              >
                <div className="w-full h-full border-b-2 border-r-2 border-white rounded-br-md transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-t-white border-r-[5px] border-r-transparent transform rotate-30"></div>
              </MotionDiv>

              {/* Arrow 3 */}
              <MotionDiv
                className="absolute w-3 h-5 bottom-0 left-0"
                variants={arrowVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
              >
                <div className="w-full h-full border-b-2 border-l-2 border-white rounded-bl-md transform -rotate-45"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-t-white border-r-[5px] border-r-transparent transform rotate-150"></div>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>

          {/* Text */}
          <div className="ml-1">
            <MotionP
              className="font-bold text-xl leading-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-green-600">Eco</span>
              <span className="text-teal-500">Verva</span>
            </MotionP>
            <MotionSpan
              className="text-xs tracking-wider opacity-80"
              initial={{ y: 0 }}
              animate={{ y: isHovered ? -1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              E-WASTE SOLUTIONS
            </MotionSpan>
          </div>
        </div>
      </div>
    </Link>
  );
}
