"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeProvider";
import { FiSun, FiMoon, FiMenu, FiX } from "@/app/lib/icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { siteSettings } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/images/logo.svg");
  const [primaryColor, setPrimaryColor] = useState<string>("#2ECC71");
  const [siteName, setSiteName] = useState<string>("Eco-Expert");

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load settings from store when component mounts
  useEffect(() => {
    if (siteSettings) {
      setLogoUrl(siteSettings.logoUrl || "/images/logo.svg");
      setPrimaryColor(siteSettings.primaryColor || "#2ECC71");
      setSiteName(siteSettings.siteName || "Eco-Expert");
    }
  }, [siteSettings]);

  // Listen for settings changes from admin panel
  useSettingsChangeListener((data) => {
    if (data.settings) {
      // Update logo URL if changed
      if (data.settings.logoUrl) {
        setLogoUrl(data.settings.logoUrl);
      }

      // Update primary color if changed
      if (data.settings.primaryColor) {
        setPrimaryColor(data.settings.primaryColor);
      }

      // Update site name if changed
      if (data.settings.siteName) {
        setSiteName(data.settings.siteName);
      }

      console.log("Navbar updated from admin panel:", data.source);
    }
  });

  // Logo component with advanced styling
  const Logo = () => {
    // Check if logoUrl is an external URL (for custom logos set in admin)
    const isExternalLogo =
      logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("https"));

    // If using a custom logo from settings
    if (isExternalLogo) {
      return (
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-2 overflow-hidden">
            <Image
              src={logoUrl}
              alt={siteName || "Logo"}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span
                className="font-extrabold text-xl tracking-tight"
                style={{ color: primaryColor }}
              >
                {siteName?.split(" ")[0] || "Eco"}
              </span>
              {siteName?.split(" ")[1] && (
                <span className="font-extrabold text-xl text-foreground ml-1">
                  {siteName?.split(" ")[1]}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">
              Recycling PVT. LTD.
            </span>
          </div>
        </div>
      );
    }

    // Default logo with customizable color
    return (
      <div className="flex items-center">
        <div className="relative w-10 h-10 mr-2">
          {/* Base circle */}
          <div
            className="absolute inset-0 rounded-full shadow-lg transform -rotate-6"
            style={{
              background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryColor}CC)`,
            }}
          />

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
            <span
              className="font-extrabold text-xl tracking-tight mr-1"
              style={{ color: primaryColor }}
            >
              {siteName?.split(" ")[0] || "Eco"}
            </span>
            <span className="font-extrabold text-xl text-foreground">
              {siteName?.split(" ")[1] || "Expert"}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">
            Recycling PVT. LTD.
          </span>
        </div>
      </div>
    );
  };

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

  // Custom style variables based on settings
  const navLinkActiveStyle = { color: primaryColor };
  const navLinkHoverStyle = { color: primaryColor };
  const buttonStyle = { backgroundColor: primaryColor };
  const buttonHoverStyle = { backgroundColor: `${primaryColor}DD` };

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
                link.href === "/"
                  ? "text-primary font-semibold"
                  : "text-foreground"
              }`}
              style={link.href === "/" ? navLinkActiveStyle : undefined}
              onMouseOver={(e) =>
                link.href !== "/" &&
                (e.currentTarget.style.color = primaryColor)
              }
              onMouseOut={(e) =>
                link.href !== "/" && (e.currentTarget.style.color = "")
              }
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
                className="px-4 py-2 text-sm rounded-md text-white transition-colors shadow-sm hover:shadow-md"
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = `${primaryColor}DD`)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = primaryColor)
                }
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
                  link.href === "/"
                    ? "text-primary font-semibold"
                    : "text-foreground"
                }`}
                style={link.href === "/" ? navLinkActiveStyle : undefined}
                onMouseOver={(e) =>
                  link.href !== "/" &&
                  (e.currentTarget.style.color = primaryColor)
                }
                onMouseOut={(e) =>
                  link.href !== "/" && (e.currentTarget.style.color = "")
                }
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
                className="py-2 text-center rounded-md text-white shadow-sm transition-colors"
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = `${primaryColor}DD`)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = primaryColor)
                }
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
