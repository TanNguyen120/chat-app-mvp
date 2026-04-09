'use client';
import { useState } from 'react';
import { sendMessage } from '@/app/actions/chat';
import { SendHorizontal } from 'lucide-react'; // Optional: for a nice icon
import { pusherServer } from '@/lib/pusher-sever';
import { useSession } from 'next-auth/react';

interface MessageInputProps {
  roomId: string;
  onMessageSent?: (content: string) => void;
}

export default function MessageInput({
  roomId,
  onMessageSent,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const session = useSession().data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = text.trim();
    if (!messageContent || isSending) return;

    if (onMessageSent) onMessageSent(messageContent);
    setText('');
    setIsSending(true);

    try {
      await sendMessage(roomId, messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    /* Matching your CSS:
       display: flex; flex-direction: row; align-items: center;
       padding-top: 8px; gap: 12px; align-self: stretch;
    */
    <form
      onSubmit={handleSubmit}
      className='flex flex-row items-center p-1 me-3 gap-3 self-stretch w-full rounded-full h-12 bg-white m-1 border-1 border-[#E8E5DF]'
    >
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type a message...'
        className='flex-1 h-10 px-4 rounded-full text-sm focus:outline-none  transition-all '
      />

      <button
        type='submit'
        disabled={!text.trim() || isSending}
        className=' flex items-center justify-center w-10 h-10 rounded-full bg-[#38C793] text-white hover:bg-[#2fb182] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shrink-0'
      >
        <SendHorizontal
          size={18}
          className={isSending ? 'animate-pulse' : ''}
        />
      </button>
    </form>
  );
}
