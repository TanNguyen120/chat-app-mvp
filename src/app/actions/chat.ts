'use server';

import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher-sever';
import prisma from '@/lib/prisma';

export async function sendMessage(roomId: string, text: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // 1. Ensure the Room exists in the DB first (Upsert pattern)
  // This creates the room if it doesn't exist, otherwise returns the existing one
  await prisma.room.upsert({
    where: { id: roomId },
    update: {},
    create: {
      id: roomId,
      isGroup: false,
    },
  });

  // 2. Save the message using your schema fields (content and userId)
  const dbMessage = await prisma.message.create({
    data: {
      content: text, // Matches @db.Text in your schema
      userId: session.user.id, // Matches userId in your schema
      roomId: roomId, // Matches roomId in your schema
    },
    include: {
      user: true, // Get the user info (name, image) to send to Pusher
    },
  });

  // 3. Trigger Pusher so the other person sees it instantly
  await pusherServer.trigger(roomId, 'new-message', {
    content: text,
    senderId: session?.user?.id,
    senderName: session?.user?.name,
    senderImage: session?.user?.image,
    createdAt: new Date().toISOString(),
  });

  return dbMessage;
}

export async function getMessageHistory(roomId: string) {
  return await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
    take: 50, // Limit to last 50 messages for performance
  });
}
