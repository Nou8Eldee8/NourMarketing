"use client";

import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { href: "https://drive.google.com/file/d/1kZSLtaSd9zCt0-dPfq6bDBe0ZQygkc91/view?usp=sharing", label: "Our Work" },
        { href: "/about", label: "About us" },
        { href: "/careers", label: "Careers" },
        { href: "/contact", label: "Contact us" },
    ];

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[50%]">
                <div className="relative flex items-center justify-between px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg md:gap-12 transition-all duration-300">
                    {/* Logo */}
                    <Link href="/" className="font-dancingScript text-3xl text-white font-bold select-none cursor-pointer" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        N
                    </Link>

                    {/* Desktop Menu - Optional, maybe hide for mobile-first toggle approach as requested "toggle to open" implies hidden by default? 
              Ref says "toggle to open the following", implying it's hidden. 
              But usually desktop shows links. I'll stick to a toggle button for simplicity/clean aesthetic or show links on desktop?
              Let's allow toggle for all for a super clean "Liquid Glass" look, or show links on desktop.
              I will implement a toggle button that opens a menu overlay.
          */}
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Fullscreen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-8 text-center">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="text-4xl md:text-6xl font-bold text-white/80 hover:text-white transition-colors tracking-wide font-cocogoose"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Close button at bottom or just clicking outside/top X? The top nav is still visible so the X button works. */}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
