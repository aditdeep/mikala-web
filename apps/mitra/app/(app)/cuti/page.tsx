'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Calendar, Plus, Check, X, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CutiPage() {
  const router = useRouter();
  const [data, setData] = useState<any>({ data: [], stats: { max_per_bulan: 2, terpakai_bulanan: 0, sisa_bulanan: 2 } });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ tanggal_mulai: '', tanggal_selesai: '', alasan: '' });

  const fetchCuti = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/mitra/cuti');
      setData(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCuti(); }, []);

  const handleSubmit = async () => {
    if (!form.tanggal_mulai || !form.tanggal_selesai || !form.alasan.trim()) {
      alert('Lengkapi semua data cuti'); return;
    }
    const mulai   = new Date(form.tanggal_mulai);
    const selesai = new Date(form.tanggal_selesai);
    const hari    = Math.floor((selesai.getTime() - mulai.getTime()) / 86400000) + 1;
    if (hari > data.stats.sisa_bulanan) {
      alert(`Sisa quota cuti bulan ini hanya ${data.stats.sisa_bulanan} hari`); return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/mitra/cuti', form);
      alert('✅ Pengajuan cuti berhasil dikirim, menunggu persetujuan');
      setShowForm(false);
      setForm({ tanggal_mulai: '', tanggal_selesai: '', alasan: '' });
      fetchCuti();
    } catch (e: any) {
      alert('Error: ' + (e?.response?.data?.message || 'gagal'));
    }
    setSubmitting(false);
  };

  const statusBadge = (s: string) => {
    const map: any = {
      pending:  { bg:'rgba(245,158,11,0.15)', color:'#f59e0b', icon:Clock,  label:'Pending' },
      approved: { bg:'rgba(16,185,129,0.15)', color:'#10b981', icon:Check, label:'Disetujui' },
      rejected: { bg:'rgba(239,68,68,0.15)',  color:'#ef4444', icon:X,     label:'Ditolak' },
    };
    const m = map[s] || map.pending;
    const Icon = m.icon;
    return (
      <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'3px 9px', borderRadius:'8px', fontSize:'11px', fontWeight:700, background:m.bg, color:m.color }}>
        <Icon size={10}/> {m.label}
      </span>
    );
  };

  return (
    <div style={{ padding:'16px', paddingBottom:'90px', maxWidth:'500px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:800, color:'var(--text)' }}>📅 Cuti</h1>
          <p style={{ fontSize:'12px', color:'var(--text3)' }}>Ajukan & lihat history cuti</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ display:'flex', alignItems:'center', gap:'4px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'12px', padding:'8px 14px', color:'white', fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
          <Plus size={14}/> Ajukan
        </button>
      </div>

      {/* Stats Quota */}
      <div style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.08))', border:'1px solid rgba(124,58,237,0.3)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'4px' }}>Quota Cuti Bulan Ini</p>
        <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
          <span style={{ fontSize:'28px', fontWeight:800, color:'#a78bfa' }}>{data.stats.sisa_bulanan}</span>
          <span style={{ fontSize:'13px', color:'var(--text3)' }}>/ {data.stats.max_per_bulan} hari tersisa</span>
        </div>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>
          Sudah digunakan: <strong style={{ color:'var(--text)' }}>{data.stats.terpakai_bulanan} hari</strong>
        </p>
      </div>

      {/* History */}
      <div>
        <h3 style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'10px' }}>📋 History Pengajuan</h3>
        {loading ? (
          <p style={{ color:'var(--text3)', textAlign:'center', padding:'24px' }}>Loading...</p>
        ) : data.data.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 16px', color:'var(--text3)' }}>
            <Calendar size={32} style={{ opacity:0.2, marginBottom:8 }}/>
            <p style={{ fontSize:'13px' }}>Belum ada pengajuan cuti</p>
            <p style={{ fontSize:'11px', marginTop:'4px' }}>Klik tombol "Ajukan" di atas untuk ajukan cuti</p>
          </div>
        ) : (
          <div style={{ display:'grid', gap:'10px' }}>
            {data.data.map((c: any) => (
              <div key={c.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>
                      {new Date(c.tanggal_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'short'})} – {new Date(c.tanggal_selesai).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                    <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>{c.jumlah_hari} hari</p>
                    <p style={{ fontSize:'11px', color:'var(--text2)', marginTop:'6px' }}>{c.alasan}</p>
                    {c.catatan_admin && (
                      <p style={{ fontSize:'10px', color:'var(--text3)', marginTop:'6px', fontStyle:'italic', background:'var(--bg)', padding:'6px 8px', borderRadius:'6px' }}>
                        💬 {c.catatan_admin}
                      </p>
                    )}
                  </div>
                  {statusBadge(c.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Ajukan */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'var(--bg)', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'20px', width:'100%', maxWidth:'500px', maxHeight:'85vh', overflowY:'auto', border:'1px solid var(--border)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
              <h3 style={{ fontSize:'16px', fontWeight:800, color:'var(--text)' }}>📝 Ajukan Cuti</h3>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px 10px', color:'var(--text)', cursor:'pointer' }}>✕</button>
            </div>

            <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'10px', padding:'10px', marginBottom:'14px' }}>
              <p style={{ fontSize:'12px', color:'#f59e0b', fontWeight:600 }}>⏳ Sisa quota bulan ini: {data.stats.sisa_bulanan} hari</p>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>Max {data.stats.max_per_bulan} hari per bulan</p>
            </div>

            <div style={{ marginBottom:'12px' }}>
              <label style={{ fontSize:'12px', color:'var(--text3)', display:'block', marginBottom:'4px', fontWeight:600 }}>Tanggal Mulai *</label>
              <input type="date" value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
                min={new Date().toISOString().slice(0,10)}
                style={{ width:'100%', padding:'9px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' }}/>
            </div>

            <div style={{ marginBottom:'12px' }}>
              <label style={{ fontSize:'12px', color:'var(--text3)', display:'block', marginBottom:'4px', fontWeight:600 }}>Tanggal Selesai *</label>
              <input type="date" value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })}
                min={form.tanggal_mulai || new Date().toISOString().slice(0,10)}
                style={{ width:'100%', padding:'9px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' }}/>
            </div>

            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'12px', color:'var(--text3)', display:'block', marginBottom:'4px', fontWeight:600 }}>Alasan Cuti *</label>
              <textarea value={form.alasan} onChange={(e) => setForm({ ...form, alasan: e.target.value })}
                placeholder="Contoh: Acara keluarga, sakit, dll"
                style={{ width:'100%', padding:'9px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', minHeight:'70px', resize:'vertical', outline:'none', fontFamily:'inherit' }}/>
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width:'100%', background: submitting ? '#666' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'12px', padding:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? '⏳ Mengirim...' : '📤 Kirim Pengajuan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
