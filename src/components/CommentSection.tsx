"use client";

import { useState, useTransition } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { addComment } from "@/lib/actions";
import { toast } from "sonner";

interface Comment {
    id: string;
    userName: string;
    content: string;
    createdAt: Date;
}

interface CommentSectionProps {
    postId: string;
    initialComments: Comment[];
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

export default function CommentSection({
    postId,
    initialComments,
}: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [userName, setUserName] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim() || !content.trim()) {
            setError("Both name and comment are required.");
            return;
        }
        setError("");

        const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            userName: userName.trim(),
            content: content.trim(),
            createdAt: new Date(),
        };

        setComments((prev) => [...prev, optimisticComment]);
        const savedName = userName.trim();
        const savedContent = content.trim();
        setUserName("");
        setContent("");

        toast.success("Comment posted!", {
            style: {
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
            },
        });

        startTransition(async () => {
            try {
                await addComment(postId, savedName, savedContent);
            } catch {
                // Revert optimistic update on error
                setComments((prev) =>
                    prev.filter((c) => c.id !== optimisticComment.id)
                );
                setError("Failed to post comment. Please try again.");
                toast.error("Failed to post comment");
            }
        });
    };

    return (
        <section>
            <h2 className="text-lg font-semibold text-[#fafafa] mb-6 flex items-center gap-2">
                <MessageSquare size={18} strokeWidth={1.5} className="text-[#64748b]" />
                Comments
                <span className="text-sm font-normal text-[#64748b] ml-1">
                    {comments.length}
                </span>
            </h2>

            {/* Comment list */}
            <div className="space-y-4 mb-8">
                {comments.length === 0 ? (
                    <p className="text-sm text-[#64748b] py-8 text-center border border-dashed border-white/[0.06] rounded-lg">
                        No comments yet. Be the first to comment.
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 
                                hover:border-white/[0.1] transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
                                    <User size={12} strokeWidth={1.5} className="text-[#64748b]" />
                                </div>
                                <span className="text-sm font-medium text-[#fafafa]">
                                    {comment.userName}
                                </span>
                                <span className="text-xs text-[#64748b] ml-auto">
                                    {formatDate(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-[#94a3b8] leading-relaxed pl-9">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Comment form */}
            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4"
            >
                <h3 className="text-sm text-[#64748b]">
                    Post a comment
                </h3>

                {error && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div>
                    <label className="block text-xs text-[#64748b] mb-1.5">
                        Name
                    </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 
                            text-sm text-[#fafafa] placeholder:text-[#64748b]/50
                            focus:border-white/[0.12] transition-colors"
                        maxLength={50}
                    />
                </div>

                <div>
                    <label className="block text-xs text-[#64748b] mb-1.5">
                        Comment
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your comment..."
                        rows={4}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 
                            text-sm text-[#fafafa] placeholder:text-[#64748b]/50 resize-none
                            focus:border-white/[0.12] transition-colors"
                        maxLength={1000}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                        bg-white/[0.05] border border-white/[0.06] text-[#fafafa]
                        hover:bg-white/[0.08] hover:border-white/[0.12]
                        active:scale-95 transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={14} strokeWidth={1.5} />
                    {isPending ? "Posting..." : "Post Comment"}
                </button>
            </form>
        </section>
    );
}
