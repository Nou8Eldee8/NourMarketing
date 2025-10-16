"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  role: "admin" | "sales" | "team_leader" | "social_media_specialist" | "video_editor" | "content_creator" | "reel_maker" | null;
}

interface LoginResponse {
  success: boolean;
  data?: { user: User };
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setMessage(
      hour >= 5 && hour < 12
        ? "Good Morning, kill it today!"
        : "Night Owl, a sale never knows a time."
    );
  }, []);

  const redirectByRole = (role: string | null) => {
  switch (role) {
    case "admin":
      router.push("/admin");
      break;
    case "sales":
      router.push("/sales-dashboard");
      break;
    case "team_leader":
      router.push("/ops/leader");
      break;
    case "social_media_specialist":
      router.push("/ops/specialist");
      break;
    case "video_editor":
      router.push("/ops/editor");
      break;
    case "content_creator":
      router.push("/ops/creator");
      break;
    case "reel_maker":
      router.push("/ops/reel");
      break;
    default:
      router.push("/ops");
  }
};


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

      if (!res.ok || !data.success || !data.data?.user) {
        throw new Error(data.error || "Invalid credentials");
      }

      const user = data.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      redirectByRole(user.role);
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
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');`}
      </style>

      <div className="mb-12">
        <Link
          href="/"
          className="text-6xl font-bold text-[#fee3d8] transition transform hover:scale-110 hover:animate-bounce"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-purple-800 p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4 transition-all hover:shadow-[0_0_20px_5px_rgba(254,227,216,0.4)]"
      >
        <h1 className="text-2xl font-bold text-center text-[#fee3d8]">
          Login to Nour System
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

      <p
        className="mt-6 text-center text-2xl text-[#fee3d8] transition-transform duration-500 hover:scale-105"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {message}
      </p>
    </div>
  );
}
