"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      localStorage.setItem("token", data.access_token);

      document.cookie = `access_token=${data.access_token}; path=/`;

      router.push("/taskboard");
    } catch (error) {
      console.error(error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/20 p-8 rounded-2xl backdrop-blur-md shadow-2xl border border-white/30"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-semibold ml-1">
              Email Address
            </label>
            <input
              type="email"
              className="bg-white/90 border-0 p-3 rounded-lg focus:ring-4 focus:ring-blue-400 outline-none transition-all text-gray-800"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-semibold ml-1">
              Password
            </label>
            <input
              type="password"
              className="bg-white/90 border-0 p-3 rounded-lg focus:ring-4 focus:ring-blue-400 outline-none transition-all text-gray-800"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-1 text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.9, y: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-full py-3 mt-4 bg-linear-to-r from-blue-600 to-blue-400 text-white font-bold rounded-lg shadow-lg cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-white/90 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold underline hover:text-white">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
