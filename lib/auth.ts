import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.users.findUnique({
                    where: {
                        email: credentials.email
                    },
                });

                if (!user || !user.Hashpassword) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.Hashpassword
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.DisplayName,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {

        async signIn({ user, account }) {
            if (account?.provider !== "google") return true;

            const email = user.email;
            if (!email) return false;

            const existing = await prisma.users.findUnique({
                where: {
                    email
                },
                select: {
                    id: true
                },
            });

            if (existing) return false;

            if (!existing) {
                const emailLocal = (email.split("@")[0] || "user")
                    .toLowerCase()
                    .replace(/[\s.]+/g, "_")
                    .replace(/[^a-z0-9_]/g, "");

                const min = 100;
                const max = 999;

                const makeUsername = () => {
                    const n = Math.floor(Math.random() * (max - min + 1)) + min;
                    const suffix = `_${n}`;
                    const base = (emailLocal || "user").slice(0, 20 - suffix.length);
                    return `${base}${suffix}`;
                };

                const createUser = async (uname: string) => {
                    return prisma.users.create({
                        data: {
                            email,
                            username: uname,
                            DisplayName: uname,
                            role: "User"
                        },
                    });
                };

                try {
                    const u1 = makeUsername();
                    await createUser(u1);
                } catch (err: any) {
                    if (err?.code === "P2002") {
                        const u2 = makeUsername();
                        await createUser(u2);
                    } else {
                        throw err;
                    }
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
            }

            if (token.email && (!token.id || !token.role)) {
                const dbUser = await prisma.users.findUnique({
                    where: {
                        email: token.email as string
                    },
                    select: {
                        id: true,
                        role: true
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user){
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
};