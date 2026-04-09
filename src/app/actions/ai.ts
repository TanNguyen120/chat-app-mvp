'use server';
import { GoogleGenAI } from '@google/genai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher-sever';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Helper to wait for a specific time
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a Rate Limit (429) or Server Error (500/503)
      const isRetryable = error.status === 429 || error.status >= 500;

      if (!isRetryable || i === maxRetries - 1) throw error;

      // Calculate delay: initialDelay * 2^attempt + random jitter
      const delay = initialDelay * Math.pow(2, i) + Math.random() * 1000;

      console.log(
        `⚠️ Rate limited. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1})`,
      );
      await sleep(delay);
    }
  }
  throw lastError;
}

export async function chatWithAI(roomId: string, userMessage: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  console.log('User Message to AI:', userMessage);

  // Ensure the Room exists in the DB (Upsert pattern)
  await prisma.room.upsert({
    where: { id: roomId },
    update: {},
    create: {
      id: roomId,
      isGroup: false,
    },
  });

  // Save user message to database first so it appears in history
  const userDbMessage = await prisma.message.create({
    data: {
      content: userMessage,
      roomId: roomId,
      userId: session.user.id,
    },
    include: { user: true },
  });

  // Trigger Pusher for the user message
  await pusherServer.trigger(roomId, 'new-message', {
    ...userDbMessage,
    createdAt: userDbMessage.createdAt.toISOString(),
  });

  try {
    // 1. Generate Response

    const response = await withRetry(async () => {
      return await genAI.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview', // Lite handles traffic better!
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      });
    });

    const aiResponse = response.text;
    console.log('Gemini Response:', aiResponse);

    // 2. Save AI Response to Database
    const dbMessage = await prisma.message.create({
      data: {
        content: aiResponse || "Sorry, I'm having trouble thinking right now.", // Fallback in case AI fails to generate text
        roomId: roomId,
        userId: 'AI_ASSISTANT', // Use a hardcoded ID for your AI
      },
    });

    // 3. Trigger Pusher so the message appears instantly
    await pusherServer.trigger(roomId, 'new-message', {
      ...dbMessage,
      createdAt: dbMessage.createdAt.toISOString(),
    });

    return aiResponse;
  } catch (error) {
    console.error('Gemini Error:', error);
    return "Sorry, I'm having trouble thinking right now.";
  }
}
