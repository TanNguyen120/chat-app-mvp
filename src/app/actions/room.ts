'use server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function createRoom(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const room = await prisma.room.create({
    data: { name },
  });

  redirect(`/chat/${room.id}`);
}
