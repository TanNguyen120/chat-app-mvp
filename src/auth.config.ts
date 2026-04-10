import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import { pusherServer } from './lib/pusher-sever';

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  events: {
    // 🚀 This fires ONLY when a new user is created in the DB
    async createUser({ user }) {
      await pusherServer.trigger('global-user-list', 'new-user', {
        id: user.id,
        name: user.name,
        image: user.image,
      });
      console.log(`✨ New Google user joined: ${user.name}`);
    },
  },
} satisfies NextAuthConfig;
