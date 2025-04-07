"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Models } from "appwrite";

// Define our own User and Session types based on Appwrite models
type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
  app_metadata?: {
    role?: string;
  };
  role?: string;
  aud?: string;
  created_at?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
};

type Session = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  user: User;
};

// Simple cookie management functions
function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials - updated for deployed version
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Add a type declaration for window object
declare global {
  interface Window {
    checkAdminAccess: () => { isAdmin: boolean; adminEmail: string };
  }
}

// Make admin email available globally
if (typeof window !== "undefined") {
  // Set default admin email in localStorage for easier admin access
  if (!localStorage.getItem("admin-email")) {
    localStorage.setItem("admin-email", ADMIN_EMAIL);
  }

  // Create a global access function
  window.checkAdminAccess = function () {
    return {
      isAdmin: localStorage.getItem("is-admin") === "true",
      adminEmail: localStorage.getItem("admin-email") || ADMIN_EMAIL,
    };
  };
}

// Create a basic mock User object
const createMockUser = (
  id: string,
  email: string,
  fullName: string,
  role?: string
): User => {
  // First create a minimal mock user with required properties
  const mockUser = {
    id,
    email,
    user_metadata: {
      full_name: fullName,
      ...(role && { role }),
    },
    app_metadata: role === "admin" ? { role: "admin" } : {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role: role || "user", // Add explicit role property
  } as unknown; // First cast to unknown

  // Then cast to User type
  return mockUser as User;
};

// Mock users
const mockUser = createMockUser("123456", "test@eco-expert.com", "Test User");
const mockAdminUser = createMockUser(
  "admin123",
  ADMIN_EMAIL,
  "Admin User",
  "admin"
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if the user is an admin
  const isAdmin =
    user?.email === ADMIN_EMAIL ||
    user?.user_metadata?.role === "admin" ||
    user?.app_metadata?.role === "admin" ||
    user?.role === "admin" ||
    false;

  useEffect(() => {
    console.log("Auth context - User state:", user?.email);
    console.log("Auth context - Is admin?", isAdmin);
    console.log("Auth context - User metadata:", user?.user_metadata);
    console.log("Auth context - App metadata:", user?.app_metadata);
  }, [user, isAdmin]);

  // Set auth cookies when user or isAdmin changes
  useEffect(() => {
    if (user) {
      // Set auth session cookie for general authentication
      setCookie("auth-session", "true", 1); // 1 day

      // Set admin session cookie if user is admin
      if (isAdmin) {
        setCookie("admin-session", "true", 1); // 1 day
        // Store admin email in local storage for additional verification
        if (typeof window !== "undefined") {
          localStorage.setItem("admin-email", user.email || "");
        }
      } else {
        deleteCookie("admin-session");
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin-email");
        }
      }
    } else {
      // Delete both cookies on logout
      deleteCookie("auth-session");
      deleteCookie("admin-session");
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin-email");
      }
    }
  }, [user, isAdmin]);

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", email);

      // Use a more secure comparison
      const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const isAdminLogin = isAdminEmail && password === ADMIN_PASSWORD;

      if (isAdminLogin) {
        console.log("Admin credentials verified");

        // Create a simple mock session
        const mockSession = {
          access_token: "admin-token-" + Date.now(),
          refresh_token: "admin-refresh-token-" + Date.now(),
          expires_in: 3600,
          user: mockAdminUser,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        } as Session;

        // Set both session and user together
        setSession(mockSession);
        setUser(mockAdminUser);

        // Store admin info in localStorage as fallback
        if (typeof window !== "undefined") {
          localStorage.setItem("is-admin", "true");
          localStorage.setItem("admin-email", email);
          // Set a longer cookie that's accessible to all pages
          document.cookie = `admin-session=true;path=/;max-age=${
            60 * 60 * 24 * 7
          }`;
        }

        console.log("Admin signed in successfully");
        setIsLoading(false);
        return;
      } else if (isAdminEmail) {
        // If email is admin but password is wrong
        throw new Error("Invalid admin password");
      }

      // Regular user sign in with more generic error handling
      // In a real app, you would check credentials against a database
      if (!email.includes("@") || password.length < 6) {
        console.error("Invalid credentials format");
        throw new Error("Invalid email or password");
      }

      // Create a mock user based on the email
      const userRecord = createMockUser(
        "user-" + Date.now(),
        email,
        email.split("@")[0] // Use part of the email as the name
      );

      setUser(userRecord);
      console.log("Signed in with regular account");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Mock sign up function
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      // In development, just log the registration
      console.log("Registered user:", { email, fullName });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);

      // Clear auth cookies
      deleteCookie("auth-session");
      deleteCookie("admin-session");

      console.log("Signed out");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Mock reset password function
  const resetPassword = async (email: string) => {
    try {
      console.log("Password reset requested for:", email);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
