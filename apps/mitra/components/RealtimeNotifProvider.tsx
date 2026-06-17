'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getEcho } from '../lib/echo';
import { Bell } from 'lucide-react';

interface NotifPayload {
  id: number;
  type: string;
  title: string;
  message: string;
  related_type?: string;
  related_id?: number;
  is_read: boolean;
  created_at: string;
}

export default function RealtimeNotifProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<NotifPayload | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('mikala_token');
    const userJson = localStorage.getItem('mikala_user');
    if (!token || !userJson) return;

    let userId: number;
    try {
      userId = Number(JSON.parse(userJson).id);
    } catch {
      return;
    }
    if (!userId) return;

    const echo = getEcho(token);
    if (!echo) return;

    const channel = echo.private(`notifikasi.${userId}`);

    channel.listen('.notifikasi.created', (payload: NotifPayload) => {
      console.log('🔔 Notif baru:', payload); 
      setToast(payload);
      setTimeout(() => setToast(null), 5000);
      window.dispatchEvent(new CustomEvent('notif-received', { detail: payload }));
    });

    return () => {
      channel.stopListening('.notifikasi.created');
      echo.leave(`notifikasi.${userId}`);
    };
  }, []);

  return (
    <>
      {children}
      {toast && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setToast(null)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
            zIndex: 99999,
            maxWidth: '90%',
            minWidth: '300px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            cursor: 'pointer',
          }}
        >
          <Bell size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>{toast.title}</p>
            <p style={{ fontSize: '12px', opacity: 0.92 }}>{toast.message}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
