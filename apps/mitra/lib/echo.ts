'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

let echoInstance: any = null;

export function getEcho(token: string | null): any {
  if (typeof window === 'undefined') return null;
  if (!token) return null;
  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com';

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'ap1',
    forceTLS: true,
    authEndpoint: `${apiUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  if (typeof window !== 'undefined') {
    window.Echo = echoInstance;
  }

  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    if (typeof window !== 'undefined') {
      window.Echo = undefined;
    }
  }
}
