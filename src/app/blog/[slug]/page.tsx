import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import prisma from "@/lib/prisma";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug, status: "published" },
        include: {
            comments: {
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!post) notFound();

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(post.createdAt);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            {/* Back link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-[#64748b] hover:text-[#fafafa] transition-colors mb-12 group"
            >
                <ArrowLeft
                    size={14}
                    strokeWidth={1.5}
                    className="group-hover:-translate-x-1 transition-transform"
                />
                Back to posts
            </Link>

            {/* Post header */}
            <header className="mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fafafa] leading-tight mb-6 tracking-tight">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-[#64748b]">
                    <span className="flex items-center gap-2">
                        <Calendar size={14} strokeWidth={1.5} />
                        {formattedDate}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/[0.1]" />
                    <span>{post.comments.length} comments</span>
                </div>
                <div className="mt-8 h-px bg-gradient-to-r from-white/[0.1] via-white/[0.06] to-transparent" />
            </header>

            {/* Markdown content */}
            <article className="prose-premium mb-16">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-[#fafafa] mt-10 mb-4">
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-xl font-semibold text-[#fafafa] mt-8 mb-3">
                                {children}
                            </h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-lg font-medium text-[#fafafa] mt-6 mb-2">
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-[#94a3b8] leading-relaxed mb-4">{children}</p>
                        ),
                        a: ({ href, children }) => (
                            <a
                                href={href}
                                className="text-[#a1a1aa] underline underline-offset-2 decoration-white/[0.2] hover:decoration-[#a1a1aa] transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {children}
                            </a>
                        ),
                        code: ({ children, className }) => {
                            const isBlock = className?.includes("language-");
                            if (isBlock) {
                                return (
                                    <code className="block bg-[#0a0a0a] border border-white/[0.06] rounded-lg p-4 text-sm text-[#a1a1aa] overflow-x-auto">
                                        {children}
                                    </code>
                                );
                            }
                            return (
                                <code className="bg-white/[0.05] border border-white/[0.06] rounded px-1.5 py-0.5 text-xs text-[#a1a1aa]">
                                    {children}
                                </code>
                            );
                        },
                        pre: ({ children }) => (
                            <pre className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg p-4 overflow-x-auto my-6">
                                {children}
                            </pre>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-white/[0.1] pl-4 text-[#64748b] italic my-6">
                                {children}
                            </blockquote>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-2 my-4 text-[#94a3b8]">
                                {children}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-2 my-4 text-[#94a3b8]">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li className="text-[#94a3b8] leading-relaxed">
                                {children}
                            </li>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-semibold text-[#fafafa]">{children}</strong>
                        ),
                        hr: () => (
                            <hr className="border-none h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent my-10" />
                        ),
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </article>

            {/* Like button */}
            <div className="flex items-center gap-4 py-6 border-y border-white/[0.06] mb-12">
                <span className="text-sm text-[#64748b]">
                    Found this useful?
                </span>
                <LikeButton postId={post.id} initialLikes={post.likes} />
            </div>

            {/* Comments */}
            <CommentSection
                postId={post.id}
                initialComments={post.comments.map((c: { id: string; userName: string; content: string; createdAt: Date }) => ({
                    id: c.id,
                    userName: c.userName,
                    content: c.content,
                    createdAt: c.createdAt,
                }))}
            />
        </div>
    );
}
