import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/auth";

const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "blogr_admin_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
    },
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page through
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Protect all /admin/* routes
    if (pathname.startsWith("/admin")) {
        const response = NextResponse.next();
        const session = await getIronSession<SessionData>(
            request,
            response,
            sessionOptions
        );

        if (!session.isAdmin) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
