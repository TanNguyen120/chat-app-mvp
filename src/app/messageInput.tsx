'use client';
import { useEffect, useRef, useState } from 'react';
import { sendImageMessage, sendMessage } from '@/app/actions/chat';
import { Mic, Paperclip, SendHorizontal, Smile, X } from 'lucide-react'; // Optional: for a nice icon
import { pusherServer } from '@/lib/pusher-sever';
import { useSession } from 'next-auth/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { chatWithAI } from './actions/ai';
import Image from 'next/image';
import { useUploadThing } from '@/lib/utils';
import { send } from 'process';

interface MessageInputProps {
  roomId: string;
  onMessageSent?: (content: string, imageUrl?: string) => void;
  userId: string;
  setThinking?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MessageInput({
  roomId,
  onMessageSent,
  userId,
  setThinking,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Hook from our utils
  const { startUpload, isUploading } = useUploadThing('imageUploader');

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = text.trim();
    if ((!messageContent && !selectedFile) || isSending) return;

    if (onMessageSent) onMessageSent(messageContent, previewUrl || undefined);

    const fileToSend = selectedFile;
    setText('');
    setSelectedFile(null); // Clear selection state
    setPreviewUrl(null); // Clear preview locally, but blob URL persists in Message list
    setIsSending(true);

    try {
      if (fileToSend) {
        await handleSendImageMessage(messageContent, fileToSend);
        return; // Don't proceed to send a text message if it's an image message
      }
      if (userId === 'AI_ASSISTANT') {
        if (setThinking) {
          setThinking(true);
        }
        // Call the AI action
        console.log('Sending message to AI:');
        await chatWithAI(roomId, messageContent);
      } else {
        // Call your normal sendMessage action
        await sendMessage(roomId, messageContent);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      if (userId === 'AI_ASSISTANT' && setThinking) {
        setThinking(false);
      }
      setIsSending(false);
    }
  };

  const handleSendImageMessage = async (content: string, file: File) => {
    if (!file) return;

    let imageUrl = '';

    try {
      const uploadRes = await startUpload([file]);
      if (uploadRes && uploadRes[0]) {
        imageUrl = uploadRes[0].url;
      }
      console.log('Image uploaded to URL:', imageUrl);
      // STEP 2: Save to Database & Notify Others
      await sendImageMessage(roomId, imageUrl, content);

      // STEP 3: Reset UI
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Something went wrong while sending.');
    }
  };

  return (
    /* Matching your CSS:
       display: flex; flex-direction: row; align-items: center;
       padding-top: 8px; gap: 12px; align-self: stretch;
    */
    <form
      onSubmit={handleSubmit}
      className='relative flex flex-col w-full m-1 me-3'
    >
      {/* Image Preview - ChatGPT style above input */}
      {previewUrl && (
        <div className='flex mb-3 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200'>
          <div className='relative w-20 h-20 bg-slate-50 rounded-2xl p-1.5 border border-[#E8E5DF] shadow-sm'>
            <Image
              src={previewUrl}
              alt='Preview'
              className='rounded-xl object-cover w-full h-full'
              width={80}
              height={80}
            />
            <button
              type='button'
              onClick={handleRemoveImage}
              className='absolute -top-2 -right-2 bg-[#111625] text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-md border-2 border-white'
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      <div className='flex flex-row items-center p-1 gap-3 self-stretch w-full rounded-full h-12 bg-white border-1 border-[#E8E5DF]'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 h-10 px-4 rounded-full text-sm focus:outline-none transition-all'
        />

        {showEmoji && (
          <div
            ref={pickerRef}
            className='absolute bottom-16 right-4 z-50 shadow-2xl border rounded-2xl overflow-hidden'
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.LIGHT}
              lazyLoadEmojis={true}
              searchPlaceholder='Search emoji...'
              width={350}
              height={400}
            />
          </div>
        )}
        <Mic size={18} className='cursor-pointer fw-bold' />
        <Smile
          size={20}
          className='cursor-pointer hover:text-[#1E9A80] transition-colors'
          onClick={() => setShowEmoji(!showEmoji)}
        />
        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          accept='image/*'
          onChange={handleFileChange}
        />
        <Paperclip
          size={18}
          className='cursor-pointer hover:text-[#1E9A80] transition-colors'
          onClick={() => fileInputRef.current?.click()}
        />

        <button
          type='submit'
          disabled={(!text.trim() && !selectedFile) || isSending}
          className='flex items-center justify-center w-10 h-10 rounded-full bg-[#38C793] text-white hover:bg-[#2fb182] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shrink-0'
        >
          <SendHorizontal
            size={18}
            className={isSending ? 'animate-pulse' : ''}
          />
        </button>
      </div>
    </form>
  );
}
