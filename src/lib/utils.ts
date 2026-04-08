import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getChatRoomId = (userId1: string, userId2: string) => {
  const sortedIds = [userId1, userId2].sort();
  return `private-chat-${sortedIds[0]}-${sortedIds[1]}`;
};
