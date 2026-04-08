import { SessionProvider } from 'next-auth/react';
import ChatDashboard from './chatDashboard';
import TopBar from './topBar';

export const dynamic = 'force-dynamic';

export default function ChatLobby() {
  return (
    <SessionProvider>
      <div>
        <TopBar />
        <ChatDashboard />
      </div>
    </SessionProvider>
  );
}
