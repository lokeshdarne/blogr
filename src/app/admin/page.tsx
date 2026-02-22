import prisma from "@/lib/prisma";
import Link from "next/link";
import { deletePost, togglePostStatus } from "@/lib/actions";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    Heart,
    MessageSquare,
    FileText,
} from "lucide-react";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default async function AdminDashboardPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { comments: true } },
        },
    });

    const publishedCount = posts.filter((p: { status: string }) => p.status === "published").length;
    const draftCount = posts.filter((p: { status: string }) => p.status === "draft").length;

    return (
        <div className="p-6 md:p-8 pt-16 md:pt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#fafafa] mb-1">
                        Dashboard
                    </h1>
                    <p className="text-sm text-[#64748b]">
                        Manage your posts
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                        bg-white/[0.05] border border-white/[0.06] text-[#fafafa]
                        hover:bg-white/[0.08] hover:border-white/[0.12] transition-colors"
                >
                    <Plus size={14} strokeWidth={1.5} />
                    New Post
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Total", value: posts.length, icon: FileText },
                    { label: "Published", value: publishedCount, icon: Eye },
                    { label: "Drafts", value: draftCount, icon: EyeOff },
                ].map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon size={14} strokeWidth={1.5} className="text-[#64748b]" />
                            <span className="text-xs text-[#64748b]">{label}</span>
                        </div>
                        <p className="text-2xl font-semibold text-[#fafafa]">
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Posts table */}
            {posts.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                    <FileText size={32} strokeWidth={1.5} className="mx-auto mb-4 text-[#64748b]" />
                    <p className="text-sm text-[#64748b]">
                        No posts yet. Create your first post.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post: {
                        id: string;
                        title: string;
                        slug: string;
                        status: string;
                        likes: number;
                        createdAt: Date;
                        _count: { comments: number };
                    }) => (
                        <div
                            key={post.id}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 
                                hover:border-white/[0.1] transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${post.status === "published"
                                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                    : "bg-white/[0.03] border-white/[0.06] text-[#64748b]"
                                                }`}
                                        >
                                            {post.status === "published" ? (
                                                <Eye size={10} strokeWidth={1.5} />
                                            ) : (
                                                <EyeOff size={10} strokeWidth={1.5} />
                                            )}
                                            {post.status}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-[#fafafa] truncate mb-2">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-[#64748b]">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} strokeWidth={1.5} />
                                            {formatDate(post.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart size={11} strokeWidth={1.5} />
                                            {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare size={11} strokeWidth={1.5} />
                                            {post._count.comments}
                                        </span>
                                        <span className="text-[#64748b]/50">/{post.slug}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Toggle status */}
                                    <form
                                        action={async () => {
                                            "use server";
                                            await togglePostStatus(post.id, post.status);
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            title={
                                                post.status === "published"
                                                    ? "Set to Draft"
                                                    : "Publish"
                                            }
                                            className={`p-2 rounded-lg border transition-colors ${post.status === "published"
                                                    ? "border-green-500/20 text-green-400/60 hover:border-green-500/40 hover:text-green-400"
                                                    : "border-white/[0.06] text-[#64748b] hover:border-white/[0.12] hover:text-[#fafafa]"
                                                }`}
                                        >
                                            {post.status === "published" ? (
                                                <EyeOff size={14} strokeWidth={1.5} />
                                            ) : (
                                                <Eye size={14} strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </form>

                                    {/* Edit */}
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="p-2 rounded-lg border border-white/[0.06] text-[#64748b] 
                                            hover:border-white/[0.12] hover:text-[#fafafa] transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={14} strokeWidth={1.5} />
                                    </Link>

                                    {/* Delete */}
                                    <form
                                        action={async () => {
                                            "use server";
                                            await deletePost(post.id);
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            title="Delete"
                                            className="p-2 rounded-lg border border-red-500/20 text-red-400/60 
                                                hover:border-red-500/40 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} strokeWidth={1.5} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
