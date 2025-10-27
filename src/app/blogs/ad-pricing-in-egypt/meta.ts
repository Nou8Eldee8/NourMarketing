export {}; // ✅ تأكد إنه يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post = {
  title: "كم سعر الإعلانات في مصر؟ وكيف تختار الطريقة المناسبة لنشاطك؟",
  slug: "ad-pricing-in-egypt",
  excerpt:
    "تعرف على أسعار الإعلانات في مصر لعام 2025، العوامل التي تحدد التكلفة، وطرق الدفع المختلفة (CPM - CPC - CPL - CPA) مع أمثلة واقعية لكل نوع نشاط تجاري.",
  date: "2025-10-27",
  image: "/photos/blogs/3.png",
};
