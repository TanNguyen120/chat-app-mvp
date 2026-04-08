import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import ChatInterface from '@/components/ChatInterface';
import { notFound, redirect } from 'next/navigation';

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const room = await prisma.room.findUnique({
    where: { id: params.roomId },
    include: {
      messages: {
        take: 50,
        orderBy: { createdAt: 'asc' },
        include: { user: true },
      },
    },
  });

  if (!room) notFound();

  return (
    <div className='min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center'>
      <h1 className='text-2xl font-bold text-white mb-8 italic'>
        # {room.name}
      </h1>
      <ChatInterface
        roomId={room.id}
        initialMessages={room.messages}
        currentUserId={session.user.id}
      />
    </div>
  );
}
