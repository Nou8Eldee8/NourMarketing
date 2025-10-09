"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import bgImage from "../components/bg.jpg";

type Language = "en" | "ar";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang.startsWith("ar")) setLang("ar");
  }, []);

  const waitForFbq = () =>
    new Promise<void>((resolve) => {
      const check = () => {
        if (typeof (window as any).fbq === "function") resolve();
        else setTimeout(check, 200);
      };
      check();
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
      business_name: data.get("business_name"),
      government: data.get("government"),
      budget: Number(data.get("budget")),
      has_website: data.get("has_website") === "on",
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Form submission failed");

      await waitForFbq();
      (window as any).fbq("track", "Lead");

      console.log("✅ Meta Pixel Lead event fired!");
      window.location.href = "/thank-you";
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        lang === "ar"
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const t = {
    en: {
      title: "Let’s Talk",
      subtitle:
        "We don’t do packages. We build marketing strategies tailored to your business.",
      name: "Full Name | الاسم الكامل",
      email: "Email Address | البريد الإلكتروني",
      phone: "Phone Number | رقم الهاتف",
      business: "Business Name | اسم النشاط التجاري",
      government: "Governorate | المحافظة",
      budget: "Estimated Monthly Budget (EGP) | الميزانية الشهرية المتوقعة",
      website: "Do you have a website? | هل لديك موقع إلكتروني؟",
      message: "Tell us about your project | أخبرنا عن مشروعك",
      submit: "Get Your Custom Strategy | احصل على استراتيجيتك المخصصة",
      submitting: "Submitting... | جارٍ الإرسال...",
      whatsapp: "Chat on WhatsApp | تحدث معنا على واتساب",
      back: "← Back | رجوع",
    },
    ar: {
      title: "تواصل معنا",
      subtitle:
        "نحن لا نقدم باقات جاهزة، بل نبني استراتيجيات تسويق مخصصة لعملك.",
      name: "Full Name | الاسم الكامل",
      email: "Email Address | البريد الإلكتروني",
      phone: "Phone Number | رقم الهاتف",
      business: "Business Name | اسم النشاط التجاري",
      government: "Governorate | المحافظة",
      budget: "Estimated Monthly Budget (EGP) | الميزانية الشهرية المتوقعة",
      website: "Do you have a website? | هل لديك موقع إلكتروني؟",
      message: "Tell us about your project | أخبرنا عن مشروعك",
      submit: "Get Your Custom Strategy | احصل على استراتيجيتك المخصصة",
      submitting: "Submitting... | جارٍ الإرسال...",
      whatsapp: "Chat on WhatsApp | تحدث معنا على واتساب",
      back: "← Back | رجوع",
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
        {/* ✅ Fixed Back Button (always visible top-left) */}
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="fixed top-6 left-6 z-50 flex items-center gap-2 text-[#fee3d8]/80 hover:text-[#fee3d8] transition text-sm md:text-base"
        >
          <ArrowLeft size={20} />
          {tr.back}
        </button>

        {/* Background Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 z-0"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        ></div>

        {/* Content */}
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

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <input
              type="text"
              name="business_name"
              placeholder={tr.business}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

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
<select
  name="government"
  required
  className="w-full p-4 bg-[#2D0A3D]/80 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
>
  <option value="">{tr.government}</option>
  <option value="Cairo">Cairo | القاهرة</option>
  <option value="Alexandria">Alexandria | الإسكندرية</option>
  <option value="Giza">Giza | الجيزة</option>
</select>


            <input
              type="number"
              name="budget"
              placeholder={tr.budget}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_website" className="accent-[#fee3d8]" />
              <span>{tr.website}</span>
            </label>

            <textarea
              name="message"
              placeholder={tr.message}
              rows={4}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            ></textarea>

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
