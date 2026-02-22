import { redirect } from "next/navigation";
import { createPost } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import PostForm from "@/components/PostForm";

export default async function NewPostPage() {
    const session = await getSession();
    if (!session?.isAdmin) {
        redirect("/admin/login");
    }

    return (
        <div className="p-6 md:p-8 pt-16 md:pt-8">
            <div className="max-w-2xl">
                <h1 className="text-xl font-semibold text-[#fafafa] mb-1">
                    New Post
                </h1>
                <p className="text-sm text-[#64748b] mb-8">
                    Create a new blog post
                </p>

                <PostForm mode="create" onSubmit={createPost} />
            </div>
        </div>
    );
}
