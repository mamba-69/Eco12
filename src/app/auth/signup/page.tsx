"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validate inputs
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      setMessage("Registration successful! Please check your email to verify your account.");
      // Don't redirect immediately to let the user read the message
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000);
    } catch (error: any) {
      setError(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20">
      <div style={{ 
        maxWidth: "500px", 
        margin: "0 auto", 
        padding: "2rem", 
        backgroundColor: "#1F2937", 
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
          Create an Eco-Expert Account
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

        {message && (
          <div style={{ 
            backgroundColor: "#ECFDF5", 
            color: "#065F46", 
            padding: "0.75rem", 
            borderRadius: "0.375rem", 
            marginBottom: "1rem" 
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="fullName" 
              style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontSize: "0.875rem", 
                fontWeight: 500 
              }}
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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

          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontSize: "0.875rem", 
                fontWeight: 500 
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
            <label 
              htmlFor="confirmPassword" 
              style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontSize: "0.875rem", 
                fontWeight: 500 
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div style={{ 
          marginTop: "1.5rem", 
          textAlign: "center", 
          fontSize: "0.875rem" 
        }}>
          Already have an account?{" "}
          <Link 
            href="/auth/login" 
            style={{ 
              color: "#2ECC71",
              fontWeight: 500 
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
} 