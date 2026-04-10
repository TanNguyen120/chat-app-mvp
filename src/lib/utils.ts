import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, differenceInDays } from 'date-fns';
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';
// ⚠️ Import the type from your actual core.ts file
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getChatRoomId = (userId1: string, userId2: string) => {
  const sortedIds = [userId1, userId2].sort();
  return `private-chat-${sortedIds[0]}-${sortedIds[1]}`;
};

/**
 * Formats a date to a human-readable relative string.
 * - Under 7 days: "2 minutes ago", "1 day ago", etc.
 * - Over 7 days: "Apr 09, 2026"
 */
export function formatChatTime(date: Date | string | number | null): string {
  if (!date) return '';

  const d = new Date(date);

  // Check if the date is valid
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const daysDifference = Math.abs(differenceInDays(now, d));

  if (daysDifference < 7) {
    // Returns "about 1 minute ago", "2 days ago", etc.
    // addSuffix: true adds the "ago" part
    return formatDistanceToNow(d, { addSuffix: true })
      .replace('about ', '') // Optional: makes it cleaner ("1 minute ago" vs "about 1 minute ago")
      .replace('less than a minute ago', 'just now');
  } else {
    // Returns "Apr 09, 2026"
    return format(d, 'MMM dd, yyyy');
  }
}

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// This is the hook we'll use in your MessageInput component
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
