"use client";

import Link from "next/link";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <>
    <section className="min-h-screen bg-[#0f0215] text-[#fee3d8] px-6 py-24">
      <div className="max-w-5xl mx-auto space-y-20">
           {/* Logo */}
        <Link
          href="/"
          className="text-5xl font-bold transition text-[#fee3d8]"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>
        {/* Arabic Section */}
        <div className="text-right space-y-6">
          <div className="w-fit ml-auto px-6 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 transition-transform hover:scale-105">
            <h1 className="text-4xl md:text-5xl font-cocogoose font-bold text-[#fee3d8]">
              من نحن
            </h1>
          </div>

          <p className="text-lg leading-relaxed text-[#fee3d8]/90">
            نحن <span className="font-bold">Nour Marketing Agency</span>، وكالة تسويق متكاملة تقدم حلول تسويقية مخصصة تبدأ من الاستراتيجية وحتى التنفيذ.
          </p>
          <p className="text-lg leading-relaxed text-[#fee3d8]/90">
            نعمل مع الشركات والمشروعات الطموحة التي تسعى لنمو حقيقي، ونبني لكل عميل خطة تسويقية تناسب أهدافه وسوقه ونقاط قوته. لا نقدم باقات جاهزة، بل حلول مبنية على دراسة وتحليل.
          </p>
          <p className="text-lg leading-relaxed text-[#fee3d8]/90">
            فريقنا شاب، ذكي، وديناميكي. نُتقن بناء الهويات، إدارة المحتوى، الإعلانات، والإنتاج الإبداعي، ونفهم كيف نخلق تواصل فعّال بين البراند والجمهور.
          </p>
          <p className="text-lg leading-relaxed text-[#fee3d8]/90 italic border-t border-[#fee3d8]/30 pt-4">
            رؤيتنا: أن نصنع حملات تُلهم، وهوية تُرسّخ، وتسويق يُحدث فرقًا.
          </p>
        </div>

        {/* English Section */}
        <div className="text-left space-y-6">
          <div className="w-fit mr-auto px-6 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 transition-transform hover:scale-105">
            <h2 className="text-4xl md:text-5xl font-cocogoose font-bold text-[#fee3d8]">
              About Us
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-[#fee3d8]/90">
            We are <span className="font-bold">Nour Marketing Agency</span> — a full-service marketing agency offering custom-built strategies from planning to execution.
          </p>
          <p className="text-lg leading-relaxed text-[#fee3d8]/90">
            We work with ambitious brands looking for real growth, and we craft unique marketing strategies tailored to each client’s goals, audience, and market. We don’t do cookie-cutter packages — only insight-driven, personalized solutions.
          </p>
          <p className="text-lg leading-relaxed text-[#fee3d8]/90">
            Our team is young, smart, and dynamic. We excel at branding, content strategy, creative production, and paid ads — and we know how to create real connection between brands and people.
          </p>
          <p className="text-lg leading-relaxed text-[#fee3d8]/90 italic border-t border-[#fee3d8]/30 pt-4">
            Our vision: To create campaigns that inspire, branding that lasts, and marketing that actually moves the needle.
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center pt-10">
          <Link
            href="/"
            className="inline-block bg-[#290f4c] hover:bg-[#3a1b63] text-[#fee3d8] px-6 py-3 rounded-full font-semibold transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
      
    </section>
    < Footer />
    </>
  );
}
