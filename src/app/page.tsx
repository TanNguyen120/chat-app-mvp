import { createRoom } from '@/app/actions/room';
import { PlusCircle } from 'lucide-react';
import ChatDashboard from './chatDashboard';

export default function ChatLobby() {
  return (
    <div>
      <ChatDashboard />
    </div>
  );
}
