'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, authService } from '@mikala/lib';
import { Plus, Clock, CheckCircle, ChevronRight, HeartPulse, FileText } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const user = authService.getUser();
    setUserName(user?.name?.split(' ')[0] || 'Klien');
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Selamat Pagi' : h < 17 ? 'Selamat Siang' : 'Selamat Malam');
    apiClient.get('/klien/dashboard').then((res: any) => setStats(res.data.data)).catch(() => {});
  }, []);

  const quickActions = [
    { icon: Plus, label: 'Layanan Baru', desc: 'Pesan layanan perawatan', href: '/layanan/new', gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.4)' },
    { icon: Plus, label: 'Tambah Pasien', desc: 'Daftarkan pasien baru', href: '/pasien/new', gradient: 'linear-gradient(135deg, #0d9488, #0f766e)', glow: 'rgba(13,148,136,0.4)' },
  ];

  return (
    <div className="p-4 pt-6 space-y-5">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #0d9488 100%)',
        borderRadius: '24px', padding: '24px',
        boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'150px', height:'150px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'absolute', bottom:'-40px', left:'30%', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(13,148,136,0.2)' }}/>
        <p className="text-green-100 text-sm font-medium mb-1">{greeting} 👋</p>
        <h1 className="text-white text-2xl font-bold mb-1">{userName}!</h1>
        <p className="text-green-100 text-sm">Kelola layanan perawatan Anda</p>
        <div className="flex items-center gap-2 mt-4 bg-white bg-opacity-15 rounded-xl px-3 py-2 w-fit">
          <HeartPulse size={14} className="text-white" />
          <span className="text-white text-xs font-medium">{stats?.active_services || 0} layanan aktif</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} onClick={() => router.push(action.href)} style={{
              background: action.gradient, borderRadius: '20px', padding: '18px',
              boxShadow: `0 6px 20px ${action.glow}`, border: 'none', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.2s',
            }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'10px' }}>
                <Icon size={18} color="white" />
              </div>
              <p className="text-white font-bold text-sm">{action.label}</p>
              <p className="text-white text-xs mt-0.5" style={{ opacity:0.8 }}>{action.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Clock, label: 'Layanan Aktif', value: stats?.active_services || 0, color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)' },
          { icon: CheckCircle, label: 'Total Pasien', value: stats?.total_patients || 0, color:'var(--green)', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ background:'var(--glass)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'18px', boxShadow:'var(--shadow-card)' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:item.bg, border:`1px solid ${item.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'10px' }}>
                <Icon size={20} style={{ color:item.color }} />
              </div>
              <div className="font-bold text-2xl" style={{ color:'var(--text-primary)' }}>{item.value}</div>
              <div className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Services */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="font-bold text-base" style={{ color:'var(--text-primary)' }}>Layanan Terkini</h2>
          <button onClick={() => router.push('/layanan')} className="text-xs font-semibold flex items-center gap-1" style={{ color:'var(--green)' }}>
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>
        <div className="px-4 pb-4 space-y-3">
          {stats?.recent_services?.length > 0 ? stats.recent_services.map((s: any) => (
            <div key={s.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'16px', padding:'14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'12px', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <HeartPulse size={18} style={{ color:'var(--green)' }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{s.service_type}</div>
                  <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{s.patient_name}</div>
                </div>
              </div>
              <span style={{ background:'rgba(16,185,129,0.15)', color:'var(--green)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.status}</span>
            </div>
          )) : (
            <div className="text-center py-8" style={{ color:'var(--text-muted)' }}>
              <FileText size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada layanan terkini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
