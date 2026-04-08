// Change this:
// import PusherJS from 'pusher-js';

// To this:
import PusherJS from 'pusher-js';

// If the above still fails in your specific setup, use this exact path:
// import PusherJS from 'pusher-js/dist/web/pusher';

export const pusherClient = new PusherJS(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    authEndpoint: '/api/pusher/auth',
    authTransport: 'ajax',
  },
);
