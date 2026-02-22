"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/admin", label: "Admin", icon: Lock },
    ];

    return (
        <nav className="floating-dock">
            <div className="flex items-center gap-1">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/[0.05] transition-colors"
                >
                    <Zap size={18} className="text-[#a1a1aa]" />
                    <span className="text-sm font-medium text-[#fafafa] hidden sm:inline">
                        BLOGR
                    </span>
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-white/[0.1] mx-1" />

                {/* Nav Links */}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${isActive
                                ? "text-[#fafafa]"
                                : "text-[#64748b] hover:text-[#fafafa] hover:bg-white/[0.05]"
                                }`}
                        >
                            <Icon size={16} strokeWidth={1.5} />
                            <span className="text-sm hidden sm:inline">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 rounded-full bg-white/[0.1] -z-10"
                                    transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
