export {}; // ✅ تأكد إنه يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post: Post = {
  title: "ما هي خطوات التسويق خطوة بخطوة؟",
  slug: "marketing-steps",
  excerpt:
    "تعرف على خطوات التسويق خطوة بخطوة، من تحديد المستهدف وتحليل السوق إلى بناء خطة المحتوى وتحديد ميزانية الإعلانات، مع أمثلة عملية واقعية.",
  date: "2025-10-29",
  image: "/photos/blogs/4.png",
};
