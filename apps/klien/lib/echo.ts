'use client';

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

let echoInstance: any = null;

export async function getEcho(token: string | null): Promise<any> {
  if (typeof window === 'undefined') return null;
  if (!token) return null;
  if (echoInstance) return echoInstance;

  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  if (!key) {
    console.warn('[echo] NEXT_PUBLIC_PUSHER_APP_KEY kosong, skip realtime');
    return null;
  }

  try {
    const [{ default: Echo }, { default: Pusher }] = await Promise.all([
      import('laravel-echo'),
      import('pusher-js'),
    ]);

    window.Pusher = Pusher;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com';

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'ap1',
      forceTLS: true,
      authEndpoint: `${apiUrl}/broadcasting/auth`,
      auth: { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
    });

    window.Echo = echoInstance;
    return echoInstance;
  } catch (e) {
    console.warn('[echo] gagal init, realtime nonaktif:', e);
    return null;
  }
}

export function disconnectEcho() {
  if (echoInstance) {
    try { echoInstance.disconnect(); } catch {}
    echoInstance = null;
    if (typeof window !== 'undefined') window.Echo = undefined;
  }
}
