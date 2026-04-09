import { SessionProvider } from 'next-auth/react';
import ChatDashboard from './chatDashboard';
import TopBar from './topBar';

export const dynamic = 'force-dynamic';

export default function ChatLobby() {
  return (
    <SessionProvider>
      <div className='h-screen flex flex-col overflow-hidden bg-[#F7F9FB]'>
        <TopBar />
        <ChatDashboard />
      </div>
    </SessionProvider>
  );
}
