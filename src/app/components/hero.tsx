"use client";

import Header from "./Header";
import bgImage from "./bg.jpg";
import { MessageCircle, FolderOpen } from "lucide-react";
import Link from "next/link";


export default function Hero() {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage.src})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Fixed Header */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 h-full w-full flex justify-center items-center px-6">
        <div
          className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-[40px] shadow-xl p-10 max-w-5xl w-full text-center"
          style={{
            WebkitBackdropFilter: "blur(16px)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h1 className="text-6xl md:text-8xl font-cocogoose text-[#fee3d8] mb-8 animate-slide-in mt-10">
            We Build Better<br />Brands Online
          </h1>

          <p className="text-base md:text-lg text-white max-w-xl mx-auto mb-10 font-light">
            We help you grow your digital presence with stunning content and powerful strategy.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
<Link
  href="/contact"
  className="bg-[#fee3d8] text-[#250d3f] font-semibold py-2 px-6 rounded-full shadow hover:scale-105 transition flex items-center gap-2"
>
  <MessageCircle size={16} /> Let’s Talk
</Link>
            <button className="bg-[#250d3f] text-[#fee3d8] font-semibold py-2 px-6 rounded-full shadow hover:scale-105 transition flex items-center gap-2">
              <FolderOpen size={16} /> Our Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
