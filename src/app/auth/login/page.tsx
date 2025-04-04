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

  // Auto-login for the admin for testing
  useEffect(() => {
    // Check if we should auto-login
    const adminCookie = document.cookie.includes("admin-session=true");
    const adminLocalStorage = localStorage.getItem("is-admin") === "true";

    if (adminCookie || adminLocalStorage) {
      console.log(
        "Auto-login: Admin session detected, redirecting to admin dashboard"
      );
      window.location.href = "/admin-direct/";
    }

    // For development: Uncomment to auto-fill admin credentials
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
  }, []);

  // Force redirect to admin dashboard if credentials match
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
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

        setTimeout(() => {
          window.location.href = "/admin-direct/";
        }, 500);
        return;
      }

      // Normal authentication flow
      await signIn(email, password);
      console.log("Sign in function completed");
      setLoginSuccess(true);

      setTimeout(() => {
        if (isAdmin) {
          console.log("Admin login successful, redirecting to admin dashboard");
          // Use direct URL for admin access instead of router to ensure proper navigation
          window.location.href = "/admin-direct/";
        } else {
          console.log("Regular user login, redirecting to home");
          router.push("/");
        }
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to sign in");
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

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
            Login successful!{" "}
            {isAdmin ? "Redirecting to admin dashboard..." : "Redirecting..."}
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

        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
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
                backgroundColor: "#111827",
                border: "1px solid #4B5563",
                borderRadius: "0.375rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                style={{
                  fontSize: "0.75rem",
                  color: "#2ECC71",
                }}
              >
                Forgot password?
              </Link>
            </div>
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
                backgroundColor: "#111827",
                border: "1px solid #4B5563",
                borderRadius: "0.375rem",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || loginSuccess}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              opacity: loading || loginSuccess ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : loginSuccess ? "Signed in" : "Sign in"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            style={{
              color: "#2ECC71",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
