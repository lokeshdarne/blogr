"use client";

import { motion, AnimatePresence, Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const pageVariants = {
    hidden: {
        opacity: 0,
        y: 12,
        filter: "blur(4px)"
    },
    enter: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)"
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: "blur(2px)"
    },
};

const springTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
};

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={pageVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={springTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Staggered container for lists
export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

// Staggered item
export const staggerItem = {
    hidden: {
        opacity: 0,
        y: 16,
        filter: "blur(2px)"
    },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        } as const,
    },
};

// Staggered List Component
export function StaggerList({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            {children}
        </motion.div>
    );
}

// Staggered Item Component
export function StaggerItem({ children }: { children: ReactNode }) {
    return (
        <motion.div variants={staggerItem}>
            {children}
        </motion.div>
    );
}
