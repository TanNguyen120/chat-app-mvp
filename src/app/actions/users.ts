'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// export async function getAllUsers() {
//   const session = await auth();
//   if (!session?.user?.id) return [];

//   // Fetch all users except yourself
//   return await prisma.user.findMany({
//     where: {
//       NOT: { id: session.user.id },
//     },
//     select: {
//       id: true,
//       name: true,
//       image: true,
//       email: true,
//     },
//   });
// }

export async function getAllUsers() {
  const session = await auth();
  const currentUserId = session?.user?.id;
  if (!currentUserId) return [];
  revalidatePath('/');
  const users = await prisma.user.findMany({
    where: { NOT: { id: currentUserId } },
    select: { id: true, name: true, image: true },
  });

  console.log('Fetched users from DB:', users);
  const usersWithLastMsg = await Promise.all(
    users.map(async (user) => {
      // Shared room ID logic (consistent with your helper)
      const sortedIds = [currentUserId, user.id].sort();
      const roomId = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

      const lastMsg = await prisma.message.findFirst({
        where: { roomId },
        orderBy: { createdAt: 'desc' },
      });

      console.log(`User ${user.name} last message:`, lastMsg?.content);
      return {
        ...user,
        lastMessage: lastMsg?.content || 'Start a conversation',
        lastMessageTime: lastMsg?.createdAt || null,
        isLastMsgMe: lastMsg?.userId === currentUserId, // Check who sent it
        currentUserId: currentUserId, // Pass currentUserId for later use in the frontend
      };
    }),
  );

  // Sort the list so people you chatted with recently are at the top
  return usersWithLastMsg.sort((a, b) => {
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return (
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
    );
  });
}
