"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiAlertCircle } from "@/app/lib/icons";
import { useAuth } from "@/app/context/AuthContext";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password);

      // Successful login - redirect happens in the AuthContext for admin
      // For regular users, redirect to home
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center text-red-600 dark:text-red-400">
          <FiAlertCircle className="flex-shrink-0 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6" 
        autoComplete="off"
        data-form-type="login"
      >
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-900`}
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-900`}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
            >
              Remember me
            </label>
          </div>

          <a
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
