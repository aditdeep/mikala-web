'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { GraduationCap, Search, Eye, X, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

export default function TrainingPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('semua');

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/training/mitra')
      .then((res: any) => { setData(Array.isArray(res.data?.data) ? res.data.data : []); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch(`/internal/training/mitra/${id}/status`, { training_status: status });
      fetchData();
      if (detail) setDetail({ ...detail, training_status: status });
    } catch {}
  };

  const statusMap: any = {
    pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: Clock },
    in_progress: { label: 'Berjalan', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: TrendingUp },
    completed: { label: 'Selesai', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: CheckCircle },
    failed: { label: 'Gagal', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: XCircle },
  };

  const filtered = data.filter((d: any) => {
    const matchTab = activeTab === 'semua' || d.training_status === activeTab;
    return matchTab && JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
  });

  const counts: any = {
    semua: data.length,
    pending: data.filter((d: any) => d.training_status === 'pending').length,
    in_progress: data.filter((d: any) => d.training_status === 'in_progress').length,
    completed: data.filter((d: any) => d.training_status === 'completed').length,
  };

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Training Mitra</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>{data.length} total mitra</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {(['semua','pending','in_progress','completed'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer',
            background: activeTab === tab ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--glass)',
            color: activeTab === tab ? 'white' : 'var(--text2)',
            border: activeTab === tab ? 'none' : '1px solid var(--border)',
          }}>
            {tab === 'semua' ? 'Semua' : tab === 'in_progress' ? 'Berjalan' : tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari mitra..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      {/* Table */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
        ) : filtered.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama Mitra','Pendidikan','Status Training','Skor','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any, i: number) => {
                  const s = statusMap[item.training_status] || statusMap.pending;
                  const Icon = s.icon;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))', display:'flex', alignItems:'center', justifyContent:'center', color:'#10b981', fontSize:'13px', fontWeight:700 }}>
                            {item.user?.name?.[0]?.toUpperCase() || 'M'}
                          </div>
                          <div>
                            <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.user?.name || '-'}</p>
                            <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.user?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.pendidikan_terakhir || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          <Icon size={11} />{s.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)' }}>{item.training_score ?? '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12} />Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <GraduationCap size={40} style={{ color:'var(--text3)', opacity:0.3, margin:'0 auto 12px' }} />
            <p style={{ fontWeight:600, color:'var(--text)' }}>Belum ada data training</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail Training</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            <div style={{ textAlign:'center', marginBottom:'16px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:'20px', fontWeight:700, color:'white' }}>
                {detail.user?.name?.[0]?.toUpperCase() || 'M'}
              </div>
              <p style={{ fontWeight:700, color:'var(--text)' }}>{detail.user?.name}</p>
              <p style={{ color:'var(--text3)', fontSize:'13px' }}>{detail.user?.email}</p>
            </div>
            {[
              { label:'Pendidikan', val: detail.pendidikan_terakhir },
              { label:'Status Training', val: statusMap[detail.training_status]?.label || detail.training_status },
              { label:'Skor Training', val: detail.training_score ?? '-' },
              { label:'Selesai Training', val: detail.training_completed_at || '-' },
              { label:'Pengalaman', val: detail.pengalaman },
            ].map(f => (
              <div key={f.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px' }}>{f.label}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{f.val || '-'}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', display:'flex', gap:'8px' }}>
              {Object.entries(statusMap).map(([s, cfg]: any) => {
                const Icon = cfg.icon;
                return (
                  <button key={s} onClick={() => updateStatus(detail.id, s)} style={{ flex:1, padding:'7px', borderRadius:'10px', border:`1px solid ${cfg.border}`, background: detail.training_status === s ? cfg.bg : 'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
