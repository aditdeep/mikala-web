'use client';
// Ikon lonceng + badge jumlah notifikasi belum dibaca (setara ikon notif di app Android).
// Badge di-refresh tiap 30 dtk & langsung +1 saat RealtimeNotifProvider menerima notif baru.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { apiClient } from '@mikala/lib';

export function NotifBell() {
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const res: any = await apiClient.get('/notifikasi/unread-count');
      setUnread(res.data?.unread_count ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnread();
    const iv = setInterval(fetchUnread, 30000);
    const onNew = () => setUnread(u => u + 1);
    const onRead = () => fetchUnread();
    window.addEventListener('notif-received', onNew);
    window.addEventListener('notif-read', onRead);
    return () => { clearInterval(iv); window.removeEventListener('notif-received', onNew); window.removeEventListener('notif-read', onRead); };
  }, [fetchUnread]);

  return (
    <button onClick={() => router.push('/notifikasi')} aria-label="Notifikasi"
      className="p-2 rounded-xl transition-all duration-200"
      style={{ position: 'relative', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
      <Bell size={18} style={{ color: 'var(--text-primary)' }} />
      {unread > 0 && (
        <span style={{ position: 'absolute', top: '-5px', right: '-5px', minWidth: '17px', height: '17px', padding: '0 4px', borderRadius: '9px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary, #0f0a1a)' }}>
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  );
}
