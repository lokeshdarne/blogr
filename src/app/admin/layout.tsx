import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <AdminSidebar />
            <main className="md:ml-56 min-h-screen">
                {children}
            </main>
        </div>
    );
}
