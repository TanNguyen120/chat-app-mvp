'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getAllUsers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Fetch all users except yourself
  return await prisma.user.findMany({
    where: {
      NOT: { id: session.user.id },
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  });
}
