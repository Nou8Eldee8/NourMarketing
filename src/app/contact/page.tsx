"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Footer from "../components/Footer";
import bgImage from "../components/bg.jpg";

type Language = "en" | "ar";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  // Detect browser language once on load
  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang.startsWith("ar")) {
      setLang("ar");
    }
  }, []);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xgvzenbe", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      setSubmitting(false);

      if (response.ok) {
        // ✅ Fire Meta Pixel "Lead" event safely
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead");
          console.log("Meta Pixel Lead event fired ✅");
        } else {
          console.warn("Meta Pixel not initialized ⚠️");
        }

        // ✅ Redirect after successful submission
        window.location.href = "/thank-you";
      } else {
        alert(
          lang === "ar"
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitting(false);
      alert(
        lang === "ar"
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Please try again."
      );
    }
  };

  // Translation strings
  const t = {
    en: {
      title: "Let’s Talk",
      subtitle:
        "We don’t do packages. We build marketing strategies tailored to your business.",
      name: "Your Name",
      email: "Email Address",
      phone: "Phone Number",
      message: "Tell us about your project",
      submit: "Get Your Custom Strategy",
      submitting: "Submitting...",
      whatsapp: "Chat on WhatsApp",
    },
    ar: {
      title: "تواصل معنا",
      subtitle:
        "نحن لا نقدم باقات جاهزة، بل نبني استراتيجيات تسويق مخصصة لعملك.",
      name: "اسمك",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      message: "أخبرنا عن مشروعك",
      submit: "احصل على استراتيجيتك المخصصة",
      submitting: "جارٍ الإرسال...",
      whatsapp: "تحدث معنا على واتساب",
    },
  };

  const tr = t[lang];

  return (
    <>
      <section
        className={`relative min-h-screen bg-[#0f0215] text-[#fee3d8] px-6 pb-32 pt-24 overflow-hidden ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {/* --- Background --- */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 z-0"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        ></div>

        {/* --- Content --- */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-12 text-center">
          <Link
            href="/"
            className="text-6xl font-bold transition text-[#fee3d8] mb-16"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            N
          </Link>

          <div>
            <h1 className="text-4xl md:text-5xl font-cocogoose font-bold mb-4">
              {tr.title}
            </h1>
            <p className="text-xl text-[#fee3d8]/80">{tr.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder={tr.name}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />
            <input
              type="email"
              name="email"
              placeholder={tr.email}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />
            <input
              type="tel"
              name="phone"
              placeholder={tr.phone}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />
            <textarea
              name="message"
              placeholder={tr.message}
              rows={4}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                submitting
                  ? "bg-[#3a1b63] cursor-not-allowed opacity-70"
                  : "bg-[#290f4c] hover:bg-[#3a1b63]"
              } text-[#fee3d8]`}
            >
              {submitting ? tr.submitting : tr.submit}
            </button>
          </form>

          {/* WhatsApp CTA */}
          <div className="pt-6">
            <a
              href="https://wa.me/201283052272"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              <MessageCircle size={18} />
              {tr.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
