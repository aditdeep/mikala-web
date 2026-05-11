'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { MapPin, Calendar, ChevronRight, Briefcase, Search } from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/mitra/jobs')
      .then((res: any) => { setJobs(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    j.service_type?.toLowerCase().includes(search.toLowerCase()) ||
    j.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Pekerjaan</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{jobs.length} tersedia</p>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background:'var(--glass)', backdropFilter:'blur(16px)',
        border:'1px solid var(--glass-border)', borderRadius:'16px',
        display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px',
      }}>
        <Search size={18} style={{ color:'var(--text-muted)', flexShrink:0 }} />
        <input
          placeholder="Cari pekerjaan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background:'transparent', border:'none', outline:'none',
            color:'var(--text-primary)', fontSize:'14px', width:'100%',
          }}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} style={{
              background:'var(--glass)', borderRadius:'20px', height:'120px',
              animation:'pulse 1.5s infinite',
            }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/jobs/${job.id}`)}
              style={{
                background:'var(--glass)', backdropFilter:'blur(20px)',
                WebkitBackdropFilter:'blur(20px)',
                border:'1px solid var(--glass-border)', borderRadius:'20px',
                padding:'16px', cursor:'pointer',
                boxShadow:'var(--shadow-card)',
                transition:'all 0.2s',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div style={{
                  width:'44px', height:'44px', borderRadius:'14px',
                  background:'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, boxShadow:'0 4px 12px rgba(124,58,237,0.4)',
                }}>
                  <Briefcase size={20} color="white" />
                </div>
                <span style={{
                  background: job.status === 'available' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                  color: job.status === 'available' ? '#10b981' : '#f59e0b',
                  border: `1px solid ${job.status === 'available' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  borderRadius:'8px', padding:'4px 10px', fontSize:'11px', fontWeight:600,
                }}>
                  {job.status === 'available' ? 'Tersedia' : job.status}
                </span>
              </div>

              <h3 className="font-bold text-base mb-1" style={{ color:'var(--text-primary)' }}>{job.service_type}</h3>
              <p className="text-sm mb-3" style={{ color:'var(--text-muted)' }}>{job.patient_name}</p>

              <div className="flex items-center gap-4 text-xs" style={{ color:'var(--text-muted)' }}>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  <span>{job.location || 'Lokasi belum ditentukan'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>{new Date(job.start_date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              <div style={{
                marginTop:'12px', paddingTop:'12px',
                borderTop:'1px solid var(--border)',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <div>
                  <p className="text-xs" style={{ color:'var(--text-muted)' }}>Pembayaran</p>
                  <p className="font-bold text-base" style={{ color:'#10b981' }}>
                    Rp {job.payment?.toLocaleString('id-ID') || 0}
                  </p>
                </div>
                <div style={{
                  width:'32px', height:'32px', borderRadius:'10px',
                  background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <ChevronRight size={16} style={{ color:'var(--purple-light)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div style={{
            width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 16px',
            background:'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.1))',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Briefcase size={36} style={{ color:'var(--purple-light)', opacity:0.5 }} />
          </div>
          <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Tidak ada pekerjaan</p>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Belum ada pekerjaan tersedia saat ini</p>
        </div>
      )}
    </div>
  );
}
