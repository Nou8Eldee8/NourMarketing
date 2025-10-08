"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

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

      const user = data.data; // <-- use data directly, not data.user

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Admin / Sales Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-center text-red-500 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}
