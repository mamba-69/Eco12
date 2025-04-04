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
  const [logoUrl, setLogoUrl] = useState<string>(
    "https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
  );
  const [primaryColor, setPrimaryColor] = useState<string>("#2ECC71");
  const [siteName, setSiteName] = useState<string>("Eco-Expert");

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load settings from store when component mounts
  useEffect(() => {
    if (siteSettings) {
      // Always default to the online hosted logo if no custom logo is set
      setLogoUrl(
        siteSettings.logoUrl ||
          "https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
      );
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
    // Always use the online hosted logo unless explicitly changed in admin
    const isCustomLogo =
      logoUrl !==
        "https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png" &&
      (logoUrl.startsWith("http") || logoUrl.startsWith("https"));

    // If using the default online hosted logo or a custom logo from settings
    return (
      <div className="flex items-center">
        <div className="relative w-12 h-12 mr-2 overflow-hidden">
          <Image
            src={logoUrl}
            alt={siteName || "Eco-Expert Recycling"}
            width={48}
            height={48}
            className="object-contain hover:scale-105 transition-transform"
            priority
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
            RECYCLING PVT. LTD.
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
