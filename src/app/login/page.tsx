'use client';

import { signIn } from 'next-auth/react';

import { loginWithCredentials } from '../actions/auth';
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams.callbackUrl || '/';
  // state will hold the error string returned from our action
  const [state, formAction] = useFormState(loginWithCredentials, undefined);
  return (
    <div className='flex flex-1 max-h-screen min-h-screen bg-[#F7F9FB] font-sans'>
      {/* Visual Side: Benefit & Social Proof */}
      <div className='hidden lg:flex w-1/2 items-center justify-center p-12 bg-gradient-to-br from-[#1E9A80] to-[#16856e] relative overflow-hidden'>
        {/* Abstract Background Decoration */}
        <div className='absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-black/10 rounded-full blur-3xl' />

        <div className='max-w-md text-white relative z-10'>
          <div className='flex items-center gap-4 mb-8'>
            <div className='w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl'>
              <div className='w-7 h-7 bg-[#1E9A80] rounded-full animate-pulse' />
            </div>
            <h1 className='text-5xl font-extrabold tracking-tight'>
              QuickTalk
            </h1>
          </div>

          <h2 className='text-3xl font-bold mb-4 leading-tight'>
            Stop waiting. <br />
            Start connecting.
          </h2>

          <p className='text-lg opacity-90 leading-relaxed mb-8'>
            Join <span className='font-bold'>2,400+</span> professionals and
            friends chatting right now in lightning-fast, private workspaces.
          </p>

          {/* Conversion-Focused Micro-Feature List */}
          <div className='space-y-4'>
            {[
              'Real-time Read Receipts',
              'Encrypted Private Messaging',
              'Instant Status Updates',
            ].map((feature) => (
              <div
                key={feature}
                className='flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 backdrop-blur-sm'
              >
                <div className='w-5 h-5 bg-[#1E9A80] rounded-full flex items-center justify-center'>
                  <svg
                    className='w-3 h-3 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={3}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span className='text-sm font-medium'>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Side: The Friction-Free Action */}
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-2 sm:p-4 overflow-y-auto'>
        <div className='w-full max-w-sm space-y-2 bg-white p-6 sm:p-8 rounded-[32px] border border-[#E8E5DF] shadow-[0_8px_30px_rgb(0,0,0,0.04)] my-auto'>
          <div className='text-center'>
            {/* User Context Awareness */}
            <div className='inline-block px-3 py-1 mb-2 text-[12px] font-bold text-[#1E9A80] bg-[#1E9A80]/10 rounded-full uppercase tracking-wider'>
              Secure Login
            </div>
            <h2 className='text-2xl font-bold text-[#111625] tracking-tight'>
              Jump back in
            </h2>
            <p className='text-[#8796AF] mt-1 text-sm'>
              Your conversations are waiting for you.
            </p>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl })}
            className='w-full group flex items-center justify-center gap-3 bg-[#111625] hover:bg-[#1E9A80] text-white font-semibold py-2.5 px-4 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-black/10'
          >
            <div className='bg-white p-1 rounded-md group-hover:bg-white/90 transition-colors'>
              <img
                src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                className='w-5 h-5'
                alt='Google'
              />
            </div>
            Continue with Google
          </button>

          <form action={formAction} className='space-y-3'>
            <div>
              <label className='text-sm font-medium text-[#111625] ml-1'>
                Email
              </label>
              <input
                name='email'
                type='email'
                placeholder='name@example.com'
                required
                className='w-full mt-1 px-4 py-2 rounded-xl bg-gray-50 border border-[#E8E5DF] outline-none focus:border-[#1E9A80] focus:ring-1 focus:ring-[#1E9A80] transition-all text-sm'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-[#111625] ml-1'>
                Password
              </label>
              <input
                name='password'
                type='password'
                placeholder='••••••••'
                required
                className='w-full mt-1 px-4 py-2 rounded-xl bg-gray-50 border border-[#E8E5DF] outline-none focus:border-[#1E9A80] focus:ring-1 focus:ring-[#1E9A80] transition-all text-sm'
              />
            </div>

            {state && (
              <p className='text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center font-medium'>
                {state}
              </p>
            )}

            <SubmitButton />
          </form>

          <div className='flex items-center gap-4 text-[#8796AF] text-sm before:h-[1px] before:flex-1 before:bg-[#E8E5DF] after:h-[1px] after:flex-1 after:bg-[#E8E5DF]'>
            OR
          </div>

          <p className='text-center text-[#8796AF] text-sm'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              replace
              className='text-[#1E9A80] font-semibold cursor-pointer hover:underline'
            >
              Register
            </Link>
          </p>

          <div className='text-center'>
            <p className='text-[12px] text-[#8796AF] leading-relaxed'>
              By continuing, you agree to our <br />
              <span className='text-[#111625] cursor-pointer hover:underline'>
                Terms of Service
              </span>{' '}
              and{' '}
              <span className='text-[#111625] cursor-pointer hover:underline'>
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='w-full mt-2 bg-[#1E9A80] text-white py-2.5 rounded-xl font-bold hover:bg-[#167d68] transition-all disabled:opacity-70 flex items-center justify-center gap-2'
    >
      {pending ? (
        <>
          <Loader2 className='animate-spin' size={20} />
          Signing in...
        </>
      ) : (
        'Sign In'
      )}
    </button>
  );
}
