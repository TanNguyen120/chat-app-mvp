import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  PencilLine,
  Filter,
  CheckCheck,
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Home,
  MessageCircle,
} from 'lucide-react';

export default function ChatPage() {
  return (
    /* Main Background: #F7F9FB */
    <div className='flex h-screen w-full bg-[#F7F9FB] p-3 gap-3 font-sans text-[#111625]'>
      {/* MISSING: Left Navigation Sidebar */}
      <nav className='w-[72px] flex flex-col items-center py-8 justify-between bg-white rounded-[24px] shadow-sm flex-none'>
        <div className='flex flex-col items-center gap-10'>
          {/* Logo */}
          <div className='w-10 h-10 bg-[#1E9A80] rounded-xl flex items-center justify-center shadow-lg shadow-[#1E9A80]/20'>
            <div className='w-5 h-5 bg-white rounded-full' />
          </div>

          {/* Nav Icons */}
          <div className='flex flex-col gap-8'>
            <Home className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-[#1E9A80] transition-colors' />
            <MessageCircle className='w-6 h-6 text-[#1E9A80] cursor-pointer' />
            <Users className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-[#1E9A80] transition-colors' />
            <Settings className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-[#1E9A80] transition-colors' />
          </div>
        </div>

        <LogOut className='w-6 h-6 text-[#8796AF] cursor-pointer hover:text-red-500 transition-colors' />
      </nav>

      {/* Message List Sidebar */}
      <aside className='w-[400px] bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden'>
        <div className='p-6 space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-[20px] font-bold'>All Message</h2>
            <button className='bg-[#1E9A80] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md'>
              <PencilLine className='w-4 h-4' />
              New Chat
            </button>
          </div>

          <div className='flex gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8796AF]' />
              <input
                placeholder='Search'
                className='w-full bg-transparent border border-[#E8E5DF] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#1E9A80]'
              />
            </div>
            <button className='p-2 border border-[#E8E5DF] rounded-xl hover:bg-slate-50'>
              <Filter className='w-5 h-5 text-[#262626]' />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto px-4 space-y-2'>
          {/* Active Item Example */}
          <div className='flex items-center p-3 gap-3 bg-[#F3F3EE] rounded-2xl'>
            <div className='w-14 h-14 bg-[#1E9A80] rounded-xl flex flex-col items-center justify-center text-white shrink-0'>
              <MessageSquare className='w-5 h-5' />
              <span className='text-[10px] font-bold'>Unread</span>
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-center'>
                <h4 className='font-semibold text-sm'>Adrian Kurt</h4>
                <span className='text-[11px] text-[#596881]'>3 mins ago</span>
              </div>
              <div className='flex justify-between items-center gap-1'>
                <p className='text-xs text-[#8B8B8B] truncate'>
                  Thanks for the explanation!
                </p>
                <CheckCheck className='w-3.5 h-3.5 text-[#8796AF]' />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Message Box */}
      <main className='flex-1 bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden'>
        {/* Header with MISSING Action Icons */}
        <header className='px-6 py-4 border-b border-[#F7F9FB] flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-slate-200 overflow-hidden'>
              <img src='/api/placeholder/40/40' alt='avatar' />
            </div>
            <div>
              <h3 className='font-bold text-sm'>Daniel CH</h3>
              <span className='text-[11px] text-[#38C793] font-bold'>
                Online
              </span>
            </div>
          </div>

          {/* Header Action Icons */}
          <div className='flex items-center gap-3'>
            <IconButton icon={<Search className='w-4 h-4' />} />
            <IconButton icon={<Phone className='w-4 h-4' />} />
            <IconButton icon={<Video className='w-4 h-4' />} />
            <IconButton icon={<MoreHorizontal className='w-4 h-4' />} />
          </div>
        </header>

        <div className='flex-1 bg-[#FDFDFB] p-6'>
          {/* Chat content goes here */}
        </div>
      </main>
    </div>
  );
}

// Reusable Icon Button to match Figma's border style
function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className='w-8 h-8 flex items-center justify-center border border-[#E8E5DF] rounded-lg bg-white hover:bg-slate-50 transition-colors'>
      <div className='text-[#262626]'>{icon}</div>
    </button>
  );
}
