"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/"); // Redirect to home on success
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20">
      <div style={{ 
        maxWidth: "400px", 
        margin: "0 auto", 
        padding: "2rem", 
        backgroundColor: "#1F2937", 
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
          Log in to Eco-Expert
        </h1>

        {error && (
          <div style={{ 
            backgroundColor: "#FEE2E2", 
            color: "#B91C1C", 
            padding: "0.75rem", 
            borderRadius: "0.375rem", 
            marginBottom: "1rem" 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontSize: "0.875rem", 
                fontWeight: 500 
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
              style={{ 
                width: "100%", 
                padding: "0.5rem 0.75rem", 
                backgroundColor: "#111827", 
                border: "1px solid #4B5563", 
                borderRadius: "0.375rem" 
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label 
                htmlFor="password" 
                style={{ 
                  fontSize: "0.875rem", 
                  fontWeight: 500 
                }}
              >
                Password
              </label>
              <Link 
                href="/auth/forgot-password" 
                style={{ 
                  fontSize: "0.75rem", 
                  color: "#2ECC71" 
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
              style={{ 
                width: "100%", 
                padding: "0.5rem 0.75rem", 
                backgroundColor: "#111827", 
                border: "1px solid #4B5563", 
                borderRadius: "0.375rem" 
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              width: "100%", 
              padding: "0.75rem 1rem", 
              opacity: loading ? 0.7 : 1 
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{ 
          marginTop: "1.5rem", 
          textAlign: "center", 
          fontSize: "0.875rem" 
        }}>
          Don't have an account?{" "}
          <Link 
            href="/auth/signup" 
            style={{ 
              color: "#2ECC71",
              fontWeight: 500 
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 