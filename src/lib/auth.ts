import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
    isAdmin: boolean;
}

const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "blogr_admin_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
        maxAge: 60 * 60 * 24, // 24 hours
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    return session;
}
