import fs from "fs";
import path from "path";
import Link from "next/link";
import Header from "../components/Header";

export const metadata = {
  title: "المدونة | Nour Marketing Agency",
  description:
    "مقالات تسويقية من Nour Marketing Agency عن أحدث استراتيجيات التسويق، صناعة المحتوى، والإدارة الرقمية للبراندات.",
};

// Path to the blogs directory
const blogsDir = path.join(process.cwd(), "src/app/blogs");

// ✅ Get all subfolders (each blog)
async function getPosts() {
  const entries = fs
    .readdirSync(blogsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "[slug]");

  const posts = [];

  for (const dir of entries) {
    try {
      const { post } = await import(`../blogs/${dir.name}/page`);
      posts.push({ slug: dir.name, ...post });
    } catch (err) {
      console.warn(`⚠️ Skipped blog "${dir.name}" (missing export post)`);
    }
  }

  // Optional: sort by date if needed later
  return posts;
}

export default async function BlogsPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#2D2327] text-[#F1F1F1] py-24 px-4 md:px-10 font-[Cairo]" dir="rtl">
      <Header />
      <section className="text-center mb-16 mt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#fee3d8] mb-4">المدونة</h1>
        <p className="text-[#B5C2B7] text-lg max-w-2xl mx-auto">
          مقالات حصرية من فريق{" "}
          <span className="text-[#fee3d8]">Nour Marketing Agency</span> بنشارك فيها خبرتنا في التسويق الرقمي وصناعة المحتوى ونمو البراندات.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={`/blogs/${post.slug}`}
            key={post.slug}
            className="group bg-[#45364B] rounded-2xl overflow-hidden shadow-lg hover:shadow-[#62466B]/40 transition-all duration-300 border border-[#62466B]/30"
          >
            <div className="overflow-hidden h-56">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-[#fee3d8] group-hover:text-[#B5C2B7] transition-colors duration-300">
                {post.title}
              </h2>
              <p className="text-[#B5C2B7]/90 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-[#8C93A8] mt-4">
                <span>{post.date}</span>
                <span className="text-[#fee3d8] group-hover:underline">اقرأ المزيد →</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
