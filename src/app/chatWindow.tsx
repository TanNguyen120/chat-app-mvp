// ChatWindow.tsx
import { useEffect, useRef, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import MessageBubble from '@/messageBubble';
import { getMessageHistory } from './actions/chat';
import { Message } from '@/generated/client/browser';
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
  messages,
  setMessages,
  currentUserId,
}: {
  roomId: string;
  selectedUser: PresenceMember;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  currentUserId: string;
}) {
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

    channel.bind('new-message', (incomingMsg: any) => {
      setMessages((prev) => {
        // If we already have this message (matched by ID from DB), don't add it again
        const exists = prev.find((m) => m.id === incomingMsg.id);
        if (exists) return prev;

        // Map incoming message fields to our UI format
        const formattedMsg = {
          id: incomingMsg.id,
          content: incomingMsg.content,
          senderId: incomingMsg.userId || incomingMsg.senderId,
          senderName: incomingMsg.user?.name || incomingMsg.senderName,
          senderImage: incomingMsg.user?.image || incomingMsg.senderImage,
          createdAt: incomingMsg.createdAt,
        };

        // Deduplication Logic for Optimistic Updates:
        // If this message was sent by the current user, look for the "temp" version in the state
        if (formattedMsg.senderId === currentUserId) {
          const tempIndex = prev.findIndex(
            (m) =>
              m.id.toString().startsWith('temp-') &&
              m.content === formattedMsg.content,
          );

          // If we find the optimistic message, replace it with the official one from the server
          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = formattedMsg;
            return updated;
          }
        }

        return [...prev, formattedMsg];
      });
    });

    return () => {
      pusherClient.unsubscribe(roomId);
      channel.unbind_all();
    };
  }, [roomId]); // Reloads everything when the room changes

  return (
    <div className='flex flex-col h-full min-h-0 bg-transparent'>
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'
      >
        {isLoading && <div>Loading messages...</div>}
        {!isLoading && messages.length === 0 && (
          <div>No messages yet. Say hi!</div>
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            isMe={m.senderId === currentUserId}
          />
        ))}
      </div>
      {/* Input component goes here */}
    </div>
  );
}
