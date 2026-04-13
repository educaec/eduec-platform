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
    session({ session, user }) {
      if (session.user) {
        session.user.id = String(user.id);
        session.user.role = user.role;
      }
      return session;
    },
  },
});