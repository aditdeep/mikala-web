// Self-destroying service worker - unregister & clear semua cache lama
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', async () => {
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    const clients = await self.clients.matchAll();
    clients.forEach(c => c.navigate(c.url));
    await self.registration.unregister();
  } catch (e) {}
});
