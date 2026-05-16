'use client';
import { useEffect, useState } from 'react';
import { apiClient, authService } from '@mikala/lib';
import { DollarSign, CheckCircle, Clock, ChevronRight, TrendingUp, Briefcase } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const user = authService.getUser();
    setUserName(user?.name?.split(' ')[0] || 'Mitra');
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Selamat Pagi' : h < 17 ? 'Selamat Siang' : 'Selamat Malam');

    apiClient.get('/mitra/dashboard')
      .then((res: any) => setStats(res.data.data))
      .catch(() => {});
  }, []);

  const statItems = [
    {
      icon: DollarSign,
      label: 'Penghasilan',
      value: stats?.total_earnings ? `Rp ${Number(stats.total_earnings).toLocaleString('id')}` : 'Rp 0',
      gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      glow: 'rgba(124,58,237,0.4)',
    },
    {
      icon: CheckCircle,
      label: 'Selesai',
      value: stats?.completed_jobs || 0,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      glow: 'rgba(16,185,129,0.4)',
    },
    {
      icon: Clock,
      label: 'Aktif',
      value: stats?.active_jobs || 0,
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      glow: 'rgba(236,72,153,0.4)',
    },
  ];

  return (
    <div className="p-4 pt-6 space-y-5">
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #6d28d9 100%)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position:'absolute', top:'-30px', right:'-30px',
          width:'150px', height:'150px', borderRadius:'50%',
          background:'rgba(255,255,255,0.08)',
        }}/>
        <div style={{
          position:'absolute', bottom:'-40px', left:'30%',
          width:'120px', height:'120px', borderRadius:'50%',
          background:'rgba(236,72,153,0.2)',
        }}/>
        <p className="text-purple-200 text-sm font-medium mb-1">{greeting} 👋</p>
        <h1 className="text-white text-2xl font-bold mb-1">{userName}!</h1>
        <p className="text-purple-200 text-sm">Selamat datang di Mikala Mitra</p>
        <div className="flex items-center gap-2 mt-4 bg-white bg-opacity-15 rounded-xl px-3 py-2 w-fit">
          <TrendingUp size={14} className="text-white" />
          <span className="text-white text-xs font-medium">
            {stats?.active_jobs || 0} pekerjaan aktif hari ini
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '16px 12px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{
                width:'40px', height:'40px', borderRadius:'12px',
                background: item.gradient,
                boxShadow: `0 4px 12px ${item.glow}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                margin: '0 auto 10px',
              }}>
                <Icon size={18} color="white" />
              </div>
              <div className="font-bold text-sm" style={{ color:'var(--text-primary)', lineHeight:1.2 }}>
                {item.value}
              </div>
              <div className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <div style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="font-bold text-base" style={{ color:'var(--text-primary)' }}>Pekerjaan Terkini</h2>
          <button
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color:'var(--purple-light)' }}
            onClick={() => window.location.href='/jobs'}
          >
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>

        <div className="px-4 pb-4 space-y-3">
          {stats?.recent_jobs?.length > 0 ? stats.recent_jobs.map((job: any) => (
            <div key={job.id} style={{
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                width:'40px', height:'40px', borderRadius:'12px',
                background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginRight:'12px', flexShrink:0,
              }}>
                <CheckCircle size={18} style={{ color:'var(--purple-light)' }} />
              </div>
              <div style={{ flex:1 }}>
                <div className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{(job.tipe_layanan||"-").replace(/_/g," ")}</div>
                <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{job.patient_name}</div>
              </div>
              <span style={{
                background: job.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                color: job.status === 'active' ? '#10b981' : 'var(--purple-light)',
                border: `1px solid ${job.status === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
                borderRadius: '8px', padding: '3px 10px',
                fontSize: '11px', fontWeight: 600,
              }}>
                {job.status}
              </span>
            </div>
          )) : (
            <div className="text-center py-8" style={{ color:'var(--text-muted)' }}>
              <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada pekerjaan terkini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
