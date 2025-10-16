"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  user?: { username: string };
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [username, setUsername] = useState(user?.username || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Optional: fetch user from localStorage if not passed
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUsername(parsed.username || "");
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" />
)}

<header
  className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] z-50 rounded-full bg-white/20 border border-white/30 shadow-xl backdrop-blur-md transition-all duration-300"
  style={{
    WebkitBackdropFilter: "blur(12px)",
    backdropFilter: "blur(12px)",
  }}
>
  <div className="flex items-center justify-between px-6 py-3 md:px-10 md:py-4">
    {/* Left: Logo + Greeting */}
    <div className="flex items-center gap-4 flex-1">
      <Link
        href="/"
        className="text-4xl font-bold transition text-[#290f46] hover:text-[#fee3d8]"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        N
      </Link>
      {username && <span className="text-white font-medium">Hello, {username}!</span>}
    </div>

    {/* Right: Logout / Mobile Menu */}
    <div className="flex items-center gap-4">
      <button
        onClick={handleLogout}
        className="hidden md:inline bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition"
      >
        Logout
      </button>

      <button
        className="md:hidden text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  <div
    className={`md:hidden transition-all duration-300 overflow-hidden px-6 ${
      mobileOpen ? "max-h-[200px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"
    }`}
  >
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white mb-2"
    >
      Logout
    </button>
  </div>
</header>

    </>
  );
}
