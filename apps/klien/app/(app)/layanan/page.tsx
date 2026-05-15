'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Plus, Calendar, User, HeartPulse, Search, ChevronRight } from 'lucide-react';

export default function LayananPage() {
  const router = useRouter();
  const [layanan, setLayanan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/klien/layanan')
      .then((res: any) => {
        const d = res.data?.data;
        setLayanan(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => { setLayanan([]); setLoading(false); });
  }, []);

  const filtered = Array.isArray(layanan) ? layanan.filter(l =>
    l.tipe_layanan?.toLowerCase().includes(search.toLowerCase()) ||
    l.catatan?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Layanan</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{layanan.length} layanan aktif</p>
        </div>
        <button onClick={() => router.push('/layanan/new')} style={{ width:'42px', height:'42px', borderRadius:'14px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(16,185,129,0.4)' }}>
          <Plus size={20} color="white" />
        </button>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'16px', display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px' }}>
        <Search size={18} style={{ color:'var(--text-muted)', flexShrink:0 }} />
        <input placeholder="Cari layanan..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text-primary)', fontSize:'14px', width:'100%' }} />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'20px', height:'130px' }} />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((service) => (
            <div key={service.id} onClick={() => router.push(`/layanan/${service.id}`)} style={{ background:'var(--glass)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'16px', cursor:'pointer', boxShadow:'var(--shadow-card)' }}>
              <div className="flex items-start justify-between mb-3">
                <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(16,185,129,0.4)' }}>
                  <HeartPulse size={20} color="white" />
                </div>
                <span style={{ background: service.status==='active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: service.status==='active' ? '#10b981' : '#f59e0b', border:`1px solid ${service.status==='active' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius:'8px', padding:'4px 10px', fontSize:'11px', fontWeight:600 }}>
                  {service.status === 'active' ? 'Aktif' : service.status}
                </span>
              </div>
              <h3 className="font-bold text-base mb-1" style={{ color:'var(--text-primary)' }}>{service.tipe_layanan}</h3>
              <div className="flex items-center gap-4 text-xs" style={{ color:'var(--text-muted)' }}>
                <div className="flex items-center gap-1.5"><User size={12} /><span>{service.pasien?.nama_lengkap}</span></div>
                <div className="flex items-center gap-1.5"><Calendar size={12} /><span>{new Date(service.tanggal_mulai).toLocaleDateString('id-ID')}</span></div>
              </div>
              {service.mitra?.user?.name && (
                <div style={{ marginTop:'10px', paddingTop:'10px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span className="text-xs" style={{ color:'var(--text-muted)' }}>Mitra: <strong style={{ color:'var(--text-primary)' }}>{service.mitra?.user?.name}</strong></span>
                  <ChevronRight size={14} style={{ color:'var(--text-muted)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div style={{ width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 16px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <HeartPulse size={36} style={{ color:'var(--green)', opacity:0.5 }} />
          </div>
          <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Belum ada layanan</p>
          <p className="text-sm mt-1 mb-4" style={{ color:'var(--text-muted)' }}>Mulai pesan layanan perawatan</p>
          <button onClick={() => router.push('/layanan/new')} style={{ padding:'12px 24px', background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'14px', border:'none', color:'white', fontWeight:600, cursor:'pointer' }}>
            Buat Layanan
          </button>
        </div>
      )}
    </div>
  );
}
