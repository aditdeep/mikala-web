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
    { title:'Revenue Bulan Ini', value: `Rp ${((stats?.total_revenue || 0)/1000000).toFixed(1)}Jt`, icon: DollarSign, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)', glow:'rgba(236,72,153,0.3)', trend:{ value:'+23%', isPositive:true } },
    { title:'Pending Items', value: stats?.pending_items?.new_applications || 0, icon: Clock, gradient:'linear-gradient(135deg, #f59e0b, #d97706)', glow:'rgba(245,158,11,0.3)' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:'24px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>Dashboard</h1>
          <p style={{ color:'var(--text3)', fontSize:'14px' }}>Selamat datang kembali! Ini ringkasan hari ini.</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 14px', background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'12px' }}>
          <TrendingUp size={15} style={{ color:'var(--purple-light)' }} />
          <span style={{ fontSize:'13px', fontWeight:500, color:'var(--text2)' }}>Live Data</span>
          <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }}/>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'20px', height:'120px' }} />)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px' }}>
          {statCards.map(card => <StatsCard key={card.title} {...card} />)}
        </div>
      )}

      {/* Tables */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        {/* Recent Applications */}
        <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          <div style={{ padding:'20px', paddingBottom:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Aplikasi Terbaru</h2>
            <button style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--purple-light)', fontSize:'12px', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
              Lihat Semua <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ padding:'12px 20px' }}>
            {stats?.recent_applications?.slice(0,5).map((app: any) => (
              <div key={app.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--purple-light)', fontSize:'13px', fontWeight:700 }}>
                    {app.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{app.name}</p>
                    <p style={{ color:'var(--text3)', fontSize:'11px' }}>{app.email}</p>
                  </div>
                </div>
                <span style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'6px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>Pending</span>
              </div>
            )) || <p style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0', textAlign:'center' }}>Tidak ada aplikasi terbaru</p>}
          </div>
        </div>

        {/* Active Orders */}
        <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          <div style={{ padding:'20px', paddingBottom:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Order Aktif</h2>
            <button style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--purple-light)', fontSize:'12px', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
              Lihat Semua <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ padding:'12px 20px' }}>
            {stats?.recent_orders?.slice(0,5).map((order: any) => (
              <div key={order.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Briefcase size={15} style={{ color:'#10b981' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>Order #{order.id}</p>
                    <p style={{ color:'var(--text3)', fontSize:'11px' }}>{order.service_type}</p>
                  </div>
                </div>
                <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'6px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>Aktif</span>
              </div>
            )) || <p style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0', textAlign:'center' }}>Tidak ada order aktif</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
