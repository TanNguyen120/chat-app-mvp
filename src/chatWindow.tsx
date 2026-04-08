'use client';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { getMessageHistory } from '@/app/actions/chat';
import MessageBubble from './messageBubble';

export default function ChatWindow({
  activeRoom,
  currentUserId,
}: {
  activeRoom: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeRoom) return;

    // 1. Fetch History from DB
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getMessageHistory(activeRoom);
        console.log('Loaded history for room', activeRoom, history);
        // Map DB fields to match your local message state
        const formattedHistory = history.map((m) => ({
          id: m.id,
          content: m.content,
          senderId: m.userId,
          senderName: m.user.name,
          senderImage: m.user.image,
          createdAt: m.createdAt,
        }));
        setMessages(formattedHistory);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    // 2. Subscribe to REAL-TIME updates
    const channel = pusherClient.subscribe(activeRoom);

    channel.bind('new-message', (newMessage: any) => {
      setMessages((prev) => {
        // Simple check to avoid duplicate messages if the sender also added it locally
        if (prev.find((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    // 3. Cleanup: Unsubscribe when room changes or component unmounts
    return () => {
      pusherClient.unsubscribe(activeRoom);
      channel.unbind_all();
    };
  }, [activeRoom]); // <--- This ensures history reloads when you click a new user

  if (isLoading)
    return (
      <div className='flex-1 flex items-center justify-center'>
        Loading history...
      </div>
    );

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          isMe={m.senderId === currentUserId}
        />
      ))}
    </div>
  );
}
