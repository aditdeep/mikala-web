'use client';
// Daftar notifikasi (setara layar Notifikasi di app Android). Ketuk notif -> tandai dibaca &
// buka menu terkait sesuai tipe notif yg dikirim backend (NotifikasiService).
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';

const ACCENT = '#10b981';
const TUJUAN: Record<string, string> = {
  tagihan: '/tagihan', invoice: '/tagihan', billing: '/tagihan', refund: '/tagihan',
  order: '/layanan', layanan: '/layanan',
  pasien: '/pasien',
};

function waktu(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'baru saja';
  if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  if (s < 604800) return `${Math.floor(s / 86400)} hari lalu`;
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotifikasiPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    apiClient.get('/notifikasi')
      .then((r: any) => { const l = r.data?.data?.data ?? r.data?.data ?? []; setItems(Array.isArray(l) ? l : []); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const onNew = () => load();
    window.addEventListener('notif-received', onNew);
    return () => window.removeEventListener('notif-received', onNew);
  }, []);

  const buka = async (n: any) => {
    if (!n.is_read) {
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      try { await apiClient.patch(`/notifikasi/${n.id}/read`); } catch {}
      window.dispatchEvent(new Event('notif-read'));
    }
    const tujuan = TUJUAN[n.type];
    if (tujuan) router.push(tujuan);
  };

  const bacaSemua = async () => {
    setItems(prev => prev.map(x => ({ ...x, is_read: true })));
    try { await apiClient.post('/notifikasi/mark-all-read'); } catch {}
    window.dispatchEvent(new Event('notif-read'));
  };

  const adaBelumDibaca = items.some(n => !n.is_read);

  return (
    <div className="p-4 pt-6 space-y-4" style={{ paddingBottom: '80px' }}>
      <div className="flex items-center gap-3 pt-4" style={{ paddingRight: '96px' }}>
        <button onClick={() => router.back()} aria-label="Kembali"
          style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '8px', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifikasi</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{items.filter(n => !n.is_read).length} belum dibaca</p>
        </div>
      </div>

      {adaBelumDibaca && (
        <button onClick={bacaSemua}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: ACCENT, fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          <CheckCheck size={15} />Tandai semua dibaca
        </button>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--glass)', borderRadius: '16px', height: '72px' }} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div style={{ width: '72px', height: '72px', borderRadius: '22px', margin: '0 auto 14px', background: `${ACCENT}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={32} style={{ color: ACCENT, opacity: 0.6 }} />
          </div>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Belum ada notifikasi</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(n => (
            <div key={n.id} onClick={() => buka(n)}
              style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '16px', cursor: 'pointer',
                background: n.is_read ? 'var(--glass)' : `${ACCENT}14`,
                border: `1px solid ${n.is_read ? 'var(--glass-border)' : ACCENT + '40'}` }}>
              <div style={{ width: '8px', flexShrink: 0, paddingTop: '6px' }}>
                {!n.is_read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ACCENT }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: n.is_read ? 500 : 700 }}>{n.title}</p>
                {n.message && <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '3px', lineHeight: 1.5 }}>{n.message}</p>}
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px' }}>{waktu(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
