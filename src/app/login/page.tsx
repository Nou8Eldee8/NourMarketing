"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  role: "admin" | "sales";
}

interface LoginResponse {
  success: boolean;
  data?: User;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Set motivational message based on current time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setMessage("Good Morning, kill it today!");
    } else {
      setMessage("Night Owl, a sale never knows a time.");
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.error || "Invalid credentials");
      }

      const user = data.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/sales-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen text-gray-100"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Import Cairo font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');`}
      </style>

      {/* Logo */}
      <div className="mb-12">
        <Link
          href="/"
          className="text-6xl font-bold text-[#fee3d8] transition transform hover:scale-110 hover:animate-bounce"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-purple-800 p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4 transition-all hover:shadow-[0_0_20px_5px_rgba(254,227,216,0.4)]"
      >
        <h1 className="text-2xl font-bold text-center text-[#fee3d8]">
          Admin / Sales Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-700 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-700 text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-center text-red-400 text-sm">{error}</p>}
      </form>

      {/* Motivational message */}
      <p
        className="mt-6 text-center text-2xl text-[#fee3d8] transition-transform duration-500 hover:scale-105"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {message}
      </p>
    </div>
  );
}
