'use client';
import PusherJS from 'pusher-js';

const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

export const pusherClient = new PusherJS(key, {
  cluster: cluster,
  authEndpoint: '/api/pusher/auth',
  authTransport: 'ajax',
});
