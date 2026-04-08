'use client';

import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '@/app/actions/chat';
import { Send } from 'lucide-react';
import { pusherClient } from '@/lib/pusher-client';

export default function ChatInterface({
  roomId,
  initialMessages,
  currentUserId,
}: {
  roomId: string;
  initialMessages: any[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = pusherClient.subscribe(`presence-${roomId}`);
    channel.bind('new-message', (newMessage: any) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      pusherClient.unsubscribe(`presence-${roomId}`);
    };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await sendMessage(roomId, text);
  };

  return (
    <div className='flex flex-col h-[80vh] w-full max-w-4xl mx-auto bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden'>
      <div className='flex-1 overflow-y-auto p-6 space-y-4'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                msg.userId === currentUserId
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
              }`}
            >
              <p className='text-sm opacity-50 mb-1 font-medium'>
                {msg.user?.name || 'User'}
              </p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={handleSend}
        className='p-4 bg-slate-950/50 border-t border-white/10 flex gap-2'
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />
        <button
          type='submit'
          className='bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl text-white transition-all active:scale-90'
        >
          <Send className='w-5 h-5' strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
}
