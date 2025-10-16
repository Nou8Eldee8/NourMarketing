"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";
import bgImage from "../components/bg.jpg";
import { Tajawal } from "next/font/google";
import { v4 as uuidv4 } from "uuid"; // ✅ Added for unique lead ID

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

export default function ContactPageAB() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

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

    const data = new FormData(e.currentTarget);
    const payload = {
      id: uuidv4(), // ✅ generate unique ID for the backend
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

      window.location.href = "/thank-you";
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  const labels = {
    title: "دعنا نبدأ بخطوات بسيطة 👋",
    subtitle:
      "أجب عن بعض الأسئلة القصيرة وسنقوم بإعداد استراتيجيتك التسويقية المخصصة.",
    step1: "الخطوة 1 من 3: تفاصيل النشاط التجاري",
    step2: "الخطوة 2 من 3: بيانات التواصل",
    step3: "الخطوة 3 من 3: معلومات إضافية",
    business_name: "اسم النشاط التجاري",
    business_placeholder: "مثلاً: نور ماركتنج أو محل زعفران",
    government: "المحافظة",
    budget: "الميزانية الشهرية المتوقعة (بالجنيه)",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    website: "هل لديك موقع إلكتروني؟",
    message: "هل ترغب بإخبارنا المزيد عن مشروعك؟",
    next: "التالي",
    back: "السابق",
    submit: "إرسال المعلومات",
    submitting: "جارٍ الإرسال...",
    whatsapp: "تحدث معنا على واتساب",
  };

  return (
    <div className={tajawal.className}>
      <section className="relative min-h-screen bg-[#0f0215] text-[#fee3d8] px-6 pb-32 pt-24 overflow-hidden text-right">
        {/* ✅ Back button */}
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="fixed top-6 left-6 z-50 flex items-center gap-2 text-[#fee3d8]/80 hover:text-[#fee3d8] transition text-sm md:text-base"
        >
          <ArrowLeft size={20} />
          {labels.back}
        </button>

        {/* Background */}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{labels.title}</h1>
            <p className="text-xl text-[#fee3d8]/80">{labels.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            {/* Step Indicator */}
            <div className="flex justify-center items-center gap-2 mb-6 text-sm text-[#fee3d8]/70">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-1 rounded-full transition-all ${
                    step > i ? "bg-[#fee3d8]" : "bg-[#fee3d8]/30"
                  }`}
                ></div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4">{labels.step1}</h2>

                <input
                  type="text"
                  name="business_name"
                  placeholder={labels.business_placeholder}
                  required
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8] placeholder-[#fee3d8]/60 focus:ring-2 focus:ring-[#fee3d8]/40"
                />

                <select
                  name="government"
                  required
                  className="w-full p-4 bg-[#2D0A3D]/80 border border-white/20 rounded-xl backdrop-blur-md text-[#fee3d8]"
                >
                  <option value="">{labels.government}</option>
                  <option value="Cairo">القاهرة</option>
                  <option value="Alexandria">الإسكندرية</option>
                  <option value="Giza">الجيزة</option>
                </select>

                <input
                  type="number"
                  name="budget"
                  placeholder={labels.budget}
                  required
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:ring-2 focus:ring-[#fee3d8]/40"
                />

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-[#290f4c] hover:bg-[#3a1b63] text-[#fee3d8] rounded-xl font-semibold"
                >
                  {labels.next} <ArrowRight className="inline ml-2" size={16} />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4">{labels.step2}</h2>

                <input
                  type="text"
                  name="name"
                  placeholder={labels.name}
                  required
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:ring-2 focus:ring-[#fee3d8]/40"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder={labels.phone}
                  required
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:ring-2 focus:ring-[#fee3d8]/40"
                />

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-6 bg-[#3a1b63] text-[#fee3d8] rounded-xl font-semibold"
                  >
                    {labels.back}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-3 px-6 bg-[#290f4c] hover:bg-[#3a1b63] text-[#fee3d8] rounded-xl font-semibold"
                  >
                    {labels.next}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4">{labels.step3}</h2>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="has_website" className="accent-[#fee3d8]" />
                  <span>{labels.website}</span>
                </label>

                <textarea
                  name="message"
                  rows={4}
                  placeholder={labels.message}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#fee3d8] placeholder-[#fee3d8]/60 focus:ring-2 focus:ring-[#fee3d8]/40"
                ></textarea>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-6 bg-[#3a1b63] text-[#fee3d8] rounded-xl font-semibold"
                  >
                    {labels.back}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`py-3 px-6 rounded-xl font-semibold transition-all ${
                      submitting
                        ? "bg-[#3a1b63] cursor-not-allowed opacity-70"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white flex items-center gap-2`}
                  >
                    {submitting ? labels.submitting : labels.submit}
                    {!submitting && <Check size={18} />}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* WhatsApp CTA */}
          <div className="pt-8">
            <a
              href="https://wa.me/201283052272"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              <MessageCircle size={18} />
              {labels.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
