import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 py-8 px-4 bg-gradient-to-r from-black via-gray-800 to-gray-900 backdrop-blur-md border-t border-white/20 text-white text-center rounded-t-2xl">
      <div className="flex flex-col items-center gap-3">
        {/* Logo */}
        <p
          className="text-3xl"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </p>

        {/* Social Icons */}
        <div className="flex gap-4">
          <Link
            href="https://www.facebook.com/nourmarketingagencyeg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B5C2B7] transition"
          >
            <Facebook size={20} />
          </Link>
          <Link
            href="https://www.instagram.com/nourmarketingagencyeg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B5C2B7] transition"
          >
            <Instagram size={20} />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} Nour Marketing Agency. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
