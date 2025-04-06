"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

// Updated admin credentials for deployed version
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const { signIn, isAdmin } = useAuth();
  const [checkingSession, setCheckingSession] = useState(true);

  // Remove auto-login, only check for existing session
  useEffect(() => {
    // Don't check immediately to avoid flash
    const timer = setTimeout(() => {
      // Only check if we're on the client side
      if (typeof window !== "undefined") {
        const adminCookie = document.cookie.includes("admin-session=true");
        const adminLocalStorage = localStorage.getItem("is-admin") === "true";
        const storedEmail = localStorage.getItem("admin-email");

        // Only show message if there's an existing valid session
        if ((adminCookie || adminLocalStorage) && storedEmail === ADMIN_EMAIL) {
          console.log("Existing valid admin session detected");
          setError(null);
          setLoginSuccess(true);
        }
      }
      setCheckingSession(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle redirect to admin dashboard manually on button click
  const handleGoToAdmin = () => {
    window.location.href = "/admin-direct/";
  };

  // Force redirect to admin dashboard if credentials match
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate that both email and password were provided
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    console.log("Attempting login with:", email);

    try {
      // Special case for demo: direct admin access
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log("Direct admin login");
        setLoginSuccess(true);
        localStorage.setItem("is-admin", "true");
        localStorage.setItem("admin-email", email);
        document.cookie = `admin-session=true;path=/;max-age=${
          60 * 60 * 24 * 7
        }`;

        // Don't auto-redirect
        setLoading(false);
        return;
      }

      // Normal authentication flow
      await signIn(email, password);
      console.log("Sign in function completed");
      setLoginSuccess(true);
      setLoading(false);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to sign in");
      setLoginSuccess(false);
      setLoading(false);
    }
  };

  // Show loading state while checking for session
  if (checkingSession) {
    return (
      <div className="container py-20">
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            padding: "2rem",
            backgroundColor: "#1F2937",
            borderRadius: "0.5rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "white",
            }}
          >
            Checking Session...
          </h1>
          <div className="flex justify-center">
            <div className="animate-pulse w-10 h-10 rounded-full bg-green-500/20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "2rem",
          backgroundColor: "#1F2937",
          borderRadius: "0.5rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "white",
          }}
        >
          Log in to Eco-Expert
        </h1>

        {loginSuccess && (
          <div
            style={{
              backgroundColor: "#DEF7EC",
              color: "#046C4E",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div className="mb-4">Login successful!</div>
            <button
              onClick={handleGoToAdmin}
              style={{
                backgroundColor: "#059669",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Go to Admin Dashboard
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
          autoComplete="off"
          data-form-type="login"
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "medium",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                backgroundColor: "#374151",
                borderWidth: "1px",
                borderColor: "#4B5563",
                borderRadius: "0.375rem",
                color: "white",
              }}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "medium",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                backgroundColor: "#374151",
                borderWidth: "1px",
                borderColor: "#4B5563",
                borderRadius: "0.375rem",
                color: "white",
              }}
              placeholder="••••••••"
            />
          </div>

          <div style={{ textAlign: "right" }}>
            <a
              href="#"
              style={{
                fontSize: "0.875rem",
                color: "#10B981",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.625rem 1.25rem",
              backgroundColor: "#10B981",
              color: "white",
              borderRadius: "0.375rem",
              fontWeight: "medium",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#9CA3AF",
            }}
          >
            Don't have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#10B981" }}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
