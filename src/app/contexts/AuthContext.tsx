"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { account } from "../lib/appwrite";
import { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isMounted = useRef(true);

  // Set up cleanup function to prevent memory leaks
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Set mounted flag when component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication status after component mounts
  useEffect(() => {
    if (!mounted) return;

    const checkAuthAsync = async () => {
      try {
        console.log("Checking auth status...");
        const currentUser = await account.get();
        if (isMounted.current) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (isMounted.current) {
          setUser(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    checkAuthAsync();
  }, [mounted]);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      if (isMounted.current) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      if (isMounted.current) {
        setUser(null);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", email);
      await account.createSession(email, password);
      await checkAuth();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      if (isMounted.current) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: !mounted || loading, // Consider loading until mounted
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
