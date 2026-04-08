// ChatWindow.tsx
import { useEffect, useRef, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import MessageBubble from '@/messageBubble';
import { getMessageHistory } from './actions/chat';
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
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!roomId || !pusherClient) return;

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getMessageHistory(roomId);
        // Map Prisma data to our UI format
        const formatted = history.map((m) => ({
          id: m.id,
          content: m.content,
          senderId: m.userId,
          senderName: m.user.name,
          senderImage: m.user.image,
          createdAt: m.createdAt,
        }));
        setMessages(formatted);
        console.log('Loaded history for room', roomId, formatted);
      } catch (error) {
        console.error('History load error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    // Subscribe to real-time messages
    const channel = pusherClient.subscribe(roomId);

    channel.bind('new-message', (data: any) => {
      setMessages((prev) => {
        // Prevent duplicate if sender already added locally
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      pusherClient.unsubscribe(roomId);
      channel.unbind_all();
    };
  }, [roomId]); // Reloads everything when the room changes

  return (
    <div className='flex flex-col h-full max-h-[calc(100vh-220px)] bg-white'>
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'
      >
        {isLoading && <div>Loading messages...</div>}
        {!isLoading && messages.length === 0 && (
          <div>No messages yet. Say hi!</div>
        )}
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            message={m}
            isMe={m.senderId === selectedUser.id}
          />
        ))}
      </div>
      {/* Input component goes here */}
    </div>
  );
}
