import { SessionProvider } from 'next-auth/react';
import ChatDashboard from './chatDashboard';
import TopBar from './topBar';
import { SideNav } from './sideNav';

export const dynamic = 'force-dynamic';

export default function ChatLobby() {
  return (
    <SessionProvider>
      <div className='h-screen flex flex-col  bg-[#F7F9FB] gap-2'>
        <div className='px-4'>
          <TopBar />
        </div>
        <div className='flex flex-1 gap-2 px-4 pb-2 overflow-hidden'>
          <SideNav />
          <ChatDashboard />
        </div>
      </div>
    </SessionProvider>
  );
}
