import React from 'react';
import {
  MessageSquare,
  Archive,
  VolumeX,
  Info,
  Upload,
  XCircle,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export default function ChatActionModal() {
  return (
    <div className='w-[280px] bg-white/80 backdrop-blur-xl border border-[#E8E5DF] rounded-[24px] shadow-2xl shadow-black/5 overflow-hidden p-2 font-sans'>
      {/* Mark as Unread */}
      <button className='w-full flex items-center gap-3 p-3 hover:bg-[#F7F9FB] rounded-xl transition-colors group'>
        <MessageSquare className='w-5 h-5 text-[#111625] group-hover:text-[#1E9A80]' />
        <span className='text-sm font-medium text-[#111625]'>
          Mark as unread
        </span>
      </button>

      {/* Archive */}
      <button className='w-full flex items-center gap-3 p-3 hover:bg-[#F7F9FB] rounded-xl transition-colors group'>
        <Archive className='w-5 h-5 text-[#111625] group-hover:text-[#1E9A80]' />
        <span className='text-sm font-medium text-[#111625]'>Archive</span>
      </button>

      {/* Mute (with sub-menu arrow) */}
      <button className='w-full flex items-center justify-between p-3 hover:bg-[#F7F9FB] rounded-xl transition-colors group'>
        <div className='flex items-center gap-3'>
          <VolumeX className='w-5 h-5 text-[#111625] group-hover:text-[#1E9A80]' />
          <span className='text-sm font-medium text-[#111625]'>Mute</span>
        </div>
        <ChevronRight className='w-4 h-4 text-[#8796AF]' />
      </button>

      <div className='h-[1px] bg-[#E8E5DF] my-2 mx-2' />

      {/* Contact Info */}
      <button className='w-full flex items-center gap-3 p-3 hover:bg-[#F7F9FB] rounded-xl transition-colors group'>
        <Info className='w-5 h-5 text-[#111625] group-hover:text-[#1E9A80]' />
        <span className='text-sm font-medium text-[#111625]'>Contact info</span>
      </button>

      {/* Export Chat */}
      <button className='w-full flex items-center gap-3 p-3 hover:bg-[#F7F9FB] rounded-xl transition-colors group'>
        <Upload className='w-5 h-5 text-[#111625] group-hover:text-[#1E9A80]' />
        <span className='text-sm font-medium text-[#111625]'>Export chat</span>
      </button>

      <div className='h-[1px] bg-[#E8E5DF] my-2 mx-2' />

      {/* Clear Chat */}
      <button className='w-full flex items-center gap-3 p-3 hover:bg-[#F7F9FB] rounded-xl transition-colors group'>
        <XCircle className='w-5 h-5 text-[#111625] group-hover:text-red-500' />
        <span className='text-sm font-medium text-[#111625]'>Clear chat</span>
      </button>

      {/* Delete Chat */}
      <button className='w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors group'>
        <Trash2 className='w-5 h-5 text-red-500' />
        <span className='text-sm font-medium text-red-500'>Delete chat</span>
      </button>
    </div>
  );
}
