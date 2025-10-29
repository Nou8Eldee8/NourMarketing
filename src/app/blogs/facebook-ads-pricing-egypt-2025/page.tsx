import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { Cairo } from "next/font/google";
import Link from "next/link";
import { post } from "./meta";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

const sections = [
  {
    title: "1. فيسبوك بيحسب تكلفة الإعلان إزاي؟",
    content: `فيسبوك بيستخدم نظام المزايدة (Auction System) وبيتعامل بطريقة CPM — يعني التكلفة بتحسب لكل 1000 ظهور.
لكن السعر مش ثابت، بيتغير حسب جودة الإعلان، نوع النشاط التجاري، مدى المنافسة في نفس الوقت، وسلوك الجمهور المستهدف.

📌 مثال: إعلان لمطعم في القاهرة هيكلف أكتر من إعلان لنفس المطعم في مدينة صغيرة، بسبب حجم المنافسة وعدد المعلنين.`,
  },
  {
    title: "2. تحديد الميزانية الإعلانية",
    content: `قبل ما تبدأ أي حملة، لازم تحدد ميزانيتك بوضوح بناءً على هدفك (وعي – تفاعل – مبيعات) وقيمة المنتج وتكلفة العميل المحتمل (CAC).

👕 مثال: لو بتبيع براند ملابس وسعر القطعة 700 جنيه، مينفعش تبدأ بحملة بـ100 جنيه وتستنى نتائج حقيقية.`,
  },
  {
    title: "3. مرحلة اختبار الإعلانات (A/B Testing)",
    content: `قبل ما تصرف ميزانية كبيرة، اختبر أكثر من كرياتيف وجمهور. التجربة هي اللي بتوضح لك أي إعلان بيحقق نتائج أعلى.

🎯 مثال: جرّب إعلان بيوري المنتج فقط، وآخر فيه شخص بيتكلم عنه، وشوف أنهي بيكسب أكتر.`,
  },
  {
    title: "4. الفرق بين CBO وABO",
    content: `🔹 ABO (Ad Set Budget Optimization): بتحدد ميزانية لكل مجموعة إعلانية يدويًا. مناسب لما تكون لسه بتختبر الجماهير.

🔹 CBO (Campaign Budget Optimization): فيسبوك بيوزع الميزانية تلقائيًا حسب الأداء الأفضل. مناسب بعد ما تعرف الجمهور الرابح.`,
  },
  {
    title: "5. بعد مرحلة الاختبار — CAC وLTV",
    content: `بعد الاختبار، لازم تحسب العلاقة بين CAC (تكلفة اكتساب العميل) و LTV (قيمة العميل مدى الحياة).

لو المنتج بيتباع مرة واحدة، لازم CAC تكون أقل من هامش الربح.  
أما لو العميل بيرجع يشتري منك (زي المطاعم أو براندات الملابس)، فممكن تصرف أكتر لأن الـ LTV عالي.`,
  },
  {
    title: "6. متوسط سعر الألف مشاهدة (CPM) في مصر 2025",
    content: `💄 منتجات التجميل والعناية: من 25 – 45 جنيه  
👕 الملابس والأزياء: من 20 – 35 جنيه  
🏥 الخدمات الطبية: من 40 – 70 جنيه  
🍔 المطاعم والكافيهات: من 15 – 30 جنيه  
🎓 الكورسات أونلاين: من 30 – 60 جنيه`,
  },
  {
    title: "7. متوسط ROAS المتوقع حسب النشاط",
    content: `ROAS (العائد على الإنفاق الإعلاني) هو أهم رقم لازم تتابعه بعد كل حملة.

👗 الملابس والإكسسوارات: 3x – 6x  
🏥 الخدمات الطبية: 2x – 4x  
🎓 الكورسات أونلاين: 4x – 8x  
🍴 المطاعم: 2x – 3x

لو الأرقام أقل من كده، فده مؤشر إن في مشكلة في الكرياتيف أو الاستهداف.`,
  },
];

export default function BlogPage() {
  return (
    <div
      className={`${cairo.className} bg-[#1B1719] text-gray-100 min-h-screen`}
      dir="rtl"
    >
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#B5C2B7] mt-24">
          {post.title}
        </h1>

        <p className="text-center text-gray-400 mb-12">
          من فريق الخبراء في{" "}
          <span className="text-[#8C93A8] font-semibold">Nour Marketing</span>
        </p>

        {sections.map((s, i) => (
          <article key={i} className="mb-10">
            <h2 className="text-2xl font-bold mb-3 text-[#62466B]">{s.title}</h2>
            <p className="leading-relaxed text-gray-300 whitespace-pre-line">
              {s.content}
            </p>

            {i !== sections.length - 1 && (
              <div className="border-t border-[#45364B] mt-8 mb-8 opacity-60" />
            )}
          </article>
        ))}

        <div className="text-center mt-16">
          <p className="text-lg text-gray-300">
            💬 تواصل معنا اليوم في{" "}
            <span className="text-[#B5C2B7] font-semibold">Nour Marketing</span>{" "}
            ودعنا نبدأ في ضبط ميزانية إعلاناتك وتجربة أول حملة اختبار معًا.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            (نقدر نعمل لك ملف تقديري للميزانية خلال 48 ساعة من التحليل الأولي).
          </p>
          <Link
            href="/contactform"
            className="inline-block bg-[#45364B] text-white px-8 py-3 rounded-2xl text-lg font-semibold mt-8 hover:bg-[#62466B] transition"
          >
            خلينا نساعدك نحسب الميزانية المناسبة
          </Link>
        </div>
      </main>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            author: {
              "@type": "Organization",
              name: "Nour Marketing Agency",
              url: "https://nourmarketing.agency/",
            },
            publisher: {
              "@type": "Organization",
              name: "Nour Marketing Agency",
              logo: {
                "@type": "ImageObject",
                url: "https://nourmarketing.agency/logo.png",
              },
            },
            datePublished: "2025-10-29",
            dateModified: "2025-10-29",
            inLanguage: "ar-EG",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                "https://nourmarketing.agency/blogs/facebook-ads-pricing-egypt-2025",
            },
          }),
        }}
      />

      {/* Suggested Posts */}
      <section className="mt-16 border-t border-[#45364B] pt-10 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-semibold text-[#B5C2B7] mb-6">
          اقرأ أيضًا 👇
        </h3>
        <ul className="space-y-4 text-[#8C93A8]">
          <li>
            <Link href="/blogs/ad-pricing-in-egypt" className="hover:text-[#fee3d8]">
              كم سعر الإعلانات في مصر؟ وكيف تختار الطريقة المناسبة لنشاطك؟
            </Link>
          </li>
          <li>
            <Link href="/blogs/localbrandmarketing" className="hover:text-[#fee3d8]">
              كيف تبني خطة تسويق ذكية لبراند الملابس الخاص بك في 2025؟
            </Link>
          </li>
        </ul>
      </section>

      <Footer />
    </div>
  );
}
