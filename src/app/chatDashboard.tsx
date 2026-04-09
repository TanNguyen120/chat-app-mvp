'use client';
import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  PencilLine,
  Filter,
  CheckCheck,
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Home,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import Image from 'next/image';
import { getChatRoomId } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import MessageInput from './messageInput';
import { getMessageHistory } from './actions/chat';
import { ChatWindow } from './chatWindow';
import UserList from '@/userList';

// 1. The data structure for a single user (matches your metadata in auth/route.ts)
interface UserInfo {
  name: string;
  image: string;
}

// 2. The standard structure of a Pusher Presence Member
interface PresenceMember {
  id: string;
  info: UserInfo;
}

// 3. The object returned by 'pusher:subscription_succeeded'
interface PresenceMembers {
  count: number;
  each: (callback: (member: PresenceMember) => void) => void;
  me: PresenceMember;
  get: (id: string) => PresenceMember | null;
}

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PresenceMember | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<PresenceMember[]>([]);
  // Get the current logged-in user from your session/auth
  const { data: session } = useSession();

  const currentUserId = session?.user?.id;

  const handleUserClick = (targetUser: PresenceMember) => {
    if (!currentUserId) return;

    const roomId = getChatRoomId(currentUserId, targetUser.id);
    setActiveRoom(roomId);
    console.log('Selected User:', targetUser, 'Room ID:', roomId);
    setSelectedUser(targetUser);
  };
  useEffect(() => {
    if (!pusherClient) return;

    console.log('Subscribing to presence-global...');
    const channel = pusherClient.subscribe('presence-global');

    // 1. Initial sync (When YOU join)
    channel.bind(
      'pusher:subscription_succeeded',
      (members: PresenceMembers) => {
        console.log('Success! Initial members:', members.count);
        const initial: PresenceMember[] = [];
        members.each((member: PresenceMember) => {
          initial.push(member);
        });
        setOnlineUsers(initial);
      },
    );

    // 2. New member joining (When OTHERS join)
    channel.bind('pusher:member_added', (member: PresenceMember) => {
      console.log('Member Joined:', member.info.name);
      setOnlineUsers((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m.id === member.id)) return prev;
        return [...prev, member];
      });
    });

    // 3. Member leaving
    channel.bind('pusher:member_removed', (member: PresenceMember) => {
      console.log('Member Left:', member.id);
      setOnlineUsers((prev) => prev.filter((m) => m.id !== member.id));
    });

    // 4. Handle connection errors
    pusherClient.connection.bind('error', (err: any) => {
      console.error('Pusher Connection Error:', err);
    });

    return () => {
      console.log('Unsubscribing...');
      channel.unbind_all(); // Important: remove all listeners
      pusherClient.unsubscribe('presence-global');
    };
  }, []);

  return (
    /* Main Background: #F7F9FB */
    <div className='flex h-screen w-full bg-[#F7F9FB] p-3 gap-3 font-sans text-[#111625]'>
      {/* MISSING: Left Navigation Sidebar */}
      <nav className='w-[72px] flex flex-col items-center py-8 justify-between bg-white rounded-[24px] shadow-sm flex-none'>
        <div className='flex flex-col items-center gap-10'>
          {/* Logo */}
          <div className='w-10 h-10 bg-[#1E9A80] rounded-xl flex items-center justify-center shadow-lg shadow-[#1E9A80]/20'>
            <div className='w-5 h-5 bg-white rounded-full' />
          </div>

          {/* Nav Icons */}
          <div className='flex flex-col gap-8'>
            <Home
              className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-[#1E9A80] transition-colors'
              strokeWidth={1.5}
            />
            <MessageCircle
              className='w-6 h-6 text-[#1E9A80] cursor-pointer'
              strokeWidth={1.5}
            />
            <Users
              className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-[#1E9A80] transition-colors'
              strokeWidth={1.5}
            />
            <Settings
              className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-[#1E9A80] transition-colors'
              strokeWidth={1.5}
            />
          </div>
        </div>

        <LogOut
          className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-red-500 transition-colors'
          strokeWidth={1.5}
        />
      </nav>

      {/* Message List Sidebar */}
      <aside className='w-[400px] bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden'>
        <div className='p-6 space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-[20px] font-bold'>All Message</h2>
            <button className='bg-[#1E9A80] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md'>
              <PencilLine className='w-4 h-4' strokeWidth={1.5} />
              New Chat
            </button>
          </div>

          <div className='flex gap-3'>
            <div className='relative flex-1'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8796AF]'
                strokeWidth={1.5}
              />
              <input
                placeholder='Search'
                className='w-full bg-transparent border border-[#E8E5DF] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#1E9A80]'
              />
            </div>
            <button className='p-2 border border-[#E8E5DF] rounded-xl hover:bg-slate-50'>
              <Filter className='w-5 h-5 text-[#262626]' strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto px-4 space-y-2'>
          {/* Active Item Example */}
          <UserList
            onUserClick={handleUserClick}
            currentUserId={currentUserId || ''}
            activeRoomId={activeRoom || undefined}
          />
        </div>
      </aside>

      {/* Main Message Box */}
      <main className='flex-1 bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden '>
        {/* Header with MISSING Action Icons */}
        <header className='px-6 py-4 border-b border-[#F7F9FB] flex justify-between items-center'>
          {/* Header Action Icons */}
          <div className='flex items-center gap-3'>
            <IconButton
              icon={<Search className='w-4 h-4' strokeWidth={1.5} />}
            />
            <IconButton
              icon={<Phone className='w-4 h-4' strokeWidth={1.5} />}
            />
            <IconButton
              icon={<Video className='w-4 h-4' strokeWidth={1.5} />}
            />
            <IconButton
              icon={<MoreHorizontal className='w-4 h-4' strokeWidth={1.5} />}
            />
          </div>
        </header>

        <div className=' bg-[#FDFDFB] p-6'>
          {activeRoom ? (
            <ChatWindow roomId={activeRoom} selectedUser={selectedUser!} />
          ) : (
            <div className='h-full flex flex-col items-center justify-center gap-4'>
              Start chatting with someone!
            </div>
          )}
        </div>
        <MessageInput roomId={activeRoom || ''} />
      </main>
    </div>
  );
}

// Reusable Icon Button to match Figma's border style
function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className='w-8 h-8 flex items-center justify-center border border-[#E8E5DF] rounded-lg bg-white hover:bg-slate-50 transition-colors'>
      <div className='text-[#262626]'>{icon}</div>
    </button>
  );
}
