'use client';

import { useFormState } from 'react-dom';
import { registerUser } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export default function SignupPage() {
  const [state, formAction] = useFormState(registerUser, undefined);

  return (
    <div className='flex h-screen items-center justify-center bg-[#0F172A] px-4'>
      <div className='w-full max-w-md bg-[#1E293B] p-8 rounded-[32px] shadow-2xl border border-slate-800'>
        <div className='flex flex-col items-center mb-10'>
          <div className='w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20'>
            <span className='text-white font-bold text-xl'>Q</span>
          </div>
          <h1 className='text-2xl font-bold text-white'>Create Account</h1>
          <p className='text-slate-400 mt-1 text-sm text-center'>
            Join QuickFlip for smart inventory management
          </p>
        </div>

        <form action={formAction} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-slate-300 ml-1'>
              Full Name
            </label>
            <input
              name='name'
              type='text'
              placeholder='John Doe'
              required
              className='w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-slate-300 ml-1'>
              Email
            </label>
            <input
              name='email'
              type='email'
              placeholder='name@example.com'
              required
              className='w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-slate-300 ml-1'>
              Password
            </label>
            <input
              name='password'
              type='password'
              placeholder='••••••••'
              required
              className='w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all'
            />
          </div>

          {state && (
            <p className='text-red-400 text-sm bg-red-400/10 p-3 rounded-lg text-center font-medium border border-red-400/20'>
              {state}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className='text-center mt-8 text-slate-400 text-sm'>
          Already have an account?{' '}
          <Link
            href='/login'
            replace
            className='text-[#1E9A80] font-semibold cursor-pointer hover:underline'
          >
            Log in
          </Link>
        </p>
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
      className='w-full mt-4 bg-emerald-500 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2'
    >
      {pending ? (
        <>
          <Loader2 className='animate-spin' size={20} />
          Creating Account...
        </>
      ) : (
        'Sign Up'
      )}
    </button>
  );
}
