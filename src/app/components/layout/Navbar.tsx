"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/components/theme/ThemeProvider";
import { useStore } from "@/app/lib/store";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    // Force check the current DOM state rather than relying on React state
    const root = window.document.documentElement;
    const isDark = root.classList.contains('dark');
    
    // Toggle to the opposite theme
    const newTheme = isDark ? 'light' : 'dark';
    
    // Apply the new theme directly to DOM first
    if (isDark) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    
    // Then update the React state
    setTheme(newTheme);
    console.log("Theme toggled to:", newTheme);
  };

  const navClasses = `fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300 ${
    isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-md" : "bg-gray-900"
  }`;

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="https://i.postimg.cc/2SW1kwbf/Final.png"
              alt="Eco-Expert logo"
              className="w-12 h-12 rounded object-contain"
              onError={(e) => {
                console.log("Logo failed to load, using fallback");
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://placehold.co/100x100/22c55e/ffffff?text=EE";
              }}
            />
            <div>
              <span className="text-lg font-bold text-white flex items-center">
                <span className="text-green-500">Eco-</span>Expert
                <span className="hidden sm:inline">&nbsp;Recycling</span>
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                RECYCLING PVT. LTD.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-green-400 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-white hover:text-green-400 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="text-white hover:text-green-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-green-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </button>

            {/* Login/Sign Up Buttons - Removed temporarily */}
            {/* <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/auth/login"
                className="px-4 py-2 text-white bg-transparent border border-gray-300 hover:bg-gray-700 transition-colors rounded-md"
            >
              Log In
            </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 transition-colors rounded-md"
              >
                Sign Up
              </Link>
            </div> */}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-800 mt-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-3 py-2 text-white hover:bg-gray-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-white hover:bg-gray-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/services"
                className="px-3 py-2 text-white hover:bg-gray-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 text-white hover:bg-gray-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-white hover:bg-gray-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {/* Login/Signup buttons - Removed temporarily */}
              {/* <div className="flex space-x-2 pt-2">
                <Link
                  href="/auth/login"
                  className="flex-1 px-4 py-2 text-white text-center bg-transparent border border-gray-300 hover:bg-gray-700 transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 px-4 py-2 text-white text-center bg-green-600 hover:bg-green-700 transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
