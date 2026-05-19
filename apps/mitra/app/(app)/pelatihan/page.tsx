'use client';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Lock } from 'lucide-react';
import { apiClient } from '@mikala/lib';

export default function PelatihanPage() {
  const [materi, setMateri]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    apiClient.get('/mitra/pelatihan')
      .then((res: any) => {
        const data = res.data?.data || [];
        setMateri(data);
        const done = data.filter((m: any) => m.status === 'completed').length;
        setProgress(data.length ? Math.round((done / data.length) * 100) : 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    </div>
  );

  const statusIcon = (s: string) => {
    if (s === 'completed') return <CheckCircle2 size={18} style={{ color:'#10b981' }} />;
    if (s === 'pending')   return <Clock size={18} style={{ color:'#f59e0b' }} />;
    return <Lock size={18} style={{ color:'var(--text3)' }} />;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5 pb-24">
      <div>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Kontrol Pelatihan</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px' }}>Progress materi wajib sebelum menerima penugasan</p>
      </div>

      {/* Progress */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
          <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>Progress Pelatihan</span>
          <span style={{ fontSize:'20px', fontWeight:800, color:'var(--purple-light)' }}>{progress}%</span>
        </div>
        <div style={{ height:'10px', background:'var(--bg)', borderRadius:'99px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#7c3aed,#4f46e5)', borderRadius:'99px', transition:'width .5s' }} />
        </div>
        <div style={{ display:'flex', gap:'16px', marginTop:'10px', fontSize:'12px', color:'var(--text3)' }}>
          <span>✅ {materi.filter(m=>m.status==='completed').length} Selesai</span>
          <span>⏳ {materi.filter(m=>m.status==='pending').length} Proses</span>
          <span>🔒 {materi.filter(m=>m.status==='locked').length} Terkunci</span>
        </div>
      </div>

      <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'12px', padding:'12px 14px', fontSize:'12px', color:'#3b82f6' }}>
        ℹ️ Penyelesaian materi diceklis oleh Divisi Training Center. Hubungi trainer jika materi sudah selesai tapi belum dicentang.
      </div>

      {materi.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)' }}>
          <BookOpen size={48} style={{ margin:'0 auto 12px', opacity:0.2 }} />
          <p style={{ fontWeight:600 }}>Belum ada materi</p>
          <p style={{ fontSize:'12px' }}>Materi akan muncul setelah verifikasi selesai</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {materi.map((m: any) => (
            <div key={m.id} style={{
              background:'var(--glass)', border:`1px solid ${m.status==='completed'?'rgba(16,185,129,0.3)':m.status==='pending'?'rgba(245,158,11,0.3)':'var(--border)'}`,
              borderRadius:'14px', padding:'14px', opacity: m.status==='locked' ? 0.6 : 1,
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                <div style={{ marginTop:'2px' }}>{statusIcon(m.status)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:'6px', marginBottom:'4px' }}>
                    <span style={{ fontSize:'11px', color:'var(--text3)' }}>#{m.urutan}</span>
                    {m.kategori && <span style={{ fontSize:'11px', background:'var(--bg)', borderRadius:'6px', padding:'1px 6px', color:'var(--text3)' }}>{m.kategori}</span>}
                  </div>
                  <p style={{ fontWeight:600, fontSize:'14px', color:'var(--text)' }}>{m.judul}</p>
                  {m.deskripsi && <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'4px' }}>{m.deskripsi}</p>}
                  {m.completed_at && <p style={{ fontSize:'11px', color:'#10b981', marginTop:'6px' }}>✓ {new Date(m.completed_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</p>}
                </div>
                <span style={{
                  fontSize:'11px', fontWeight:600, padding:'3px 8px', borderRadius:'8px',
                  background: m.status==='completed'?'rgba(16,185,129,0.1)':m.status==='pending'?'rgba(245,158,11,0.1)':'var(--bg)',
                  color: m.status==='completed'?'#10b981':m.status==='pending'?'#f59e0b':'var(--text3)',
                }}>
                  {m.status==='completed'?'Selesai':m.status==='pending'?'Proses':'Terkunci'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
