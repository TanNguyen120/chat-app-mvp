'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/app/actions/users';
import { pusherClient } from '@/lib/pusher-client';
import Image from 'next/image';

export default function UserList({
  onUserClick,
}: {
  onUserClick: (user: any) => void;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    // 1. Load all users from DB
    getAllUsers().then(setUsers);
    console.log('Loaded users', users);
    // 2. Subscribe to Presence Channel
    if (!pusherClient) return;

    const channel = pusherClient.subscribe('presence-messenger');

    // Fired when you first connect
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      const ids: string[] = [];
      members.each((member: any) => ids.push(member.id));
      setOnlineUserIds(ids);
    });

    // Fired when someone else joins
    channel.bind('pusher:member_added', (member: any) => {
      setOnlineUserIds((prev) => [...prev, member.id]);
    });

    // Fired when someone leaves
    channel.bind('pusher:member_removed', (member: any) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== member.id));
    });

    return () => {
      pusherClient.unsubscribe('presence-messenger');
    };
  }, []);

  return (
    <div className='flex flex-col gap-2 p-4'>
      <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>
        Direct Messages
      </h3>
      {users.map((user) => {
        const isOnline = onlineUserIds.includes(user.id);

        return (
          <button
            key={user.id}
            onClick={() => onUserClick(user)}
            className='flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors group'
          >
            <div className='relative'>
              <Image
                src={user.image || '/default-avatar.png'}
                alt={user.name || ''}
                width={40}
                height={40}
                className='rounded-full'
              />
              {/* Online Status Dot */}
              {isOnline && (
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full' />
              )}
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-sm font-medium text-slate-700'>
                {user.name}
              </span>
              <span className='text-xs text-slate-400'>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
