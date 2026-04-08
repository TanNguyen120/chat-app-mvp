'use server';
import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher-sever';
import prisma from '@/lib/prisma';

export async function sendMessage(roomId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // 1. Save to Supabase (Prisma 7)
  const message = await prisma.message.create({
    data: {
      content: text,
      roomId,
      userId: session.user.id,
    },
    include: { user: true }, // Include user info for the UI
  });

  // 2. Broadcast to Pusher Presence Channel
  await pusherServer.trigger(`presence-${roomId}`, 'new-message', message);

  return message;
}
