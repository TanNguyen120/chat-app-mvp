'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import {
  MessageCircle,
  Search,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react';

const TopBar = () => {
  // 1. Hook into the NextAuth session
  const { data: session } = useSession();

  return (
    <header className='flex flex-col items-start px-6 py-3 gap-[24px] w-full max-w-[1340px] h-[56px] bg-white rounded-[16px] self-stretch flex-none z-0 font-sans shadow-sm'>
      <div className='flex flex-row justify-between items-center w-full h-[32px] self-stretch flex-none gap-[9px]'>
        {/* page-label */}
        <div className='flex flex-row items-start gap-2 h-[20px] flex-none'>
          <MessageCircle
            strokeWidth={1.875}
            className='w-5 h-5 text-[#596881]'
          />
          <span className='text-[14px] font-medium leading-[20px] tracking-[-0.006em] text-[#111625]'>
            {/* Dynamic Welcome Greeting */}
            {session?.user?.name
              ? `Welcome, ${session.user.name.split(' ')[0]}!`
              : 'Greeting'}
          </span>
        </div>

        {/* right-column */}
        <div className='flex flex-row items-center gap-4 h-[32px] flex-none'>
          <div className='flex flex-row items-center gap-3 w-[388px] h-[32px] flex-none'>
            {/* search-form */}
            <div className='box-border flex flex-row items-center pl-[10px] pr-[4px] py-[10px] gap-2 w-[300px] h-[32px] border border-[#E8E5DF] rounded-[10px] flex-none'>
              <Search
                strokeWidth={1.5}
                className='w-3.5 h-3.5 text-[#8796AF]'
              />
              <div className='flex flex-row items-center gap-[10px] w-[264px] h-[24px] flex-1'>
                <span className='flex-1 text-[12px] leading-[16px] text-[#8796AF]'>
                  Search
                </span>
                <div className='flex flex-row items-center px-1.5 py-[5px] gap-1 w-[40px] h-[24px] bg-[#F3F3EE] rounded-[6px] flex-none'>
                  <span className='text-[12px] leading-[16px] text-[#404040]'>
                    ⌘+K
                  </span>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className='flex flex-row gap-3'>
              <button className='flex justify-center items-center w-8 h-8 bg-white border border-[#E8E5DF] rounded-[8px] flex-none transition-colors hover:bg-slate-50'>
                <Bell strokeWidth={1.5} className='w-4 h-4 text-[#262626]' />
              </button>
              <button className='flex justify-center items-center w-8 h-8 bg-white border border-[#E8E5DF] rounded-[8px] flex-none transition-colors hover:bg-slate-50'>
                <Settings
                  strokeWidth={1.5}
                  className='w-4 h-4 text-[#262626]'
                />
              </button>
            </div>
          </div>

          <div className='w-0 h-[20px] border border-[#E8E5DF] flex-none' />

          {/* DYNAMIC: profile-container (Google Image) */}
          <div className='flex flex-row items-center gap-2 w-[56px] h-[32px] flex-none cursor-pointer group'>
            <div className='w-8 h-8 bg-[#F7F9FB] rounded-full flex-none overflow-hidden relative border border-slate-100 group-hover:border-[#1E9A80] transition-colors'>
              {/* Image from Google Session */}
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className='object-cover w-full h-full'
                  referrerPolicy='no-referrer' // Helps load Google images correctly
                />
              ) : (
                // Fallback if no image (shows first initial)
                <div className='absolute inset-0 bg-[#F7F9FB] flex items-center justify-center font-bold text-sm text-[#1E9A80]'>
                  {session?.user?.name?.[0].toUpperCase() || '?'}
                </div>
              )}
            </div>
            <ChevronDown
              strokeWidth={2}
              className='w-4 h-4 text-[#262626] flex-none'
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
