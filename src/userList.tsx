'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { getAllUsers } from '@/app/actions/users';
import Image from 'next/image';
import { format } from 'date-fns';

interface UserListProps {
  currentUserId: string;
  onUserClick: (user: any) => void;
  activeRoomId?: string;
}

export default function UserList({
  currentUserId,
  onUserClick,
  activeRoomId,
}: UserListProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load: Get all users and their last messages from DB
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // 2. Real-time Presence & Message Updates
  useEffect(() => {
    if (!pusherClient || !currentUserId) return;

    // Presence Channel for Green Dots
    const presenceChannel = pusherClient.subscribe('presence-messenger');

    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const ids: string[] = [];
      members.each((m: any) => ids.push(m.id));
      setOnlineUserIds(ids);
    });

    presenceChannel.bind('pusher:member_added', (member: any) => {
      setOnlineUserIds((prev) => [...prev, member.id]);
    });

    presenceChannel.bind('pusher:member_removed', (member: any) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== member.id));
    });

    // Message Listener for Sidebar Updates
    // We subscribe to each user's room to listen for new messages
    users.forEach((user) => {
      const sortedIds = [currentUserId, user.id].sort();
      const roomId = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;
      const chatChannel = pusherClient.subscribe(roomId);

      chatChannel.bind('new-message', (data: any) => {
        setUsers((prevUsers) => {
          console.log('Received new message for room:', roomId, 'Data:', data);
          const updated = prevUsers.map((u) => {
            // Check if this message belongs to the conversation with user 'u'
            if (roomId.includes(u.id)) {
              return {
                ...u,
                lastMessage: data.content,
                lastMessageTime: data.createdAt,
                isLastMsgMe: data.senderId === currentUserId,
              };
            }
            return u;
          });

          // Sort the list: Most recent message at the top
          return [...updated].sort((a, b) => {
            const timeA = a.lastMessageTime
              ? new Date(a.lastMessageTime).getTime()
              : 0;
            const timeB = b.lastMessageTime
              ? new Date(b.lastMessageTime).getTime()
              : 0;
            return timeB - timeA;
          });
        });
      });
    });

    return () => {
      pusherClient.unsubscribe('presence-messenger');
      users.forEach((user) => {
        const sortedIds = [currentUserId, user.id].sort();
        pusherClient.unsubscribe(
          `private-chat-${sortedIds[0]}-${sortedIds[1]}`,
        );
      });
    };
  }, [users, currentUserId]);

  if (isLoading) {
    return (
      <div className='p-4 text-slate-400 text-sm'>Loading contacts...</div>
    );
  }

  return (
    <div className='flex flex-col h-full bg-white border-r border-slate-100'>
      <div className='p-4 border-b'>
        <h2 className='text-xl font-bold text-slate-800'>Messages</h2>
      </div>

      <div className='flex-1 overflow-y-auto p-2 space-y-1'>
        {users.map((user) => {
          const isOnline = onlineUserIds.includes(user.id);
          const isActive = activeRoomId?.includes(user.id);

          return (
            <button
              key={user.id}
              onClick={() => onUserClick(user)}
              className={`flex items-center gap-3 p-3 w-full rounded-2xl transition-all text-left group ${
                isActive ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              {/* Avatar Container */}
              <div className='relative shrink-0'>
                <div className='w-12 h-12 rounded-full overflow-hidden border border-slate-100'>
                  <Image
                    src={user.image || '/default-avatar.png'}
                    alt={user.name || ''}
                    width={48}
                    height={48}
                    className='object-cover'
                  />
                </div>
                {isOnline && (
                  <span className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full' />
                )}
              </div>

              {/* Text Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-baseline mb-0.5'>
                  <p
                    className={`text-sm font-semibold truncate ${isActive ? 'text-blue-600' : 'text-slate-800'}`}
                  >
                    {user.name}
                  </p>
                  {user.lastMessageTime && (
                    <span className='text-[10px] text-slate-400 shrink-0'>
                      {format(new Date(user.lastMessageTime), 'p')}
                    </span>
                  )}
                </div>

                <div className='flex items-center gap-1'>
                  <p className='text-xs text-slate-500 truncate'>
                    {user.isLastMsgMe && (
                      <span className='text-slate-400 font-medium'>You: </span>
                    )}
                    {user.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
