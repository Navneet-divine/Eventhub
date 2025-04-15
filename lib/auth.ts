// /pages/api/auth/[...nextauth].ts
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/db";
import { compare } from "bcryptjs";



export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "name", type: "text", placeholder: "john" },
                email: { label: "email", type: "text", placeholder: "john@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const { email, password } = credentials as {
                        name: string;
                        email: string;
                        password: string;
                    };
                    await connectToDB();
                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isPasswordCorrect = await compare(password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Invalid credentials");
                    }
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    }
                } catch (error) {
                    console.log(error)
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;

            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        }
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in"
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};


