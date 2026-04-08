import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import authConfig from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // JWT is fastest for MVPs
  ...authConfig,
  callbacks: {
    // Add User ID to the session object so you can use it in Chat
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id) return;

      // 1. Ensure the 'Global' room exists
      const globalRoom = await prisma.room.upsert({
        where: { id: 'global-chat' }, // Giving it a fixed ID makes it easy to find
        update: {},
        create: {
          id: 'global-chat',
          name: 'Global Discussion',
        },
      });

      // 2. Add the user to the room (connectOrCreate to avoid duplicates)
      await prisma.room.update({
        where: { id: 'global-chat' },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      });

      console.log(`User ${user.name} auto-joined Global Chat`);
    },
  },
});
