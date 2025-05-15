// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            avatar?: string;
            color?: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        avatar?: string;
        color?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        avatar?: string;
        color?: string;
    }
}
