'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Plus, Phone, MapPin, Users, Search, ChevronRight, User } from 'lucide-react';

export default function PasienPage() {
  const router = useRouter();
  const [pasien, setPasien] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/klien/pasien')
      .then((res: any) => {
        const d = res.data?.data;
        setPasien(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => { setPasien([]); setLoading(false); });
  }, []);

  const filtered = pasien.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'P';

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Pasien</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{pasien.length} pasien terdaftar</p>
        </div>
        <button onClick={() => router.push('/pasien/new')} style={{ width:'42px', height:'42px', borderRadius:'14px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(16,185,129,0.4)' }}>
          <Plus size={20} color="white" />
        </button>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'16px', display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px' }}>
        <Search size={18} style={{ color:'var(--text-muted)', flexShrink:0 }} />
        <input placeholder="Cari pasien..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text-primary)', fontSize:'14px', width:'100%' }} />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'20px', height:'90px' }} />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} onClick={() => router.push(`/pasien/${p.id}`)} style={{ background:'var(--glass)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'16px', cursor:'pointer', boxShadow:'var(--shadow-card)', display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'50px', height:'50px', borderRadius:'16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(16,185,129,0.35)', color:'white', fontWeight:700, fontSize:'16px' }}>
                {initials(p.name)}
              </div>
              <div style={{ flex:1 }}>
                <h3 className="font-bold text-base" style={{ color:'var(--text-primary)' }}>{p.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs" style={{ color:'var(--text-muted)' }}>
                  {p.age && <span>{p.age} tahun</span>}
                  {p.diagnosis && <span style={{ background:'rgba(16,185,129,0.1)', color:'var(--green)', borderRadius:'6px', padding:'2px 8px' }}>{p.diagnosis}</span>}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color:'var(--text-muted)' }}>
                  {p.phone && <div className="flex items-center gap-1"><Phone size={11} /><span>{p.phone}</span></div>}
                  {p.address && <div className="flex items-center gap-1"><MapPin size={11} /><span className="truncate max-w-32">{p.address}</span></div>}
                </div>
              </div>
              <ChevronRight size={16} style={{ color:'var(--text-muted)', flexShrink:0 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div style={{ width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 16px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Users size={36} style={{ color:'var(--green)', opacity:0.5 }} />
          </div>
          <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Belum ada pasien</p>
          <p className="text-sm mt-1 mb-4" style={{ color:'var(--text-muted)' }}>Daftarkan pasien pertama Anda</p>
          <button onClick={() => router.push('/pasien/new')} style={{ padding:'12px 24px', background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'14px', border:'none', color:'white', fontWeight:600, cursor:'pointer' }}>
            Tambah Pasien
          </button>
        </div>
      )}
    </div>
  );
}
