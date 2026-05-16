'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { MapPin, Calendar, ChevronRight, Briefcase, Search, CheckCircle, Clock, PlayCircle, XCircle } from 'lucide-react';

const statusConfig: any = {
  pending:     { label:'Menunggu',    color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)' },
  confirmed:   { label:'Dikonfirmasi',color:'#3b82f6', bg:'rgba(59,130,246,0.15)', border:'rgba(59,130,246,0.3)' },
  in_progress: { label:'Berjalan',   color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
  completed:   { label:'Selesai',    color:'#6b7280', bg:'rgba(107,114,128,0.15)',border:'rgba(107,114,128,0.3)' },
  cancelled:   { label:'Dibatalkan', color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)' },
  on_hold:     { label:'Ditahan',    color:'#8b5cf6', bg:'rgba(139,92,246,0.15)', border:'rgba(139,92,246,0.3)' },
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchJobs = () => {
    apiClient.get('/mitra/jobs')
      .then((res: any) => {
        const d = res.data?.data;
        setJobs(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const updateStatus = async (jobId: number, status: string) => {
    setUpdatingStatus(true);
    try {
      await apiClient.patch('/mitra/jobs/' + jobId + '/status', { status });
      fetchJobs();
      if (selectedJob) setSelectedJob((p: any) => ({...p, status}));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal update status');
    } finally { setUpdatingStatus(false); }
  };

  const filtered = jobs.filter(j =>
    JSON.stringify(j).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pt-6 space-y-4" style={{ paddingBottom:'80px' }}>
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Pekerjaan</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{jobs.length} pekerjaan</p>
        </div>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'16px', display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px' }}>
        <Search size={18} style={{ color:'var(--text-muted)', flexShrink:0 }} />
        <input placeholder="Cari pekerjaan..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ background:'transparent', border:'none', outline:'none', color:'var(--text-primary)', fontSize:'14px', width:'100%' }} />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'20px', height:'120px' }} />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((job) => {
            const cfg = statusConfig[job.status] || statusConfig.pending;
            return (
              <div key={job.id} onClick={() => setSelectedJob(job)}
                style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'16px', cursor:'pointer', boxShadow:'var(--shadow-card)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Briefcase size={20} color="white" />
                  </div>
                  <span style={{ background:cfg.bg, color:cfg.color, border:'1px solid '+cfg.border, borderRadius:'8px', padding:'4px 10px', fontSize:'11px', fontWeight:600 }}>
                    {cfg.label}
                  </span>
                </div>

                <h3 className="font-bold text-base mb-1" style={{ color:'var(--text-primary)', textTransform:'capitalize' }}>
                  {(job.tipe_layanan||'-').replace(/_/g,' ')}
                </h3>
                <p className="text-sm mb-1" style={{ color:'var(--text-muted)' }}>
                  Klien: {job.klien?.nama_lengkap||job.klien?.user?.name||'-'}
                </p>
                {job.pasien && <p className="text-sm mb-3" style={{ color:'var(--text-muted)' }}>Pasien: {job.pasien?.nama_lengkap||'-'}</p>}

                <div className="flex items-center gap-4 text-xs" style={{ color:'var(--text-muted)' }}>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>{job.lokasi||job.alamat_layanan||'Lokasi belum ditentukan'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{job.tanggal_mulai ? new Date(job.tanggal_mulai).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>

                <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p className="text-xs" style={{ color:'var(--text-muted)' }}>Order #{job.order_number||job.id}</p>
                    <p className="font-bold text-base" style={{ color:'#10b981' }}>
                      Rp {Number(job.total||job.total_amount||job.total_harga||0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color:'var(--purple-light)' }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div style={{ width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 16px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Briefcase size={36} style={{ color:'var(--purple-light)', opacity:0.5 }} />
          </div>
          <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Tidak ada pekerjaan</p>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Belum ada pekerjaan tersedia saat ini</p>
        </div>
      )}

      {/* Detail + Update Status Modal */}
      {selectedJob && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:'var(--bg2)', borderRadius:'24px 24px 0 0', padding:'24px', width:'100%', maxWidth:'480px', maxHeight:'85vh', overflowY:'auto', position:'relative', zIndex:1001 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h3 style={{ fontWeight:700, fontSize:'17px', color:'var(--text-primary)' }}>Detail Pekerjaan</h3>
              <button onClick={() => setSelectedJob(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'6px', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>✕</button>
            </div>

            <div style={{ background:'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius:'16px', padding:'16px', marginBottom:'16px' }}>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'12px' }}>Tipe Layanan</p>
              <p style={{ color:'white', fontWeight:700, fontSize:'16px', textTransform:'capitalize' }}>{(selectedJob.tipe_layanan||'-').replace(/_/g,' ')}</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'11px', marginTop:'4px' }}>Order #{selectedJob.order_number}</p>
            </div>

            {[
              { label:'Klien', value: selectedJob.klien?.nama_lengkap||selectedJob.klien?.user?.name||'-' },
              ...(selectedJob.pasien ? [{ label:'Pasien', value: selectedJob.pasien?.nama_lengkap||'-' }] : []),
              { label:'Lokasi', value: selectedJob.lokasi||selectedJob.alamat_layanan||selectedJob.catatan_lokasi||'-' },
              { label:'Tanggal Mulai', value: selectedJob.tanggal_mulai ? new Date(selectedJob.tanggal_mulai).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}) : '-' },
              { label:'Tanggal Selesai', value: selectedJob.tanggal_selesai ? new Date(selectedJob.tanggal_selesai).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}) : '-' },
              { label:'Total', value: 'Rp '+Number(selectedJob.total||selectedJob.total_amount||0).toLocaleString('id-ID') },
              { label:'Catatan', value: selectedJob.catatan||'-' },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text-muted)', fontSize:'12px', minWidth:'100px' }}>{item.label}</span>
                <span style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{item.value}</span>
              </div>
            ))}

            {/* Update Status */}
            <div style={{ marginTop:'16px' }}>
              <p style={{ color:'var(--text-muted)', fontSize:'12px', marginBottom:'10px' }}>Update Status:</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {[
                  { status:'in_progress', label:'Mulai Kerjakan', icon: PlayCircle, color:'#10b981' },
                  { status:'completed',   label:'Selesai',        icon: CheckCircle, color:'#3b82f6' },
                  { status:'on_hold',     label:'Tahan',          icon: Clock,       color:'#8b5cf6' },
                  { status:'cancelled',   label:'Batalkan',       icon: XCircle,     color:'#ef4444' },
                ].map(btn => {
                  const Icon = btn.icon;
                  const isActive = selectedJob.status === btn.status;
                  return (
                    <button key={btn.status} onClick={() => updateStatus(selectedJob.id, btn.status)} disabled={updatingStatus||isActive}
                      style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 12px', borderRadius:'12px', border:'1px solid '+(isActive?btn.color+'44':'var(--border)'), background: isActive?btn.color+'22':'var(--glass)', color: btn.color, fontWeight:600, fontSize:'12px', cursor: isActive?'default':'pointer', opacity: updatingStatus?0.6:1 }}>
                      <Icon size={15}/>{btn.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
