"use client";

import { useState } from "react";
import {
  Facebook,
  FileText,
  Menu,
  FolderOpen,
  BookOpen,
  MessageCircle,
  Instagram,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" />
      )}

      <header
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] lg:w-[70%] z-50 rounded-full bg-white/20 border border-white/30 shadow-xl backdrop-blur-md transition-all duration-300"
        style={{
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-5">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="text-4xl font-bold transition text-[#290f46] hover:text-[#fee3d8]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              N
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <NavigationMenu className="hidden md:flex flex-1 justify-center">
            <NavigationMenuList className="flex items-center gap-6 font-cocogoose text-sm text-[#fee3d8]">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/portfolio"
                  className="px-5 py-2 rounded-full transition-all duration-300 hover:bg-[#2D2327] hover:text-white hover:scale-105"
                >
                  Our Work
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#our-story"
                  className="px-5 py-2 rounded-full transition-all duration-300 hover:bg-[#2D2327] hover:text-white hover:scale-105"
                >
                  Our Story
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/contact"
                  className="px-5 py-2 rounded-full transition-all duration-300 hover:bg-[#2D2327] hover:text-white hover:scale-105"
                >
                  Let’s Talk
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right: Social Icons (desktop only) */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-4 text-[#fee3d8]">
            <Link
              href="https://www.facebook.com/nourmarketingagencyeg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#290f46] hover:text-[#fee3d8] transition-all duration-200"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href="https://www.instagram.com/nourmarketingagency/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#290f46] hover:text-[#fee3d8] transition-all duration-200"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[#fee3d8]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden px-6 ${
            mobileOpen
              ? "max-h-[600px] py-6 opacity-100"
              : "max-h-0 py-0 opacity-0"
          }`}
        >
          <div className="space-y-4 text-[#fee3d8] text-base font-medium text-center rounded-2xl bg-white/10 p-5 border border-white/30 shadow-md backdrop-blur-lg font-cocogoose">
            {[
              {
                href: "https://www.facebook.com/nourmarketingagencyeg",
                icon: <Facebook size={18} />,
                label: "Facebook",
              },
              {
                href: "https://www.instagram.com/nourmarketingagency/",
                icon: <Instagram size={18} />,
                label: "Instagram",
              },
              {
                href: "#form",
                icon: <FileText size={18} />,
                label: "Fill our form",
              },
              {
                href: "#portfolio",
                icon: <FolderOpen size={18} />,
                label: "Our portfolio",
              },
              {
                href: "#our-story",
                icon: <BookOpen size={18} />,
                label: "Our Story",
              },
              {
                href: "/docs",
                icon: <MessageCircle size={18} />,
                label: "Let’s talk",
              },
            ].map(({ href, icon, label }, index) => (
              <div key={label}>
                <Link
                  href={href}
                  className="flex justify-center items-center gap-2 hover:text-white transition"
                  onClick={closeMobileMenu}
                >
                  {icon} {label}
                </Link>
                {index < 5 && (
                  <hr className="border-white/20 w-2/3 mx-auto my-2 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
