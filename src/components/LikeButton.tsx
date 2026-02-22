"use client";

import { useOptimistic, useTransition, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { incrementLike } from "@/lib/actions";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        initialLikes,
        (state: number) => state + 1
    );
    const [isPending, startTransition] = useTransition();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Magnetic effect - move button slightly towards cursor
        const magneticStrength = 0.15;
        setPosition({
            x: distanceX * magneticStrength,
            y: distanceY * magneticStrength,
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const triggerConfetti = () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 20,
            spread: 60,
            origin: { x, y },
            colors: ["#a1a1aa", "#94a3b8", "#64748b"],
            shapes: ["circle"],
            scalar: 0.8,
            gravity: 0.8,
            drift: 0,
            ticks: 50,
        });
    };

    const handleLike = () => {
        triggerConfetti();
        toast.success("Post liked!", {
            icon: "♥",
            style: {
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
            },
        });

        startTransition(async () => {
            addOptimisticLike(undefined);
            await incrementLike(postId);
        });
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleLike}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            disabled={isPending}
            className="group flex items-center gap-2 px-4 py-2 rounded-full 
                border border-white/[0.06] bg-white/[0.02]
                text-[#94a3b8] text-sm font-medium
                hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-[#fafafa]
                active:scale-95 transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            aria-label={`Like this post. Current likes: ${optimisticLikes}`}
        >
            <Heart
                size={14}
                strokeWidth={1.5}
                className={`transition-all duration-200 ${isPending
                        ? "fill-[#a1a1aa] text-[#a1a1aa] scale-110"
                        : "group-hover:fill-[#a1a1aa] group-hover:text-[#a1a1aa]"
                    }`}
            />
            <span>{optimisticLikes}</span>
        </button>
    );
}
