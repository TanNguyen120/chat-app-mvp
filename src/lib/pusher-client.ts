import Pusher from 'pusher-js';

// 1. Create a variable but don't initialize it immediately
let pusherClientInstance: Pusher | null = null;

// 2. Only initialize if we are in the browser
if (typeof window !== 'undefined') {
  pusherClientInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: 'eu',
    authEndpoint: '/api/pusher/auth',
    authTransport: 'ajax',
  });
}

export const pusherClient = pusherClientInstance as Pusher;
