'use client';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, Video, Clock } from 'lucide-react';
import { apiClient } from '@mikala/lib';

const STATUS: Record<string,{label:string;color:string;bg:string}> = {
  scheduled:   { label:'Terjadwal',    color:'#3b82f6', bg:'rgba(59,130,246,0.1)' },
  done:        { label:'Selesai',      color:'#10b981', bg:'rgba(16,185,129,0.1)' },
  cancelled:   { label:'Dibatalkan',   color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  rescheduled: { label:'Dijadwal Ulang',color:'#f59e0b',bg:'rgba(245,158,11,0.1)' },
};

export default function JadwalInterviewPage() {
  const [jadwal, setJadwal]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/mitra/jadwal-interview')
      .then((res: any) => setJadwal(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5 pb-24">
      <div>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Jadwal Interview</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px' }}>Jadwal wawancara dengan tim rekrutmen Mikala</p>
      </div>

      {jadwal.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)' }}>
          <Calendar size={48} style={{ margin:'0 auto 12px', opacity:0.2 }} />
          <p style={{ fontWeight:600 }}>Belum ada jadwal interview</p>
          <p style={{ fontSize:'12px' }}>Tim rekrutmen akan menghubungi Anda</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {jadwal.map((j: any) => {
            const cfg = STATUS[j.status] || STATUS.scheduled;
            const tgl = new Date(j.jadwal_at);
            return (
              <div key={j.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    {j.tipe === 'online' ? <Video size={15} style={{ color:'#3b82f6' }} /> : <MapPin size={15} style={{ color:'var(--purple-light)' }} />}
                    <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>Interview {j.tipe === 'online' ? 'Online' : 'Offline'}</span>
                  </div>
                  <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'8px', background:cfg.bg, color:cfg.color }}>{cfg.label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                  <Clock size={14} style={{ color:'var(--text3)' }} />
                  <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>
                    {tgl.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                  </span>
                </div>
                <div style={{ fontSize:'22px', fontWeight:800, color:'var(--purple-light)', marginLeft:'20px', marginBottom:'8px' }}>
                  {tgl.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})} WIB
                </div>
                {j.tipe === 'offline' && j.lokasi && (
                  <p style={{ fontSize:'12px', color:'var(--text3)', marginLeft:'20px' }}>📍 {j.lokasi}</p>
                )}
                {j.tipe === 'online' && j.link_online && (
                  <a href={j.link_online} target="_blank" rel="noopener noreferrer"
                    style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'#3b82f6', marginLeft:'20px' }}>
                    <Video size={12} /> Buka Link Meeting
                  </a>
                )}
                {j.interviewer && <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px' }}>👤 {j.interviewer.name}</p>}
                {j.catatan && <div style={{ marginTop:'10px', background:'var(--bg)', borderRadius:'8px', padding:'8px 10px', fontSize:'12px', color:'var(--text2)' }}>📝 {j.catatan}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
