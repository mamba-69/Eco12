"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Logo component with advanced styling
  const Logo = () => (
    <div className="flex items-center">
      <div className="relative w-10 h-10 mr-2">
        {/* Base circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary-600 shadow-lg transform -rotate-6" />
        
        {/* Leaf icon */}
        <svg
          className="absolute inset-0 w-full h-full p-1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            fill="transparent"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 8.5C7 5.46 9.46 3 12.5 3S18 5.46 18 8.5C18 11.54 15.54 14 12.5 14H7V8.5Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M12.5 14V20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.5 17L15.5 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M11 8.5C11 7.67 11.67 7 12.5 7C13.33 7 14 7.67 14 8.5C14 9.33 13.33 10 12.5 10"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Circular orbit */}
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow" />
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="font-extrabold text-xl tracking-tight text-primary mr-1">Eco</span>
          <span className="font-extrabold text-xl text-foreground">Expert</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">
          Recycling PVT. LTD.
        </span>
      </div>
    </div>
  );

  // If theme component hasn't mounted yet, don't render theme-dependent parts
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <button
            className="p-2 rounded-full text-foreground bg-transparent hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Logo />
          </motion.div>
        </Link>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors hover:text-primary ${
                link.href === '/' ? 'text-primary font-semibold' : 'text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Theme toggle */}
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 transition-colors"
            aria-label="Toggle theme"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            {theme === "dark" ? (
              <FiSun size={20} className="text-yellow-400" />
            ) : (
              <FiMoon size={20} className="text-foreground" />
            )}
          </motion.button>
          
          {/* Login/Signup */}
          <div className="flex gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted/10 transition-colors"
            >
              Log In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 rounded-full text-foreground bg-transparent hover:bg-primary/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors hover:text-primary ${
                  link.href === '/' ? 'text-primary font-semibold' : 'text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
              <span className="text-muted-foreground">Theme</span>
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 transition-colors"
                aria-label="Toggle theme"
                whileTap={{ scale: 0.9 }}
              >
                {theme === "dark" ? (
                  <FiSun size={20} className="text-yellow-400" />
                ) : (
                  <FiMoon size={20} className="text-foreground" />
                )}
              </motion.button>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <Link
                href="/auth/login"
                className="py-2 text-center rounded-md border border-border hover:bg-muted/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="py-2 text-center rounded-md bg-primary text-white hover:bg-primary-600 transition-colors shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
} 