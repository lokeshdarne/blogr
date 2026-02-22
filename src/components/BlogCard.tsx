import Link from "next/link";
import { Calendar, Heart, MessageSquare, ArrowUpRight } from "lucide-react";

interface BlogCardProps {
    id: string;
    title: string;
    slug: string;
    content: string;
    likes: number;
    commentCount: number;
    createdAt: Date;
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

function getExcerpt(content: string, maxLength = 120) {
    // Strip markdown syntax for excerpt
    const stripped = content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim();
    return stripped.length > maxLength
        ? stripped.slice(0, maxLength) + "..."
        : stripped;
}

export default function BlogCard({
    title,
    slug,
    content,
    likes,
    commentCount,
    createdAt,
}: BlogCardProps) {
    return (
        <Link href={`/blog/${slug}`} className="group block h-full">
            <article
                className="h-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-6
                    transition-all duration-200 ease-out
                    hover:border-white/[0.12] hover:bg-white/[0.04]
                    hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
            >
                {/* Title */}
                <h2
                    className="text-lg font-semibold text-[#fafafa] leading-snug mb-3
                        group-hover:text-white transition-colors"
                >
                    {title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-[#94a3b8] leading-relaxed mb-6 line-clamp-3">
                    {getExcerpt(content)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-4 text-xs text-[#64748b]">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={12} strokeWidth={1.5} />
                            {formatDate(createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Heart size={12} strokeWidth={1.5} />
                            {likes}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MessageSquare size={12} strokeWidth={1.5} />
                            {commentCount}
                        </span>
                    </div>
                    <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                        className="text-[#64748b] group-hover:text-[#a1a1aa] 
                            group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                            transition-all duration-200"
                    />
                </div>
            </article>
        </Link>
    );
}
