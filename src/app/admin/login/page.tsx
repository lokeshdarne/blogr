"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/actions";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError("");

        startTransition(async () => {
            const result = await loginAction(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-24">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/[0.06] bg-white/[0.02] mb-4">
                        <Lock size={18} strokeWidth={1.5} className="text-[#64748b]" />
                    </div>
                    <h1 className="text-xl font-semibold text-[#fafafa] mb-1">
                        Admin Access
                    </h1>
                    <p className="text-sm text-[#64748b]">
                        Enter your password to continue
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5"
                >
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                            <AlertCircle size={14} strokeWidth={1.5} className="text-red-400 shrink-0" />
                            <p className="text-xs text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-[#64748b] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••••••"
                            required
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 
                                text-sm text-[#fafafa] placeholder:text-[#64748b]/50
                                focus:border-white/[0.12] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
                            bg-white/[0.05] border border-white/[0.06] text-[#fafafa]
                            hover:bg-white/[0.08] hover:border-white/[0.12]
                            active:scale-[0.98] transition-all duration-150
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Authenticating..." : "Authenticate"}
                    </button>
                </form>

                <p className="text-center text-xs text-[#64748b]/50 mt-6">
                    BLOGR Admin
                </p>
            </div>
        </div>
    );
}
