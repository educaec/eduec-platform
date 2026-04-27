import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  providers: [Google],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id: string; role?: string }).id = String(user.id);
        (session.user as { id: string; role?: string }).role =
          (user as { role?: string }).role ?? "student";
      }
      return session;
    },
  },
});