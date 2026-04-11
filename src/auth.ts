import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import authConfig from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // JWT is fastest for MVPs
  ...authConfig,
  providers: [
    ...authConfig.providers,
    // You can add more providers here (e.g., GitHub, Twitter) if you want
    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // 1. Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // 2. If no user found or user was created via Google (no password)
        if (!user || !user.password) {
          return null;
        }

        // 3. Compare hashed password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    // Add User ID to the session object so you can use it in Chat
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
