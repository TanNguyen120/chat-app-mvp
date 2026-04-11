'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  MessageCircle,
  Search,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from 'lucide-react';

const TopBar = () => {
  // 1. Hook into the NextAuth session
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className='relative' ref={dropdownRef}>
            <div
              className='flex flex-row items-center gap-2 w-[56px] h-[32px] flex-none cursor-pointer group'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className='w-8 h-8 bg-[#F7F9FB] rounded-full flex-none overflow-hidden relative border border-slate-100 group-hover:border-[#1E9A80] transition-colors'>
                {/* Image from Google Session */}
                {session?.user?.image ? (
                  <Image
                    src={
                      session.user.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.email}`
                    }
                    alt={session.user.name || 'User'}
                    className='object-cover w-full h-full'
                    referrerPolicy='no-referrer' // Helps load Google images correctly
                    width={30}
                    height={30}
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
                className={`w-4 h-4 text-[#262626] flex-none transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white border border-[#E8E5DF] rounded-xl shadow-lg py-2 z-50'>
                <div className='px-4 py-2 border-b border-[#F7F9FB] mb-1'>
                  <p className='text-xs text-[#8796AF] font-medium uppercase tracking-wider'>
                    Account
                  </p>
                  <p className='text-sm font-semibold truncate'>
                    {session?.user?.name}
                  </p>
                </div>

                <button
                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-[#262626] hover:bg-[#F7F9FB] transition-colors'
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings
                    className='w-4 h-4 text-[#596881]'
                    strokeWidth={1.5}
                  />
                  Settings
                </button>

                <button
                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors'
                  onClick={() => {
                    setIsDropdownOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className='w-4 h-4' strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
