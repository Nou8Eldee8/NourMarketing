import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { Metadata } from "next";
import { Cairo } from "next/font/google";
import Link from "next/link";
import { post } from "./meta";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: post.title + " | شركة Nour Marketing مصر",
  description: post.excerpt,
};

const sections = [
  {
    title: "1- ما هو التسويق بالمحتوى؟",
    content: `بعد 2024 ومع سيطرة المحتوى القصير (Reels - TikToks) على السوشيال ميديا، 
بقى لازم أي براند أو بزنس يستخدمه ضمن خطة التسويق بالمحتوى بتاعته، خصوصًا في 2025 و2026.

التسويق بالمحتوى ببساطة هو إنك تخلق محتوى جذاب وقيم يخلي الناس تتابعك وتثق فيك، 
بدل ما تعتمد على الإعلانات فقط. الهدف إنك تقدم فائدة حقيقية للجمهور، 
وبمرور الوقت تتحول الثقة دي لمبيعات.

فكر في مطعم بيشارك وصفات أو نصائح عن الأكل الصحي — 
هو مش بيبيع في كل بوست، لكنه بيكسب متابعين بيشتروا منه بعد كده.`,
  },
  {
    title: "2- ما هي أنواع المحتوى؟",
    content: `أنواع المحتوى اللي ممكن تعتمد عليها في التسويق كتير، لكن أهمهم 8 أنواع أساسية:

1️⃣ محتوى قصصي (Storytelling): بتحكي قصة واقعية أو موقف حصل، يقرّبك من الجمهور.
2️⃣ محتوى قيمة: بتقدم فيه معلومة مفيدة تسهّل حياة العميل — زي سباك بيشرح إزاي تغير جلدة الحنفية بنفسك.
3️⃣ محتوى توعوي: بتوضح فيه خدماتك بخفة دم، وتبيّن إنك بتقدم حلول ممكن الناس ما كانتش عارفاها.
4️⃣ محتوى عرض: بتعرض فيه منتجك أو خدمتك بشكل مباشر.
5️⃣ محتوى من إنتاج العملاء (UGC): تجارب حقيقية من ناس استخدمت منتجك أو خدمتك.
6️⃣ محتوى مراجعات: تقييمات وآراء العملاء.
7️⃣ محتوى تفاعلي: زي فيديوهات بتسأل الناس في الشارع أو في النادي أسئلة في مجالك.
8️⃣ محتوى إجابة أسئلة: بترد على أسئلة الناس أو التعليقات بخفة دم أو توضيح فعلي.

وطبعًا مش لازم تعمل الأنواع دي كلها. 
الأهم إنك تختار اللي يخدم رحلة العميل ويوصل رسالتك بوضوح.`,
  },
  {
    title: "3- إزاي تعمل خطة تسويق بالمحتوى بسيطة؟",
    content: `ابدأ بالتركيز على المحتوى التوعوي ومحتوى القيمة.
الهدف إنك تساعد العميل وتوضح خبرتك، 
بس في نفس الوقت تفكره إنك بتقدم خدمات أو منتجات تحل مشكلته مقابل مقابل مادي.

خطتك الشهرية ممكن تكون كده:
- قسم الشهر ليوم تصوير ويوم نشر.
- ابدأ بأبسط الأدوات — الموبايل والشمس كفاية في الأول.
- نزل 10 فيديوهات محتوى قيمة، 2 فيديو توعوي عن خدماتك، و3 فيديوهات عن عروض أو خصومات حقيقية.
- خليك مستمر، ومع الوقت هتلاحظ تراكم في النتائج بشكل كبير جدًا.

الاستمرارية أهم من الكمال — حتى لو أول فيديوهاتك مش مثالية، كمل. 
كل خطوة بتعلمك حاجة.`,
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
                        <Link href="blogs/marketing-steps" className="text-[#8C93A8] hover:text-[#fee3d8] m-5 p-2.5"
            > دوس هنا عشان تقرا مقالنا عن خطوات عملية التسويق
</Link>
<br></br>
       <Link href="blogs/socialmedia-content" className="text-[#8C93A8] hover:text-[#fee3d8] m-5 p-2.5"
            >دوس هنا عشان تقرا مقالنا عن ازاي تكتب محتوى ناجح على السوشيال ميديا 
</Link>
          <p className="text-lg text-gray-300">
            💬 محتاج تبدأ خطة تسويق بالمحتوى تناسب نشاطك؟
            <br />
            تواصل مع{" "}
            <span className="text-[#B5C2B7] font-semibold">Nour Marketing</span>{" "}
            وابدأ تنفيذ خطة المحتوى الخاصة بيك بخبرة فريقنا المتخصص.
          </p>
          <Link
            href="/contactform"
            className="inline-block bg-[#45364B] text-white px-8 py-3 rounded-2xl text-lg font-semibold mt-8 hover:bg-[#62466B] transition"
          >
            خلينا نبدأ نرسم خطة المحتوى الخاصة بيك
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
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: "ar-EG",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://nourmarketing.agency/blogs/${post.slug}`,
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
