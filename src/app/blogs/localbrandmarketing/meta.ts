export {}; // ✅ تأكد إنه يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post: Post = {
  title:
    "كيف تبني خطة تسويق ذكية لبراند الملابس الخاص بك في 2025 | Nour Marketing",
  slug: "localbrandmarketing",
  excerpt:
    "تعرف على أحدث اتجاهات واستراتيجيات التسويق الرقمي اللي هتساعد البراند بتاعك يتميز ويتصدر المنافسة في 2025.",
  date: "21 أكتوبر 2025",
  image: "/photos/blogs/1.png",
};
