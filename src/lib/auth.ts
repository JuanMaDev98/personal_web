import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/es/hub/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, banned: true },
        });
        (session.user as any).id = user.id;
        (session.user as any).role = dbUser?.role ?? 'USER';
        (session.user as any).banned = dbUser?.banned ?? false;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.email) return false;
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true, banned: true },
      });
      // Solo permitimos acceso a EDITOR u OWNER
      if (!existing || existing.banned) return false;
      return existing.role === 'OWNER' || existing.role === 'EDITOR';
    },
  },
  session: { strategy: 'database' },
  trustHost: true,
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'USER' | 'EDITOR' | 'OWNER';
      banned?: boolean;
    };
  }
}
