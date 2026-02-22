import prisma from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import { StaggerList, StaggerItem } from "@/components/PageTransition";
import { FileText } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      {/* Hero */}
      <section className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs text-[#64748b] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-pulse" />
          Publishing Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          <span className="text-[#fafafa]">Thoughts,</span>
          <br />
          <span className="text-[#94a3b8]">Curated.</span>
        </h1>

        <p className="text-lg text-[#64748b] max-w-md mx-auto leading-relaxed">
          A minimal space for ideas that matter.
        </p>
      </section>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/[0.06] bg-white/[0.02] mb-6">
            <FileText size={24} strokeWidth={1.5} className="text-[#64748b]" />
          </div>
          <p className="text-[#64748b] text-sm">
            No posts yet. Check back soon.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs text-[#64748b] uppercase tracking-wider">
              Latest Posts
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-[#64748b]">
              {posts.length}
            </span>
          </div>

          <StaggerList>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: { id: string; title: string; slug: string; content: string; likes: number; createdAt: Date; _count: { comments: number } }) => (
                <StaggerItem key={post.id}>
                  <BlogCard
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    content={post.content}
                    likes={post.likes}
                    commentCount={post._count.comments}
                    createdAt={post.createdAt}
                  />
                </StaggerItem>
              ))}
            </div>
          </StaggerList>
        </>
      )}
    </div>
  );
}
