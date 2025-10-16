"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import bgImage from "../components/bg.jpg";
import { Tajawal } from "next/font/google";
import { v4 as uuidv4 } from "uuid"; // ✅ Added for unique lead ID

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      id: uuidv4(), // ✅ generate unique ID
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

      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Lead");
      }

      window.location.href = "/thank-you";
    } catch (error) {
      console.error("Form submission error:", error);
      alert("حدث خطأ ما. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section
        dir="rtl"
        className={`${tajawal.className} relative min-h-screen bg-[#0f0215] text-[#fee3d8] px-6 pb-32 pt-24 overflow-hidden text-right`}
      >
        {/* 🔙 زر الرجوع */}
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="fixed top-6 right-6 z-50 flex items-center gap-2 text-[#fee3d8]/80 hover:text-[#fee3d8] transition text-sm md:text-base"
        >
          <ArrowLeft size={20} className="rotate-180" />
          <span>رجوع</span>
        </button>

        {/* خلفية */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 z-0"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        ></div>

        {/* المحتوى */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-12 text-center">
          <Link
            href="/"
            className="text-6xl font-bold transition text-[#fee3d8] mb-16"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            N
          </Link>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
            <p className="text-xl text-[#fee3d8]/80 leading-relaxed">
              لا نقدم باقات جاهزة — بل نبني استراتيجيات تسويق مخصصة تناسب أهداف
              نشاطك التجاري.
            </p>
          </div>

          {/* الفورم */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="business_name"
              placeholder="اسم النشاط التجاري"
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <input
              type="text"
              name="name"
              placeholder="الاسم الكامل"
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <select
              name="government"
              required
              className="w-full p-4 bg-[#2D0A3D]/80 border border-white/20 rounded-xl text-[#fee3d8] focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            >
              <option value="">اختر المحافظة</option>
              <option value="Cairo">القاهرة</option>
              <option value="Alexandria">الإسكندرية</option>
              <option value="Giza">الجيزة</option>
            </select>

            <input
              type="number"
              name="budget"
              placeholder="الميزانية الشهرية المتوقعة (بالجنيه المصري)"
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
            />

            <label className="flex items-center gap-2 justify-end text-right">
              <span>هل لديك موقع إلكتروني؟</span>
              <input type="checkbox" name="has_website" className="accent-[#fee3d8]" />
            </label>

            <textarea
              name="message"
              placeholder="حدثنا عن مشروعك أو التحدي الذي تواجهه"
              rows={4}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:outline-none focus:ring-2 focus:ring-[#fee3d8]/40"
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
              {submitting ? "جارٍ الإرسال..." : "احصل على استراتيجيتك المخصصة"}
            </button>
          </form>

          {/* زر واتساب */}
          <div className="pt-6">
            <a
              href="https://wa.me/201283052272"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              <MessageCircle size={18} />
              تحدث معنا على واتساب
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
