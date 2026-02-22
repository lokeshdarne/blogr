"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// ─── Public Actions ────────────────────────────────────────────────────────

export async function incrementLike(postId: string) {
    await prisma.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
    });
    revalidatePath(`/blog/[slug]`, "page");
}

export async function addComment(
    postId: string,
    userName: string,
    content: string
) {
    if (!userName.trim() || !content.trim()) {
        throw new Error("Name and content are required.");
    }
    await prisma.comment.create({
        data: {
            postId,
            userName: userName.trim().slice(0, 50),
            content: content.trim().slice(0, 1000),
        },
    });
    revalidatePath(`/blog/[slug]`, "page");
}

// ─── Admin Actions ─────────────────────────────────────────────────────────

async function requireAdmin() {
    const session = await getSession();
    if (!session.isAdmin) {
        redirect("/admin/login");
    }
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        .slice(0, 80);
}

export async function createPost(formData: FormData) {
    await requireAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string;

    if (!title?.trim() || !content?.trim()) {
        throw new Error("Title and content are required.");
    }

    let slug = generateSlug(title);

    // Ensure slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
        slug = `${slug}-${Date.now()}`;
    }

    await prisma.post.create({
        data: {
            title: title.trim(),
            content: content.trim(),
            slug,
            status: status === "published" ? "published" : "draft",
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
}

export async function updatePost(id: string, formData: FormData) {
    await requireAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string;

    if (!title?.trim() || !content?.trim()) {
        throw new Error("Title and content are required.");
    }

    await prisma.post.update({
        where: { id },
        data: {
            title: title.trim(),
            content: content.trim(),
            status: status === "published" ? "published" : "draft",
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
}

export async function deletePost(id: string) {
    await requireAdmin();

    await prisma.post.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin");
}

export async function togglePostStatus(id: string, currentStatus: string) {
    await requireAdmin();

    const newStatus = currentStatus === "published" ? "draft" : "published";

    await prisma.post.update({
        where: { id },
        data: { status: newStatus },
    });

    revalidatePath("/");
    revalidatePath("/admin");
}

// ─── Auth Actions ──────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
    const password = formData.get("password") as string;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!password || password !== adminPassword) {
        return { error: "ACCESS DENIED: Invalid credentials." };
    }

    const session = await getSession();
    session.isAdmin = true;
    await session.save();

    redirect("/admin");
}

export async function logoutAction() {
    const session = await getSession();
    session.destroy();
    redirect("/admin/login");
}
