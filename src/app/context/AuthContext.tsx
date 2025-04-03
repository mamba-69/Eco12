"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Simple cookie management functions
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
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

// Admin credentials
const ADMIN_EMAIL = "admin@eco-expert.com";
const ADMIN_PASSWORD = "admin123";

// Mock user for development
const mockUser = {
  id: '123456',
  email: 'test@eco-expert.com',
  user_metadata: {
    full_name: 'Test User'
  }
} as User;

// Mock admin user
const mockAdminUser = {
  id: 'admin123',
  email: ADMIN_EMAIL,
  user_metadata: {
    full_name: 'Admin User',
    role: 'admin'
  }
} as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if the user is an admin
  const isAdmin = user?.email === ADMIN_EMAIL || user?.user_metadata?.role === 'admin' || false;
  
  // Set auth cookies when user or isAdmin changes
  useEffect(() => {
    if (user) {
      // Set auth session cookie for general authentication
      setCookie('auth-session', 'true', 1); // 1 day
      
      // Set admin session cookie if user is admin
      if (isAdmin) {
        setCookie('admin-session', 'true', 1); // 1 day
      } else {
        deleteCookie('admin-session');
      }
    } else {
      // Delete both cookies on logout
      deleteCookie('auth-session');
      deleteCookie('admin-session');
    }
  }, [user, isAdmin]);

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check for admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setUser(mockAdminUser);
        console.log("Admin signed in successfully");
        
        // Create a mock session
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          user: mockAdminUser
        } as Session;
        
        setSession(mockSession);
        setIsLoading(false);
        
        // Redirect to admin dashboard after login
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
        
        return;
      }
      
      // Regular user sign in
      if (password !== "password") {
        throw new Error("Invalid email or password");
      }
      
      // Create a mock user based on the email
      const newUser = {
        ...mockUser,
        email: email
      };
      
      setUser(newUser);
      console.log("Signed in with:", email);
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
      deleteCookie('auth-session');
      deleteCookie('admin-session');
      
      console.log("Signed out");
      router.push('/');
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