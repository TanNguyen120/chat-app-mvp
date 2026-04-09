'use client';
import { useEffect, useRef, useState } from 'react';
import { sendMessage } from '@/app/actions/chat';
import { Mic, Paperclip, SendHorizontal, Smile } from 'lucide-react'; // Optional: for a nice icon
import { pusherServer } from '@/lib/pusher-sever';
import { useSession } from 'next-auth/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { chatWithAI } from './actions/ai';

interface MessageInputProps {
  roomId: string;
  onMessageSent?: (content: string) => void;
  userId: string;
  setThinking?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MessageInput({
  roomId,
  onMessageSent,
  userId,
  setThinking,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = text.trim();
    if (!messageContent || isSending) return;

    if (onMessageSent) onMessageSent(messageContent);
    setText('');
    setIsSending(true);

    try {
      console.log(
        'Submitting message from user:',
        userId,
        'Content:',
        messageContent,
      );
      if (userId === 'AI_ASSISTANT') {
        if (setThinking) {
          setThinking(true);
        }
        // Call the AI action
        console.log('Sending message to AI:');
        await chatWithAI(roomId, messageContent);
      } else {
        // Call your normal sendMessage action
        await sendMessage(roomId, messageContent);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      if (userId === 'AI_ASSISTANT' && setThinking) {
        setThinking(false);
      }
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

      {showEmoji && (
        <div
          ref={pickerRef}
          className='absolute bottom-16 right-4 z-50 shadow-2xl border rounded-2xl overflow-hidden'
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={Theme.LIGHT}
            lazyLoadEmojis={true}
            searchPlaceholder='Search emoji...'
            width={350}
            height={400}
          />
        </div>
      )}
      <Mic size={18} className=' cursor-pointer fw-bold' />
      <Smile
        size={20}
        className=' cursor-pointer hover:text-[#1E9A80] transition-colors'
        onClick={() => setShowEmoji(!showEmoji)}
      />
      <Paperclip size={18} className=' cursor-pointer fw-bold' />

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
