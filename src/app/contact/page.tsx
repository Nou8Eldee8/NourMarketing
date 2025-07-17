// app/contact/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-[#0f0215] text-[#fee3d8] px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-12 text-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-6xl font-bold transition text-[#fee3d8] mb-16"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-cocogoose font-bold mb-4">Let’s Talk</h1>
          <p className="text-xl text-[#fee3d8]/80">
            We don’t do packages. We build marketing strategies tailored to your business.
          </p>
        </div>

        {/* Formspree Form */}
        <form
          action="https://formspree.io/f/xgvzenbe" // 👈 replace with your ID
          method="POST"
          className="space-y-6 text-left"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60"
          />
          <textarea
            name="message"
            placeholder="Tell us about your project"
            rows={4}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60"
          />

          <button
            type="submit"
            className="bg-[#290f4c] hover:bg-[#3a1b63] text-[#fee3d8] px-6 py-3 rounded-xl font-semibold transition-all w-full"
          >
            Get Your Custom Strategy
          </button>
            <input type="hidden" name="_redirect" value="https://nourmarketing.netlify.app/thank-you" />

        </form>

        {/* WhatsApp Button */}
        <div className="pt-6">
          <a
            href="https://wa.me/201283052272"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
