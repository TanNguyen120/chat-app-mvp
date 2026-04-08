// src/app/api/pusher/auth/route.ts
import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher-sever';
import { PresenceChannelData } from 'pusher'; // Import the type

export async function POST(req: Request) {
  const session = await auth();

  // 1. Guard Clause: If no user or ID, block immediately
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.formData();
  const socketId = body.get('socket_id') as string;
  const channel = body.get('channel_name') as string;

  // 2. Explicitly type the data to satisfy Pusher's requirements
  // We use the non-null assertion (!) because the guard above ensures they exist.
  const presenceData: PresenceChannelData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name || 'Anonymous',
      image: session.user.image || '',
    },
  };

  const authResponse = pusherServer.authorizeChannel(
    socketId,
    channel,
    presenceData,
  );

  return new Response(JSON.stringify(authResponse));
}
