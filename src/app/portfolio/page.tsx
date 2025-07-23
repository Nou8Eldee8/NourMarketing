"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import bgImage from "../components/bg.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo1 from "../components/logos/logo1.png";
import logo2 from "../components/logos/logo3.png";
import logo3 from "../components/logos/logo7.png";
import Image from "next/image";

export default function PortfolioPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const browserLang = navigator.language.startsWith("ar") ? "ar" : "en";
    setLang(browserLang);
  }, []);

const data = {
  en: [
    {
      client: "Uncle Ba'ali",
      logo: logo1,
      subtitle: "5x sales in 90 days of work!",
      stats: [
        "4M views organically on TikTok",
        "4M views organically on Facebook",
        "People came from Kuwait, Qatar, Saudi, Palestine, Libya and all across Egypt",
      ],
    },
    {
      client: "Papa Döner",
      logo: logo2,
      subtitle: "4M+ views with zero ad spend!",
      stats: [
        "We filmed natural content — no acting, no scripts",
        "We showed the food from different angles",
        "We told the story of how Döner came from Europe to Egypt",
        "Consistency was key — fewer than 10 videos brought over 4M views",
        "People watched, engaged, and ordered ❤️",
      ],
    },
    {
      client: "SkyGate Innovations",
      logo: logo3,
      subtitle: "40 leads with only 4K EGP!",
      stats: [
        "Tailored leads campaign for a premium compound",
        "40 leads with a budget of 4000 EGP",
        "10% conversion rate: 4 confirmed deals",
        "Total CAC (Customer Acquisition Cost): ~1100 EGP",
      ],
    },
  ],
  ar: [
    {
      client: "العم بقالي",
      logo: logo1,
      subtitle: "زيادة في المبيعات 5x خلال 90 يوم!",
      stats: [
        "4 مليون مشاهدة عضوية على تيك توك",
        "4 مليون مشاهدة عضوية على فيسبوك",
        "الناس جتله من الكويت وقطر والسعودية وفلسطين وليبيا وكل محافظات مصر تقريبًا",
      ],
    },
    {
      client: "بابا دونر",
      logo: logo2,
      subtitle: "أكتر من 4 مليون مشاهدة من غير ما نصرف جنيه!",
      stats: [
        "صورنا محتوى طبيعي من غير تمثيل ولا سكريبتات",
        "الفيديوهات كانت كلها عن الأكل بس من زوايا مختلفة",
        "حكينا قصة الدونر وإزاي وصل من أوروبا لمصر",
        "السر كان في البساطة والاستمرار",
        "أقل من 10 فيديوهات = 4 مليون مشاهدة ❤️",
      ],
    },
    {
      client: "سكاي جيت",
      logo: logo3,
      subtitle: "40 lead بـ 4000 جنيه بس!",
      stats: [
        "حملة مخصصة لعُملاء مهتمين بتشطيب كمباوند معين",
        "40 lead بجنيه 4000 فقط",
        "معدل تحويل 10%: تم التعاقد مع 4 عملاء",
        "تكلفة الاستحواذ على العميل الواحد: حوالي 1100 جنيه",
      ],
    },
  ],
};


  const content = data[lang];
  const currentCase = content[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % content.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + content.length) % content.length);
  };

  return (
    <div className="bg-[#0f0215] text-[#fee3d8] min-h-screen">
      <Navbar />

      <main
        className="px-6 pt-32 pb-16 min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-xl p-8 max-w-4xl w-full text-center"
          style={{ WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)" }}
        >
          <Image
            src={currentCase.logo}
            alt={`${currentCase.client} logo`}
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />

          <h1 className="text-4xl font-cocogoose mb-2">{currentCase.client}</h1>
<h2 className="text-xl font-cocogoose opacity-80 mb-6">
  {currentCase.subtitle.split(/(\d+[^ ]*)/).map((part, idx) =>
    /\d/.test(part) ? (
      <span
        key={idx}
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-2xl inline-block"
      >
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  )}
</h2>

          <ul className="space-y-3 list-disc list-inside text-start md:text-center">
            {currentCase.stats.map((point, idx) => (
              <li key={idx} className="text-lg font-cocogoose leading-relaxed">
                {point.split(/(\d+(\.\d+)?[MK]?\+?)/g).map((part, index) =>
                  /\d+(\.\d+)?[MK]?\+?/.test(part) ? (
                    <span
                      key={index}
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                      className="text-2xl inline-block px-1"
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-2 bg-[#fee3d8] text-[#250d3f] rounded-full hover:scale-105 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-[#fee3d8] text-[#250d3f] rounded-full hover:scale-105 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
              <div className="flex justify-center pb-16 mt-10">
  <a
    href="/contact"
    className="bg-[#250d3f] text-[#fee3d8] font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition transform duration-200"
  >
    Get your free strategy now
  </a>
</div>
      </main>



      <Footer />
    </div>
  );
}
