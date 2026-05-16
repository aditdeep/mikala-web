'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { GraduationCap, Search, Eye, X, CheckCircle, Clock, XCircle, TrendingUp, MessageSquare, DollarSign, BarChart2, Plus, Save, Users, Star } from 'lucide-react';

const statusMap: any = {
  pending:     { label:'Pending',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)',  icon: Clock },
  in_progress: { label:'Berjalan', color:'#3b82f6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  icon: TrendingUp },
  completed:   { label:'Selesai',  color:'#10b981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)',  icon: CheckCircle },
  failed:      { label:'Gagal',    color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)',   icon: XCircle },
};

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('training');

  // Training state
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [detail, setDetail] = useState<any>(null);

  // Feedback state
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ mitra_id:'', rating:'5', catatan:'', rekomendasi:'lanjut' });
  const [savingFeedback, setSavingFeedback] = useState(false);

  // Pricing state
  const [pricing, setPricing] = useState<any[]>([]);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [editPricing, setEditPricing] = useState<any>(null);
  const [pricingForm, setPricingForm] = useState({ harga_per_jam:'', harga_per_hari:'' });
  const [savingPricing, setSavingPricing] = useState(false);

  // Report state
  const [report, setReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if (activeTab === 'feedback') fetchFeedback();
    if (activeTab === 'pricing') fetchPricing();
    if (activeTab === 'report') fetchReport();
  }, [activeTab]);

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/training/mitra')
      .then((r: any) => { setData(Array.isArray(r.data?.data) ? r.data.data : []); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  };

  const fetchFeedback = () => {
    setLoadingFeedback(true);
    apiClient.get('/internal/training/report')
      .then((r: any) => { setFeedbackList(Array.isArray(r.data?.data) ? r.data.data : []); setLoadingFeedback(false); })
      .catch(() => { setFeedbackList([]); setLoadingFeedback(false); });
  };

  const fetchPricing = () => {
    setLoadingPricing(true);
    apiClient.get('/internal/training/pricing')
      .then((r: any) => { setPricing(Array.isArray(r.data?.data) ? r.data.data : []); setLoadingPricing(false); })
      .catch(() => { setPricing([]); setLoadingPricing(false); });
  };

  const fetchReport = () => {
    setLoadingReport(true);
    Promise.all([
      apiClient.get('/internal/training/report'),
      apiClient.get('/internal/training/report/available'),
      apiClient.get('/internal/training/report/on-job'),
      apiClient.get('/internal/training/report/re-training'),
    ]).then(([all, avail, onJob, reTrain]: any) => {
      setReport({
        all: all.data?.data,
        available: avail.data?.data,
        on_job: onJob.data?.data,
        re_training: reTrain.data?.data,
      });
      setLoadingReport(false);
    }).catch(() => setLoadingReport(false));
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch('/internal/training/mitra/' + id + '/status', { training_status: status });
      fetchData();
      if (detail) setDetail({ ...detail, training_status: status });
    } catch {}
  };

  const handleSaveFeedback = async () => {
    setSavingFeedback(true);
    try {
      await apiClient.post('/internal/training/mitra/' + feedbackForm.mitra_id + '/feedback', feedbackForm);
      setShowFeedbackForm(false);
      setFeedbackForm({ mitra_id:'', rating:'5', catatan:'', rekomendasi:'lanjut' });
      fetchFeedback();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan feedback'); }
    finally { setSavingFeedback(false); }
  };

  const handleSavePricing = async () => {
    if (!editPricing) return;
    setSavingPricing(true);
    try {
      await apiClient.patch('/internal/training/pricing/' + editPricing.id, pricingForm);
      setEditPricing(null);
      fetchPricing();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan'); }
    finally { setSavingPricing(false); }
  };

  const filtered = data.filter((d: any) => {
    const matchTab = filterStatus === 'semua' || d.training_status === filterStatus;
    return matchTab && JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
  });

  const counts: any = {
    semua: data.length,
    pending: data.filter((d: any) => d.training_status === 'pending').length,
    in_progress: data.filter((d: any) => d.training_status === 'in_progress').length,
    completed: data.filter((d: any) => d.training_status === 'completed').length,
  };

  const TABS = [
    { key:'training', label:'Training', icon: GraduationCap },
    { key:'feedback', label:'Feedback', icon: MessageSquare },
    { key:'pricing',  label:'Pricing',  icon: DollarSign },
    { key:'report',   label:'Report',   icon: BarChart2 },
  ];

  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };
  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div className="space-y-4">
      <div>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Training Center</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px' }}>{data.length} total mitra terdaftar</p>
      </div>

      {/* Main Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab===t.key ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--glass)', color: activeTab===t.key ? 'white' : 'var(--text2)', border: activeTab===t.key ? 'none' : '1px solid var(--border)' }}>
              <Icon size={14}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* TAB TRAINING */}
      {activeTab === 'training' && (
        <div className="space-y-3">
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {(['semua','pending','in_progress','completed'] as const).map(tab => (
              <button key={tab} onClick={() => setFilterStatus(tab)}
                style={{ padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer', background: filterStatus===tab ? 'rgba(16,185,129,0.2)' : 'var(--glass)', color: filterStatus===tab ? '#10b981' : 'var(--text2)', border: filterStatus===tab ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)' }}>
                {tab==='semua'?'Semua':tab==='in_progress'?'Berjalan':tab.charAt(0).toUpperCase()+tab.slice(1)} ({counts[tab]})
              </button>
            ))}
          </div>
          <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
            <Search size={16} style={{ color:'var(--text3)' }} />
            <input placeholder="Cari mitra..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
          </div>
          <div style={cardStyle}>
            {loading ? (
              <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
            ) : filtered.length > 0 ? (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                  <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {['Nama Mitra','Pendidikan','Status','Skor','Aksi'].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map((item: any, i: number) => {
                      const s = statusMap[item.training_status] || statusMap.pending;
                      const Icon = s.icon;
                      return (
                        <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                          <td style={{ padding:'12px 16px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#10b981', fontSize:'13px', fontWeight:700 }}>
                                {item.user?.name?.[0]?.toUpperCase()||'M'}
                              </div>
                              <div>
                                <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.user?.name||'-'}</p>
                                <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.user?.email||''}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.pendidikan_terakhir||'-'}</td>
                          <td style={{ padding:'12px 16px' }}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                              <Icon size={11}/>{s.label}
                            </span>
                          </td>
                          <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)' }}>{item.training_score??'-'}</td>
                          <td style={{ padding:'12px 16px' }}>
                            <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer' }}>
                              <Eye size={12}/>Detail
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
        </div>
      )}

      {/* TAB FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ color:'var(--text3)', fontSize:'13px' }}>Feedback pelatihan mitra</p>
            <button onClick={() => setShowFeedbackForm(true)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
              <Plus size={14}/>Tambah Feedback
            </button>
          </div>
          <div style={cardStyle}>
            {loadingFeedback ? (
              <div style={{ padding:'20px' }}>{[1,2].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'60px', marginBottom:'8px' }} />)}</div>
            ) : feedbackList.length > 0 ? (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                  <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {['Mitra','Rating','Rekomendasi','Catatan'].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {feedbackList.map((item: any, i: number) => (
                      <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.mitra?.user?.name||item.nama_mitra||'-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', gap:'2px' }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={13} style={{ color: s<=(item.rating||0)?'#f59e0b':'var(--border)', fill: s<=(item.rating||0)?'#f59e0b':'none' }} />)}
                          </div>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:600, background: item.rekomendasi==='lanjut'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color: item.rekomendasi==='lanjut'?'#10b981':'#ef4444' }}>
                            {item.rekomendasi==='lanjut'?'Lanjut':'Stop'}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.catatan||'-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'40px' }}>
                <MessageSquare size={36} style={{ color:'var(--text3)', opacity:0.3, margin:'0 auto 10px' }} />
                <p style={{ color:'var(--text3)', fontSize:'13px' }}>Belum ada feedback</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB PRICING */}
      {activeTab === 'pricing' && (
        <div className="space-y-3">
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Fee mitra per tipe layanan</p>
          <div style={cardStyle}>
            {loadingPricing ? (
              <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
            ) : pricing.length > 0 ? (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                  <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {['Tipe Layanan','Harga/Jam','Harga/Hari','Aksi'].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {pricing.map((item: any, i: number) => (
                      <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontWeight:600, fontSize:'13px', color:'var(--text)', textTransform:'capitalize' }}>{item.tipe_layanan?.replace(/_/g,' ')||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)' }}>
                          {editPricing?.id===item.id ? (
                            <input value={pricingForm.harga_per_jam} onChange={e => setPricingForm(p => ({...p, harga_per_jam: e.target.value}))} style={{...inp, width:'120px'}} placeholder="0" />
                          ) : (
                            'Rp '+(Number(item.harga_per_jam)||0).toLocaleString('id')
                          )}
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)' }}>
                          {editPricing?.id===item.id ? (
                            <input value={pricingForm.harga_per_hari} onChange={e => setPricingForm(p => ({...p, harga_per_hari: e.target.value}))} style={{...inp, width:'120px'}} placeholder="0" />
                          ) : (
                            'Rp '+(Number(item.harga_per_hari)||0).toLocaleString('id')
                          )}
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          {editPricing?.id===item.id ? (
                            <div style={{ display:'flex', gap:'6px' }}>
                              <button onClick={handleSavePricing} disabled={savingPricing} style={{ padding:'5px 12px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'8px', color:'white', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                                <Save size={12}/>
                              </button>
                              <button onClick={() => setEditPricing(null)} style={{ padding:'5px 10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', fontSize:'12px', cursor:'pointer' }}>
                                <X size={12}/>
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditPricing(item); setPricingForm({ harga_per_jam: item.harga_per_jam||'', harga_per_hari: item.harga_per_hari||'' }); }}
                              style={{ padding:'5px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer' }}>
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'40px' }}>
                <DollarSign size={36} style={{ color:'var(--text3)', opacity:0.3, margin:'0 auto 10px' }} />
                <p style={{ color:'var(--text3)', fontSize:'13px' }}>Belum ada data pricing</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-3">
          {loadingReport ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat report...</div>
          ) : report ? (
            <>
              {/* Summary cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'12px' }}>
                {[
                  { label:'Total Mitra', value: report.all?.total||data.length, color:'#7c3aed', icon: Users },
                  { label:'Available', value: report.available?.total||0, color:'#10b981', icon: CheckCircle },
                  { label:'On Job', value: report.on_job?.total||0, color:'#3b82f6', icon: TrendingUp },
                  { label:'Re-Training', value: report.re_training?.total||0, color:'#f59e0b', icon: GraduationCap },
                ].map(card => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                        <div style={{ width:'32px', height:'32px', borderRadius:'10px', background: card.color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Icon size={15} style={{ color: card.color }} />
                        </div>
                        <p style={{ color:'var(--text3)', fontSize:'12px' }}>{card.label}</p>
                      </div>
                      <p style={{ fontWeight:700, fontSize:'24px', color: card.color }}>{card.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Status breakdown */}
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>Status Training</p>
                {Object.entries(counts).filter(([k]) => k !== 'semua').map(([status, count]: any) => {
                  const s = statusMap[status];
                  const pct = data.length > 0 ? Math.round((count/data.length)*100) : 0;
                  return (
                    <div key={status} style={{ marginBottom:'10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                        <span style={{ fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{s?.label||status}</span>
                        <span style={{ fontSize:'12px', color:'var(--text3)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width: pct+'%', background: s?.color||'#7c3aed', borderRadius:'3px', transition:'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Gagal memuat report</div>
          )}
        </div>
      )}

      {/* Modal Detail */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail Training</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <div style={{ textAlign:'center', marginBottom:'16px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:'20px', fontWeight:700, color:'white' }}>
                {detail.user?.name?.[0]?.toUpperCase()||'M'}
              </div>
              <p style={{ fontWeight:700, color:'var(--text)' }}>{detail.user?.name}</p>
              <p style={{ color:'var(--text3)', fontSize:'13px' }}>{detail.user?.email}</p>
            </div>
            {[
              { label:'Pendidikan', val: detail.pendidikan_terakhir },
              { label:'Status Training', val: statusMap[detail.training_status]?.label||detail.training_status },
              { label:'Skor Training', val: detail.training_score??'-' },
              { label:'Selesai Training', val: detail.training_completed_at||'-' },
              { label:'Pengalaman', val: detail.pengalaman },
            ].map(f => (
              <div key={f.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px' }}>{f.label}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{f.val||'-'}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px' }}>
              <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>Update Status:</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {Object.entries(statusMap).map(([s, cfg]: any) => (
                  <button key={s} onClick={() => updateStatus(detail.id, s)}
                    style={{ flex:1, minWidth:'80px', padding:'7px', borderRadius:'10px', border:'1px solid '+cfg.border, background: detail.training_status===s ? cfg.bg : 'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Feedback Form */}
      {showFeedbackForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', borderRadius:'20px', padding:'24px', width:'100%', maxWidth:'420px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h3 style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>Form Feedback Pelatihan</h3>
              <button onClick={() => setShowFeedbackForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={15}/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Pilih Mitra</label>
                <select value={feedbackForm.mitra_id} onChange={e => setFeedbackForm(p => ({...p, mitra_id: e.target.value}))} style={inp}>
                  <option value="">-- Pilih Mitra --</option>
                  {data.map((m: any) => <option key={m.id} value={m.id}>{m.user?.name||'Mitra #'+m.id}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Rating (1-5)</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setFeedbackForm(p => ({...p, rating: String(n)}))}
                      style={{ width:'40px', height:'40px', borderRadius:'10px', border:'1px solid var(--border)', background: Number(feedbackForm.rating)>=n?'rgba(245,158,11,0.2)':'var(--glass)', cursor:'pointer', color: Number(feedbackForm.rating)>=n?'#f59e0b':'var(--text3)', fontWeight:700 }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Rekomendasi</label>
                <select value={feedbackForm.rekomendasi} onChange={e => setFeedbackForm(p => ({...p, rekomendasi: e.target.value}))} style={inp}>
                  <option value="lanjut">Lanjut ke Lapangan</option>
                  <option value="stop">Stop / Tidak Direkomendasikan</option>
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Catatan</label>
                <textarea value={feedbackForm.catatan} onChange={e => setFeedbackForm(p => ({...p, catatan: e.target.value}))} style={{...inp, minHeight:'80px', resize:'vertical'}} placeholder="Catatan evaluasi pelatihan..." />
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'16px' }}>
              <button onClick={() => setShowFeedbackForm(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
              <button onClick={handleSaveFeedback} disabled={savingFeedback||!feedbackForm.mitra_id}
                style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', opacity: savingFeedback||!feedbackForm.mitra_id?0.6:1 }}>
                {savingFeedback?'Menyimpan...':'Simpan Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
