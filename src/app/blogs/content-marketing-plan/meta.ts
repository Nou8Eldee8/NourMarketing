export {}; // ✅ علشان يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post = {
  title: "ما هي خطة التسويق بالمحتوى؟ وأبسط طريقة لبدء استراتيجية فعّالة في 2025",
  slug: "content-marketing-plan",
  excerpt:
    "تعرف على معنى التسويق بالمحتوى، وأنواع المحتوى المختلفة، وكيف تبني خطة محتوى بسيطة وفعالة تناسب نشاطك التجاري في 2025 بدون تعقيد أو ميزانيات ضخمة.",
  date: "2025-10-29",
  image: "/photos/blogs/5.png",
};
