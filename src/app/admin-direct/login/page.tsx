"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("ecoexpert@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const [debugInfo, setDebugInfo] = useState("Initializing...");
  const isMounted = useRef(true);

  // Set isMounted ref for cleanup
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Simple debug logger to help troubleshoot
  useEffect(() => {
    console.log("Login page mounted");
    if (isMounted.current) {
      setDebugInfo("Login page mounted");
    }

    // Log auth context availability
    try {
      if (isMounted.current) {
        setDebugInfo(
          (prev) =>
            prev + " | Auth context: " + (auth ? "Available" : "Missing")
        );
      }
      console.log("Auth context:", auth);
    } catch (err) {
      console.error("Error accessing auth context:", err);
      if (isMounted.current) {
        setDebugInfo((prev) => prev + " | Auth context error");
      }
    }
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted.current) return;

    setError("");
    setLoading(true);
    setDebugInfo((prev) => prev + " | Login attempt");
    console.log("Login attempt with:", email);

    try {
      if (typeof auth?.login === "function") {
        await auth.login(email, password);
        if (isMounted.current) {
          setDebugInfo((prev) => prev + " | Login success");
          router.push("/admin-direct");
        }
      } else {
        throw new Error("Login function not available");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (isMounted.current) {
        setError("Invalid email or password");
        setDebugInfo(
          (prev) =>
            prev +
            " | Login failed: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Fallback for direct login
  const handleDirectLogin = () => {
    if (!isMounted.current) return;

    setLoading(true);
    setDebugInfo((prev) => prev + " | Direct login");

    try {
      // Store a simple auth flag in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-auth", "true");
        localStorage.setItem("admin-email", email);
      }

      // Redirect to admin panel
      router.push("/admin-direct");
    } catch (err) {
      console.error("Direct login error:", err);
      if (isMounted.current) {
        setError("Failed to access admin panel");
        setDebugInfo((prev) => prev + " | Direct login failed");
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the admin dashboard
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in with Appwrite"
            )}
          </button>

          <button
            type="button"
            onClick={handleDirectLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Direct Admin Access
          </button>
        </div>

        <div className="text-sm text-center mt-4">
          <p className="text-gray-500 dark:text-gray-400">
            Demo credentials: ecoexpert@gmail.com / admin123
          </p>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-left overflow-auto max-h-20">
            <code className="whitespace-pre-wrap break-all">{debugInfo}</code>
          </div>
        </div>
      </form>
    </div>
  );
}
