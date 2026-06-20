'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check } from 'lucide-react';
import { apiClient } from '@mikala/lib';

interface NotifItem {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr).getTime();
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function NotifBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const res: any = await apiClient.get('/notifikasi/unread-count');
      setUnread(res.data?.unread_count ?? 0);
    } catch {}
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/notifikasi');
      const list = res.data?.data?.data ?? res.data?.data ?? [];
      setItems(Array.isArray(list) ? list : []);
      setUnread(res.data?.unread_count ?? 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    const handler = (e: any) => {
      const payload = e.detail;
      setUnread((u) => u + 1);
      if (payload) setItems((prev) => [payload, ...prev]);
    };
    window.addEventListener('notif-received', handler);
    const poll = setInterval(fetchUnread, 60000);
    return () => {
      window.removeEventListener('notif-received', handler);
      clearInterval(poll);
    };
  }, [fetchUnread]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
      }
      fetchList();
    }
  };

  const markRead = async (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    try { await apiClient.patch(`/notifikasi/${id}/read`); } catch {}
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
    try { await apiClient.post('/notifikasi/mark-all-read'); } catch {}
  };

  return (
    <>
      <button ref={btnRef} onClick={toggle} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'var(--glass)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>
        <Bell size={15} style={{ color:'var(--text2)' }} />
        {unread > 0 && (
          <span style={{ position:'absolute', top:'-3px', right:'-3px', minWidth:'16px', height:'16px', padding:'0 4px', borderRadius:'8px', background:'#ef4444', color:'white', fontSize:'10px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--bg)' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div ref={panelRef} style={{ position:'fixed', top:`${pos.top}px`, right:`${pos.right}px`, width:'340px', maxWidth:'90vw', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'16px', boxShadow:'0 12px 40px rgba(0,0,0,0.35)', overflow:'hidden', zIndex:99999 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Notifikasi</span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ display:'flex', alignItems:'center', gap:'4px', background:'transparent', border:'none', cursor:'pointer', color:'var(--purple-light, #7c3aed)', fontSize:'12px', fontWeight:600 }}>
                <Check size={13} /> Tandai semua
              </button>
            )}
          </div>

          <div style={{ maxHeight:'400px', overflowY:'auto' }}>
            {loading ? (
              <div style={{ padding:'32px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>Memuat...</div>
            ) : items.length === 0 ? (
              <div style={{ padding:'32px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>Belum ada notifikasi</div>
            ) : (
              items.map((n) => (
                <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} style={{ display:'flex', gap:'10px', padding:'12px 16px', borderBottom:'1px solid var(--border)', cursor: n.is_read ? 'default' : 'pointer', background: n.is_read ? 'transparent' : 'var(--glass)' }}>
                  {!n.is_read && <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#7c3aed', flexShrink:0, marginTop:'6px' }} />}
                  <div style={{ flex:1, paddingLeft: n.is_read ? '17px' : '0' }}>
                    <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', margin:'0 0 2px' }}>{n.title}</p>
                    <p style={{ fontSize:'12px', color:'var(--text2)', margin:'0 0 4px', lineHeight:1.4 }}>{n.message}</p>
                    <span style={{ fontSize:'11px', color:'var(--text3)' }}>{timeAgo(n.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
