import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  senderName: string | null;
  senderImage: string | null;
  createdAt: Date;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <div
      className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex max-w-[75%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        {!isMe && (
          <div className='flex-shrink-0 mt-1'>
            <Image
              src={message.senderImage || '/default-avatar.png'}
              alt={message.senderName || 'User'}
              width={32}
              height={32}
              className='rounded-full border border-slate-100'
            />
          </div>
        )}

        {/* Bubble Content */}
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
              isMe
                ? 'bg-[#38C793] text-white rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
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
