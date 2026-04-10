import Image from 'next/image';
import { ImageDisplay } from './app/imageDisplay';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderImage: string | null;
  createdAt: Date;
  type?: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO';
  imageUrl?: string; // For IMAGE, FILE, VIDEO types
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

function showMessageContent(message: Message) {
  console.log('Rendering message content for message:', message);
  switch (message.type) {
    case 'IMAGE':
      return (
        <>
          <ImageDisplay src={message.imageUrl || ''} />
          {message.content && <p className='text-sm mt-1'>{message.content}</p>}
        </>
      );
    case 'FILE':
      return <div>Not support yet</div>;
    case 'VIDEO':
      return <div>Not support yet</div>;
    default:
      return <p className='text-sm'>{message.content}</p>;
  }
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const aiSrc = 'https://api.dicebear.com/7.x/bottts/svg?seed=QuickTalk';
  return (
    <div
      className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex max-w-[75%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        {!isMe && (
          <div className='flex-shrink-0 mt-1 relative'>
            <Image
              src={message.senderImage || aiSrc}
              alt={message.senderName || 'User'}
              width={32}
              height={32}
              className='rounded-full border border-slate-100'
              unoptimized
            />
            {message.senderId === 'AI_ASSISTANT' && (
              <div className='absolute -top-1 -right-1 bg-gradient-to-tr from-[#1E9A80] to-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white'>
                AI
              </div>
            )}
          </div>
        )}

        {/* Bubble Content */}
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2.5 rounded-[20px] text-sm shadow-sm ${
              isMe
                ? 'bg-[#F0FDF4] text-[#111625]'
                : 'bg-white border border-[#E8E5DF] text-[#111625]'
            }`}
          >
            {showMessageContent(message)}
          </div>

          {/* Timestamp */}
          <span className='text-[10px] text-slate-400 mt-1 px-1'>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
