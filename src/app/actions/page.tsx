import { createRoom } from '@/app/actions/room';
import { PlusCircle } from 'lucide-react';

export default function ChatLobby() {
  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white'>Chat Lobby</h1>
          <p className='text-slate-400 mt-2'>Create a room to start flipping</p>
        </div>

        <form action={createRoom} className='space-y-4'>
          <div>
            <input
              name='name'
              type='text'
              placeholder='Room Name (e.g. Vintage Nike Flip)'
              required
              className='w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
            />
          </div>
          <button className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-95'>
            <PlusCircle className='w-5 h-5' />
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}
