"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    FileText,
    Plus,
    Home,
    LogOut,
    Menu,
    X,
    LayoutDashboard
} from "lucide-react";
import { logoutAction } from "@/lib/actions";

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts/new", label: "New Post", icon: Plus },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg border border-white/[0.06] bg-[#0a0a0a] md:hidden"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-56 bg-[#0a0a0a] border-r border-white/[0.06] z-40
                    transform transition-transform duration-200 ease-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0`}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-3 py-4 mb-4">
                        <FileText size={18} strokeWidth={1.5} className="text-[#64748b]" />
                        <span className="text-sm font-medium text-[#fafafa]">Admin</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                            ? "bg-white/[0.05] text-[#fafafa]"
                                            : "text-[#64748b] hover:text-[#fafafa] hover:bg-white/[0.02]"
                                        }`}
                                >
                                    <Icon size={16} strokeWidth={1.5} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="border-t border-white/[0.06] pt-4 space-y-1">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#64748b] hover:text-[#fafafa] hover:bg-white/[0.02] transition-colors"
                        >
                            <Home size={16} strokeWidth={1.5} />
                            View Site
                        </Link>

                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#64748b] hover:text-[#fafafa] hover:bg-white/[0.02] transition-colors"
                            >
                                <LogOut size={16} strokeWidth={1.5} />
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}
