import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 py-10 px-4 bg-gradient-to-r from-black via-[#1a1a1a] to-black text-[#fee3d8] text-center border-t border-white/20 rounded-t-2xl">
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <p className="text-5xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
          N
        </p>

        {/* Social Icons */}
        <div className="flex gap-6">
          <Link
            href="https://www.facebook.com/nourmarketingagencyeg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B5C2B7] transition"
          >
            <Facebook size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/nourmarketingagencyeg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B5C2B7] transition"
          >
            <Instagram size={24} />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-[#fee3d8]/70" style={{ fontFamily: "'Dancing Script', cursive" }}>
          &copy; {new Date().getFullYear()} Nour Marketing Agency. All rights reserved.
          
        </p>
      </div>
    </footer>
  );
}
