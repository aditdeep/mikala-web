'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { StatsCard } from '@/components/StatsCard';
import { Users, Briefcase, DollarSign, Clock, TrendingUp, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/internal/dashboard/summary')
      .then((res: any) => { setStats(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { title:'Total Mitra', value: stats?.total_mitra || 0, icon: Users, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)', glow:'rgba(124,58,237,0.3)', trend:{ value:'+12%', isPositive:true } },
    { title:'Order Aktif', value: stats?.orders_active || 0, icon: Briefcase, gradient:'linear-gradient(135deg, #10b981, #059669)', glow:'rgba(16,185,129,0.3)', trend:{ value:'+8%', isPositive:true } },
    { title:'Mitra On Job', value: stats?.mitra_on_job || 0, icon: Briefcase, gradient:'linear-gradient(135deg, #f59e0b, #d97706)', glow:'rgba(245,158,11,0.3)', trend:{ value:'+5%', isPositive:true } },
    { title:'Revenue', value: `Rp ${((stats?.total_revenue || 0)/1000000).toFixed(1)}Jt`, icon: DollarSign, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)', glow:'rgba(236,72,153,0.3)', trend:{ value:'+23%', isPositive:true } },
    { title:'Pending', value: stats?.pending_items?.new_applications || 0, icon: Clock, gradient:'linear-gradient(135deg, #f59e0b, #d97706)', glow:'rgba(245,158,11,0.3)' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Dashboard</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'2px' }}>Selamat datang kembali! Ini ringkasan hari ini.</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'10px' }}>
          <TrendingUp size={13} style={{ color:'var(--purple-light)' }} />
          <span style={{ fontSize:'12px', fontWeight:500, color:'var(--text2)' }}>Live Data</span>
          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#10b981' }}/>
        </div>
      </div>

      {/* Stats - scroll horizontal di mobile */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'16px', height:'100px' }} />)}
        </div>
      ) : (
        <>
          {/* Mobile: 2 columns grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px' }} className="stats-mobile">
            {statCards.map(card => <StatsCard key={card.title} {...card} />)}
          </div>
          {/* Desktop: 4 columns */}
          <div style={{ display:'none' }} className="stats-desktop">
            {statCards.map(card => <StatsCard key={card.title} {...card} />)}
          </div>
        </>
      )}

      {/* Tables */}
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }} className="tables-wrapper">
        {/* Recent Applications */}
        <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'14px' }}>Aplikasi Terbaru</h2>
            <button style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--purple-light)', fontSize:'12px', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
              Lihat Semua <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ padding:'8px 16px' }}>
            {stats?.recent_applications?.slice(0,5).map((app: any) => (
              <div key={app.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', minWidth:0 }}>
                  <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(124,58,237,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--purple-light)', fontSize:'12px', fontWeight:700, flexShrink:0 }}>
                    {app.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.name}</p>
                    <p style={{ color:'var(--text3)', fontSize:'11px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.email}</p>
                  </div>
                </div>
                <span style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'6px', padding:'2px 8px', fontSize:'10px', fontWeight:600, flexShrink:0, marginLeft:'8px' }}>Pending</span>
              </div>
            )) || <p style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0', textAlign:'center' }}>Tidak ada aplikasi terbaru</p>}
          </div>
        </div>

        {/* Active Orders */}
        <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'14px' }}>Order Aktif</h2>
            <button style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--purple-light)', fontSize:'12px', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
              Lihat Semua <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ padding:'8px 16px' }}>
            {stats?.recent_orders?.slice(0,5).map((order: any) => (
              <div key={order.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', minWidth:0 }}>
                  <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Briefcase size={14} style={{ color:'#10b981' }} />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{order.klien?.nama_lengkap||order.klien?.user?.name||'Order #'+order.id}</p>
                    <p style={{ color:'var(--text3)', fontSize:'11px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(order.tipe_layanan||order.service_type||'-').replace(/_/g,' ')}</p>
                  </div>
                </div>
                <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'6px', padding:'2px 8px', fontSize:'10px', fontWeight:600, flexShrink:0, marginLeft:'8px' }}>Aktif</span>
              </div>
            )) || <p style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0', textAlign:'center' }}>Tidak ada order aktif</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
