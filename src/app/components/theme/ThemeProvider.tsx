"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const isMounted = useRef(true);

  // Initialize theme from localStorage on client side only
  useEffect(() => {
    setMounted(true);
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem(storageKey) as Theme | null;

      if (savedTheme) {
        if (isMounted.current) {
          setTheme(savedTheme);
        }
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        // Check system preference if no saved theme
        if (isMounted.current) {
          setTheme("dark");
        }
      }

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (theme === "system" && isMounted.current) {
          setTheme("system"); // This will trigger the effect below
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch (error) {
      console.error("Error initializing theme:", error);
    }
  }, [mounted, storageKey, theme]);

  // Update the class on the html element
  useEffect(() => {
    if (!mounted) return;

    try {
      const root = window.document.documentElement;

      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";

        root.classList.add(systemTheme);
        return;
      }

      root.classList.add(theme);
    } catch (error) {
      console.error("Error updating theme class:", error);
    }
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, newTheme);
        }
        if (isMounted.current) {
          setTheme(newTheme);
        }
      } catch (error) {
        console.error("Error setting theme:", error);
      }
    },
  };

  // Don't render anything until mounted (to prevent hydration mismatch)
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
