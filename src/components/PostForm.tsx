"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PostFormProps {
    mode: "create" | "edit";
    postId?: string;
    initialTitle?: string;
    initialContent?: string;
    initialStatus?: string;
    onSubmit: (formData: FormData) => Promise<void>;
}

export default function PostForm({
    mode,
    initialTitle = "",
    initialContent = "",
    initialStatus = "draft",
    onSubmit,
}: PostFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [status, setStatus] = useState(initialStatus);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }
        setError("");

        const formData = new FormData();
        formData.set("title", title);
        formData.set("content", content);
        formData.set("status", status);

        startTransition(async () => {
            try {
                await onSubmit(formData);
                toast.success(
                    mode === "create" ? "Post created!" : "Post updated!",
                    {
                        style: {
                            background: "#0a0a0a",
                            border: "1px solid rgba(255,255,255,0.1)",
                        },
                    }
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred.");
                toast.error("Failed to save post");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-xs text-[#64748b] mb-2">
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 
                        text-base text-[#fafafa] placeholder:text-[#64748b]/50
                        focus:border-white/[0.12] transition-colors"
                    maxLength={200}
                />
            </div>

            {/* Status toggle */}
            <div>
                <label className="block text-xs text-[#64748b] mb-2">
                    Status
                </label>
                <div className="flex gap-3">
                    {(["draft", "published"] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors ${status === s
                                    ? s === "published"
                                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                                        : "bg-white/[0.05] border-white/[0.12] text-[#fafafa]"
                                    : "bg-white/[0.02] border-white/[0.06] text-[#64748b] hover:border-white/[0.1]"
                                }`}
                        >
                            {s === "published" ? (
                                <Eye size={12} strokeWidth={1.5} />
                            ) : (
                                <EyeOff size={12} strokeWidth={1.5} />
                            )}
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Markdown editor */}
            <div>
                <label className="block text-xs text-[#64748b] mb-2">
                    Content (Markdown)
                </label>
                <MarkdownEditor value={content} onChange={setContent} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                        bg-white/[0.05] border border-white/[0.06] text-[#fafafa]
                        hover:bg-white/[0.08] hover:border-white/[0.12]
                        active:scale-[0.98] transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                    ) : (
                        <Save size={14} strokeWidth={1.5} />
                    )}
                    {isPending
                        ? "Saving..."
                        : mode === "create"
                            ? "Create Post"
                            : "Update Post"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="px-4 py-2.5 rounded-lg text-sm text-[#64748b] 
                        hover:text-[#fafafa] transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
