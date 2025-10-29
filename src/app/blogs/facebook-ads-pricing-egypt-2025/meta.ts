export {}; // ✅ تأكد إنه يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post: Post = {
  title: "كم سعر الإعلان على الفيس بوك في مصر 2025؟ وكيف تختار الميزانية المناسبة لنشاطك؟",
  slug: "facebook-ads-pricing-egypt-2025",
  excerpt:
    "دليل شامل لأسعار إعلانات الفيس بوك في مصر لعام 2025 — اعرف تكلفة الإعلان الممول، الفرق بين CBO وABO، ومتوسط الأسعار لكل نشاط تجاري.",
  date: "2025-10-29",
  image: "/photos/blogs/4.png",
};
