'use client';

import { Home, MessageCircle, Users, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, href: '/dashboard', label: 'Home' },
    { icon: MessageCircle, href: '/chat', label: 'Messages' },
    { icon: Users, href: '/contacts', label: 'Contacts' },
    { icon: Settings, href: '/settings', label: 'Settings' },
  ];

  return (
    <nav className='w-[72px] flex flex-col items-center py-8 justify-between bg-white rounded-[24px] shadow-sm flex-none h-full'>
      <div className='flex flex-col items-center gap-10'>
        {/* Logo */}
        <Link href='/'>
          <div className='w-10 h-10 bg-[#1E9A80] rounded-xl flex items-center justify-center shadow-lg shadow-[#1E9A80]/20 cursor-pointer'>
            <div className='w-5 h-5 bg-white rounded-full' />
          </div>
        </Link>

        {/* Nav Icons */}
        <div className='flex flex-col gap-8'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Icon
                  className={`w-6 h-6 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1E9A80]'
                      : 'text-[#8796AF] hover:text-[#1E9A80]'
                  }`}
                  strokeWidth={1.5}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className='group'
      >
        <LogOut
          className='w-6 h-6 text-[#8796AF] group-hover:text-red-500 transition-colors cursor-pointer'
          strokeWidth={1.5}
        />
      </button>
    </nav>
  );
}
