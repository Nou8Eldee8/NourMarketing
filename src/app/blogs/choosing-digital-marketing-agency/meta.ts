export {}; // ✅ تأكد إنه يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post = {
  title: "كيف تختار شركة تسويق إلكتروني مناسبة لمشروعك في مصر؟ | دليل شامل 2025",
  slug: "choosing-digital-marketing-agency",
  excerpt:
    "دليلك لاختيار أفضل شركة تسويق إلكتروني تناسب أهداف مشروعك في السوق المصري لعام 2025. تعرف على المعايير الأساسية، التحديات، والاستراتيجيات الفعالة لتحقيق النجاح الرقمي.",
  date: "2025-10-29",
  image: "/photos/blogs/5.png",
};
