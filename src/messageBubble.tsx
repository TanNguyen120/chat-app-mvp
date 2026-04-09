import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderImage: string | null;
  createdAt: Date;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
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
            {message.content}
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
