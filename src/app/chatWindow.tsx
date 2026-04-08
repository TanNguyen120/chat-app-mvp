// ChatWindow.tsx
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
// 1. The data structure for a single user (matches your metadata in auth/route.ts)
interface UserInfo {
  name: string;
  image: string;
}

// 2. The standard structure of a Pusher Presence Member
interface PresenceMember {
  id: string;
  info: UserInfo;
}

// 3. The object returned by 'pusher:subscription_succeeded'
interface PresenceMembers {
  count: number;
  each: (callback: (member: PresenceMember) => void) => void;
  me: PresenceMember;
  get: (id: string) => PresenceMember | null;
}
export function ChatWindow({
  roomId,
  selectedUser,
}: {
  roomId: string;
  selectedUser: PresenceMember;
}) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // 1. Subscribe to the private room
    const channel = pusherClient.subscribe(roomId);

    // 2. Listen for incoming messages
    channel.bind('new-message', (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusherClient.unsubscribe(roomId);
    };
  }, [roomId]);

  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-b font-bold'>
        Chatting with {selectedUser.info.name}
      </div>
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.map((m, i) => (
          <div key={i}>{m.text}</div>
        ))}
      </div>
      {/* Input component goes here */}
    </div>
  );
}
