'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, HeartPulse, User, Calendar, FileText, Star } from 'lucide-react';

export default function DetailLayananPage() {
  const params = useParams();
  const router = useRouter();
  const [layanan, setLayanan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiClient.get(`/klien/layanan/${params.id}`)
      .then((r: any) => { setLayanan(r.data?.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleFeedback = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(`/klien/layanan/${params.id}/feedback`, { rating, catatan: feedback });
      setShowFeedback(false);
      alert('Feedback berhasil dikirim!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal kirim feedback');
    } finally { setSubmitting(false); }
  };

  const statusMap: any = {
    pending: { label:'Menunggu Konfirmasi', color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
    confirmed: { label:'Dikonfirmasi', color:'#3b82f6', bg:'rgba(59,130,246,0.15)' },
    active: { label:'Sedang Berjalan', color:'#10b981', bg:'rgba(16,185,129,0.15)' },
    completed: { label:'Selesai', color:'#6b7280', bg:'rgba(107,114,128,0.15)' },
    cancelled: { label:'Dibatalkan', color:'#ef4444', bg:'rgba(239,68,68,0.15)' },
  };

  const tipeMap: any = {
    homecare_harian: 'Homecare Harian',
    homecare_live_in: 'Homecare Live In',
    medical_checkup: 'Medical Checkup',
    konsultasi: 'Konsultasi',
    fisioterapi: 'Fisioterapi',
    perawatan_luka: 'Perawatan Luka',
    vaksinasi: 'Vaksinasi',
    lainnya: 'Lainnya',
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px' }}>
      <p style={{ color:'var(--text3)' }}>Memuat data...</p>
    </div>
  );

  if (!layanan) return (
    <div style={{ textAlign:'center', padding:'40px' }}>
      <p style={{ color:'var(--text3)' }}>Data layanan tidak ditemukan</p>
      <button onClick={() => router.back()} style={{ marginTop:'16px', padding:'8px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text2)', cursor:'pointer' }}>Kembali</button>
    </div>
  );

  const s = statusMap[layanan.status] || statusMap.pending;

  return (
    <div style={{ padding:'16px', paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', paddingTop:'8px' }}>
        <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Detail Layanan</h1>
      </div>

      {/* Status Card */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', marginBottom:'12px', textAlign:'center' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'18px', margin:'0 auto 12px', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <HeartPulse size={26} style={{ color:'#10b981' }} />
        </div>
        <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)', marginBottom:'6px' }}>{tipeMap[layanan.tipe_layanan] || layanan.tipe_layanan}</p>
        <span style={{ display:'inline-block', background:s.bg, color:s.color, borderRadius:'10px', padding:'5px 14px', fontSize:'12px', fontWeight:600 }}>{s.label}</span>
        <p style={{ color:'var(--text3)', fontSize:'12px', marginTop:'8px' }}>#{layanan.order_number}</p>
      </div>

      {/* Detail Info */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', marginBottom:'12px' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Informasi Layanan</p>
        </div>
        {[
          { icon: Calendar, label:'Tanggal Mulai', value: layanan.tanggal_mulai ? new Date(layanan.tanggal_mulai).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-' },
          { icon: Calendar, label:'Tanggal Selesai', value: layanan.tanggal_selesai ? new Date(layanan.tanggal_selesai).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : 'Belum ditentukan' },
          { icon: User, label:'Mitra/Perawat', value: layanan.mitra?.user?.name || 'Belum ditentukan' },
          { icon: User, label:'Pasien', value: layanan.pasien?.nama_lengkap || '-' },
          { icon: FileText, label:'Catatan', value: layanan.catatan || '-' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} style={{ color:'#10b981' }} />
              </div>
              <div>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback button - only for completed */}
      {layanan.status === 'completed' && (
        <button onClick={() => setShowFeedback(true)} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'16px', color:'white', fontWeight:700, fontSize:'15px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          <Star size={18} />Beri Penilaian
        </button>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'400px', padding:'24px' }}>
            <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)', marginBottom:'16px' }}>Beri Penilaian</h2>
            <form onSubmit={handleFeedback} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div>
                <p style={{ color:'var(--text2)', fontSize:'12px', marginBottom:'8px' }}>Rating</p>
                <div style={{ display:'flex', gap:'8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)} style={{ width:'40px', height:'40px', borderRadius:'10px', border:'1px solid var(--border)', background: rating >= n ? 'rgba(245,158,11,0.2)' : 'var(--glass)', color: rating >= n ? '#f59e0b' : 'var(--text3)', cursor:'pointer', fontSize:'18px' }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ color:'var(--text2)', fontSize:'12px', marginBottom:'6px' }}>Komentar</p>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width:'100%', padding:'10px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontSize:'13px', outline:'none', minHeight:'80px', resize:'vertical' as const }} placeholder="Ceritakan pengalaman Anda..." />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowFeedback(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, cursor:'pointer' }}>
                  {submitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
