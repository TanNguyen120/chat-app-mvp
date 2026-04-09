// src/components/ThinkingIndicator.tsx
import { Bot } from 'lucide-react';

export const ThinkingIndicator = () => {
  return (
    <div className='flex justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300'>
      <div className='flex items-start gap-3 max-w-[80%]'>
        {/* AI Icon with Pulse */}
        <div className='w-8 h-8 rounded-full bg-[#1E9A80]/10 flex items-center justify-center border border-[#1E9A80]/20 shrink-0'>
          <div className='relative'>
            <Bot size={16} className='text-[#1E9A80]' />
            <div className='absolute inset-0 bg-[#1E9A80] rounded-full animate-ping opacity-20' />
          </div>
        </div>

        {/* The Thinking Bubble */}
        <div className='bg-white border border-[#E8E5DF] p-4 rounded-2xl rounded-tl-none shadow-sm shadow-black/5'>
          <div className='flex gap-1.5 items-center h-5'>
            <span className='w-1.5 h-1.5 bg-[#1E9A80] rounded-full animate-bounce [animation-delay:-0.3s]' />
            <span className='w-1.5 h-1.5 bg-[#1E9A80] rounded-full animate-bounce [animation-delay:-0.15s]' />
            <span className='w-1.5 h-1.5 bg-[#1E9A80] rounded-full animate-bounce' />
            <span className='text-[11px] font-semibold text-[#8796AF] ml-2 uppercase tracking-wider'>
              Thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
