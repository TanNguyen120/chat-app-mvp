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
    <div className='flex min-h-screen bg-[#F7F9FB] font-sans'>
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
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-sm space-y-8 bg-white p-10 rounded-[32px] border border-[#E8E5DF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
          <div className='text-center'>
            {/* User Context Awareness */}
            <div className='inline-block px-3 py-1 mb-4 text-[12px] font-bold text-[#1E9A80] bg-[#1E9A80]/10 rounded-full uppercase tracking-wider'>
              Secure Login
            </div>
            <h2 className='text-[32px] font-bold text-[#111625] tracking-tight'>
              Jump back in
            </h2>
            <p className='text-[#8796AF] mt-2'>
              Your conversations are waiting for you.
            </p>
          </div>

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: callbackUrl });
            }}
          >
            <button className='w-full group flex items-center justify-center gap-3 bg-[#111625] hover:bg-[#1E9A80] text-white font-semibold py-4 px-4 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-black/10'>
              <div className='bg-white p-1 rounded-md group-hover:bg-white/90 transition-colors'>
                <img
                  src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                  className='w-5 h-5'
                  alt='Google'
                />
              </div>
              Continue with Google
            </button>
          </form>

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
