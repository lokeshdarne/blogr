import { redirect, notFound } from "next/navigation";
import { updatePost } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PostForm from "@/components/PostForm";

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const session = await getSession();
    if (!session?.isAdmin) {
        redirect("/admin/login");
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="p-6 md:p-8 pt-16 md:pt-8">
            <div className="max-w-2xl">
                <h1 className="text-xl font-semibold text-[#fafafa] mb-1">
                    Edit Post
                </h1>
                <p className="text-sm text-[#64748b] mb-8">
                    Update the post content
                </p>

                <PostForm
                    mode="edit"
                    postId={post.id}
                    initialTitle={post.title}
                    initialContent={post.content}
                    initialStatus={post.status}
                    onSubmit={async (formData: FormData) => {
                        "use server";
                        await updatePost(post.id, formData);
                    }}
                />
            </div>
        </div>
    );
}
