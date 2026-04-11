// src/app/actions/auth.ts
'use server';

import { signIn } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function loginWithCredentials(
  state: string | undefined,
  formData: FormData,
) {
  try {
    // This calls the 'authorize' function in your auth.ts
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        default:
          return 'Something went wrong. Please try again.';
      }
    }
    // You MUST throw the error if it's not an AuthError
    // so Next.js can handle the redirect internally.
    throw error;
  }
}

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return 'User with this email already exists.';
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return 'Failed to create account. Please try again.';
  }

  // 4. Redirect to login on success
  redirect('/login');
}
