// src/app/login/page.tsx
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams.callbackUrl || '/';

  return (
    <div className='flex min-h-screen bg-slate-950'>
      {/* Visual Side (The Surprise) */}
      <div className='hidden lg:flex w-1/2 items-center justify-center p-12 bg-gradient-to-br from-indigo-600 to-violet-700'>
        <div className='max-w-md text-white'>
          <h1 className='text-5xl font-bold mb-6 italic tracking-tight'>
            QuickTalk AI
          </h1>
          <p className='text-lg opacity-90 leading-relaxed'>
            The next generation of real-time resale assistance. Identify, chat,
            and flip in seconds.
          </p>
        </div>
      </div>

      {/* Login Side */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-sm space-y-8 bg-slate-900/50 p-10 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white'>Welcome back</h2>
            <p className='text-slate-400 mt-2'>Log in to start chatting</p>
          </div>

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: callbackUrl });
            }}
          >
            <button className='w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-4 px-4 rounded-xl transition-all active:scale-[0.98]'>
              <img src='/google.svg' className='w-5 h-5' alt='Google' />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
