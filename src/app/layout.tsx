import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MeshGradient from "@/components/MeshGradient";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLOGR — Thoughts, Curated",
  description: "A minimal space for ideas that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-[#030303] text-[#fafafa] min-h-screen`}
      >
        <MeshGradient />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <footer className="border-t border-white/[0.06] py-8 text-center">
            <p className="text-sm text-[#64748b]">
              BLOGR © {new Date().getFullYear()}
            </p>
          </footer>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafafa",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
