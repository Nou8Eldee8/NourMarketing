export {}; // ✅ تأكد إنه يعتبر Module

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
};

export const post: Post = {
  title: "ازاي تبيع منتج بسرعة من خلال السوشيال ميديا؟ | Nour Marketing",
  slug: "sell-fast-socialmedia",
  excerpt:
    "تعرف على 3 طرق فعالة ومجربة لبيع منتجك بسرعة على السوشيال ميديا باستخدام الإعلانات الممولة، محتوى UGC، واستراتيجية الـ Virality.",
  date: "27 أكتوبر 2025",
  image: "/photos/blogs/2.png",
};
