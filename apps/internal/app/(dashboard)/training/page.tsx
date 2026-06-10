'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { GraduationCap, Search, Eye, X, CheckCircle, Clock, XCircle, TrendingUp, MessageSquare, DollarSign, BarChart2, Plus, Save, Users, Star, CheckCircle2, Circle, ChevronDown, ChevronRight, ClipboardList } from 'lucide-react';

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
  const [feedbackForm, setFeedbackForm] = useState({ mitra_id:'', score:'80', feedback:'', rekomendasi:'lanjut' });
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

  // Checklist state
  const [checklistMitra, setChecklistMitra] = useState<any>(null);
  const [searchMitra, setSearchMitra] = useState('');
  const [ratingPopup, setRatingPopup] = useState<any>(null);
const [tempRating, setTempRating] = useState(5);
  const [selectedMitraId, setSelectedMitraId] = useState<number|null>(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [savingCheck, setSavingCheck] = useState<number|null>(null);
  const [defaultTgl, setDefaultTgl] = useState(new Date().toISOString().split('T')[0]);
  const [defaultPengajar, setDefaultPengajar] = useState('');
  const [openKat, setOpenKat] = useState<string[]>(['Dasar','PHC']);
  const [checkInputs, setCheckInputs] = useState<Record<number,{tanggal:string,pengajar:string}>>({});

  useEffect(() => { fetchData(); }, []);

  const fetchChecklist = async (mitraId: number) => {
    setLoadingChecklist(true);
    setSelectedMitraId(mitraId);
    try {
      const r: any = await apiClient.get(`/internal/training/mitra/${mitraId}/progress`);
      setChecklistMitra(r.data);
    } catch {}
    setLoadingChecklist(false);
  };

  const handleCheckClick = (materiId: number, materiNama: string, checked: boolean) => {
    if (checked) {
      // Sudah dicentang — langsung uncheck
      toggleCheck(materiId, checked, 0);
    } else {
      // Belum dicentang — tampilkan popup rating
      setRatingPopup({ materiId, materiNama, isCheck: true });
      setTempRating(5);
    }
  };

  const submitRating = async () => {
    if (!ratingPopup) return;
    await toggleCheck(ratingPopup.materiId, false, tempRating);
    setRatingPopup(null);
  };

  const toggleCheck = async (materiId: number, checked: boolean, rating: number = 5) => {
    if (!selectedMitraId) return;
    const tgl      = checkInputs[materiId]?.tanggal || defaultTgl;
    const pengajar = checkInputs[materiId]?.pengajar || defaultPengajar;
    if (!checked && !pengajar) { alert('Isi nama pengajar terlebih dahulu'); return; }
    setSavingCheck(materiId);
    try {
      await apiClient.post(`/internal/training/mitra/${selectedMitraId}/checklist/${materiId}`, {
        rating: rating,
        
        tanggal_dapat: tgl, pengajar: pengajar || 'Trainer',
      });
      fetchChecklist(selectedMitraId);
    } catch {}
    setSavingCheck(null);
  };
  useEffect(() => {
    if (activeTab === 'feedback') fetchFeedback();
    if (activeTab === 'pricing') fetchPricing();
    if (activeTab === 'report') fetchReport();
    if (activeTab === 'checklist' && data.length === 0) fetchData();
  }, [activeTab]);

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/training/mitra')
      .then((r: any) => { console.log('TRAINING API:', JSON.stringify(r.data)); setData(Array.isArray(r.data?.data) ? r.data.data : []); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  };

  const fetchFeedback = () => {
    setLoadingFeedback(true);
    apiClient.get('/internal/training/feedback')
      .then((r: any) => { const d = r.data?.data; setFeedbackList(Array.isArray(d) ? d : []); setLoadingFeedback(false); })
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
      apiClient.get('/internal/training/feedback'),
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
      await apiClient.post('/internal/training/mitra/' + feedbackForm.mitra_id + '/feedback', { score: Number(feedbackForm.score), feedback: feedbackForm.feedback, rekomendasi: feedbackForm.rekomendasi });
      setShowFeedbackForm(false);
      setFeedbackForm({ mitra_id:'', score:'80', feedback:'', rekomendasi:'lanjut' });
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
    { key:'training',  label:'Training',  icon: GraduationCap },
    { key:'checklist', label:'Checklist', icon: ClipboardList },
    { key:'feedback',  label:'Feedback',  icon: MessageSquare },
    { key:'pricing',   label:'Pricing',   icon: DollarSign },
    { key:'report',    label:'Report',    icon: BarChart2 },
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

      {/* TAB CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {/* Pilih Mitra */}
          <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
            <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', marginBottom:'10px' }}>Pilih Mitra</p>
<input type="text" placeholder="Cari nama mitra..." value={searchMitra} onChange={(e) => setSearchMitra(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '13px', outline: 'none', marginBottom: '8px' }} />
            <select
              value={selectedMitraId||''}
              onChange={e => e.target.value && fetchChecklist(Number(e.target.value))}
              style={{ width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' }}>
              <option value="">-- Pilih mitra untuk ceklis materi --</option>
              {data.filter((m: any) => !searchMitra || m.nama_lengkap?.toLowerCase().includes(searchMitra.toLowerCase())).map((m: any) => (
                <option key={m.id} value={m.id}>{m.user?.name||m.nama_lengkap} ({m.training_persen||0}%)</option>
              ))}
            </select>
          </div>

          {loadingChecklist && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat checklist...</div>}

          {checklistMitra && !loadingChecklist && (
            <>
              {/* Summary */}
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'15px', color:'var(--text)' }}>{checklistMitra.mitra?.nama}</p>
                    <p style={{ fontSize:'12px', color:'var(--text3)' }}>{checklistMitra.selesai}/{checklistMitra.total} materi ({checklistMitra.persen}%)</p>
                {checklistMitra.nilai_rata > 0 && (
                  <p style={{ fontSize:'12px', color:'#fbbf24', fontWeight:700, marginTop:'2px' }}>★ Nilai Rata-rata: {Number(checklistMitra.nilai_rata).toFixed(2)} / 5.0</p>
                )}
                {checklistMitra.status_lulus === 'lulus' && (
                  <div style={{ marginTop:'8px', padding:'8px 12px', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.4)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px' }}>
                    <span style={{ color:'#10b981', fontSize:'12px', fontWeight:700 }}>🏆 LULUS</span>
                    {!checklistMitra.sertifikat ? (
                      <button onClick={async () => {
                        if (!confirm('Terbitkan sertifikat untuk mitra ini?')) return;
                        try {
                          await apiClient.post(`/internal/training/mitra/${selectedMitraId}/sertifikat`, {});
                          alert('✅ Sertifikat berhasil diterbitkan!');
                          fetchChecklist(selectedMitraId);
                        } catch (e: any) {
                          alert('Error: ' + (e?.response?.data?.message || 'Gagal terbitkan'));
                        }
                      }} style={{ background:'#10b981', border:'none', borderRadius:'8px', padding:'5px 10px', color:'white', fontSize:'11px', fontWeight:700, cursor:'pointer' }}>
                        + Terbitkan Sertifikat
                      </button>
                    ) : (
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        <span style={{ color:'var(--text3)', fontSize:'10px' }}>✓ {checklistMitra.sertifikat.nomor_sertifikat}</span>
                        {checklistMitra.sertifikat.url_pdf && (
                          <a href={checklistMitra.sertifikat.url_pdf} target="_blank" rel="noopener noreferrer"
                            style={{ background:'#10b981', borderRadius:'6px', padding:'4px 8px', color:'white', fontSize:'10px', fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                            📄 View PDF
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {checklistMitra.status_lulus === 'tidak_lulus' && (
                  <p style={{ marginTop:'6px', color:'#ef4444', fontSize:'12px', fontWeight:600 }}>❌ Tidak Lulus (nilai &lt; 4.5)</p>
                )}
                  </div>
                  <div style={{ fontSize:'24px', fontWeight:800, color: checklistMitra.persen===100?'#10b981':'var(--purple-light)' }}>{checklistMitra.persen}%</div>
                </div>
                <div style={{ height:'8px', background:'rgba(255,255,255,0.08)', borderRadius:'99px', overflow:'hidden', marginBottom:'14px' }}>
                  <div style={{ height:'100%', borderRadius:'99px', width:`${checklistMitra.persen}%`, background: checklistMitra.persen===100?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#7c3aed,#4f46e5)' }}/>
                </div>
                {/* Progress per kategori */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'14px' }}>
                  {checklistMitra.by_kategori?.map((k: any) => (
                    <div key={k.kategori} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                        <span style={{ fontSize:'12px', fontWeight:600, color: k.kategori==='PHC'?'#0ea5e9':'#7c3aed' }}>{k.kategori}</span>
                        <span style={{ fontSize:'11px', color:'var(--text3)' }}>{k.selesai}/{k.total}</span>
                      </div>
                      <div style={{ height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'99px' }}>
                        <div style={{ height:'100%', borderRadius:'99px', width:`${k.persen}%`, background: k.kategori==='PHC'?'#0ea5e9':'#7c3aed' }}/>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Default input */}
                <div style={{ borderTop:'1px solid var(--border)', paddingTop:'12px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  <div>
                    <label style={{ fontSize:'11px', color:'var(--text3)', display:'block', marginBottom:'4px' }}>Tanggal Default</label>
                    <input type="date" value={defaultTgl} onChange={e => setDefaultTgl(e.target.value)}
                      style={{ width:'100%', padding:'7px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'12px', outline:'none' }}/>
                  </div>
                  <div>
                    <label style={{ fontSize:'11px', color:'var(--text3)', display:'block', marginBottom:'4px' }}>Pengajar Default *</label>
                    <input value={defaultPengajar} onChange={e => setDefaultPengajar(e.target.value)} placeholder="Nama trainer..."
                      style={{ width:'100%', padding:'7px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'12px', outline:'none' }}/>
                  </div>
                </div>
              </div>

              {/* Materi per kategori */}
              {['Dasar','PHC'].map(kat => {
                const katData = checklistMitra.by_kategori?.find((k: any) => k.kategori === kat);
                const items = katData?.materi || [];
                const isOpen = openKat.includes(kat);
                const selesai = items.filter((m: any) => m.checked).length;
                const katColor = kat==='PHC'?'#0ea5e9':'#7c3aed';
                return (
                  <div key={kat} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', overflow:'hidden' }}>
                    <button onClick={() => setOpenKat(prev => prev.includes(kat)?prev.filter(k=>k!==kat):[...prev,kat])}
                      style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'transparent', border:'none', cursor:'pointer' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <span style={{ fontSize:'13px', fontWeight:700, color:katColor }}>Materi {kat}</span>
                        <span style={{ fontSize:'11px', color:'var(--text3)', background:'var(--bg)', padding:'2px 8px', borderRadius:'99px' }}>{selesai}/{items.length}</span>
                      </div>
                      {isOpen ? <ChevronDown size={16} style={{ color:'var(--text3)' }}/> : <ChevronRight size={16} style={{ color:'var(--text3)' }}/>}
                    </button>
                    {isOpen && (
                      <div style={{ borderTop:'1px solid var(--border)' }}>
                        {items.map((m: any) => {
                          const indent = m.parent_kode ? (m.kode?.split('-').length > 2 ? 40 : 20) : 0;
                          const isSaving = savingCheck === m.id;
                          return (
                            <div key={m.id} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:`10px 16px`, paddingLeft:`${16+indent}px`, borderBottom:'1px solid rgba(255,255,255,0.04)', background: m.checked?'rgba(16,185,129,0.04)':'transparent' }}>
                              <button onClick={() => handleCheckClick(m.id, m.nama, m.checked)} disabled={isSaving}
                                style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', flexShrink:0, marginTop:'1px' }}>
                                {isSaving
                                  ? <div style={{ width:'18px', height:'18px', borderRadius:'50%', border:'2px solid rgba(124,58,237,0.3)', borderTopColor:'#7c3aed' }}/>
                                  : m.checked
                                    ? <CheckCircle2 size={18} style={{ color:'#10b981' }}/>
                                    : <Circle size={18} style={{ color:'var(--text3)' }}/>}
                              </button>
                              <div style={{ flex:1, minWidth:0 }}>
                                <p style={{ fontSize:'13px', color: m.checked?'var(--text3)':'var(--text)', textDecoration: m.checked?'line-through':'none', lineHeight:'1.4' }}>
                                  <span style={{ color:'var(--text3)', fontSize:'11px', marginRight:'6px' }}>{m.kode}</span>{m.nama}
                                </p>
                                {m.checked && (
                                  <p style={{ fontSize:'11px', color:'#10b981', marginTop:'2px' }}>
                                    ✓ {m.tanggal_dapat} · {m.pengajar}
                                    {m.checked_by && <span style={{ color:'var(--text3)' }}> · oleh {m.checked_by}</span>}
                                  </p>
                                )}
                                {!m.checked && !m.parent_kode && (
                                  <div style={{ display:'flex', gap:'6px', marginTop:'6px' }}>
                                    <input type="date" defaultValue={defaultTgl}
                                      onChange={e => setCheckInputs(prev=>({...prev,[m.id]:{...prev[m.id],tanggal:e.target.value}}))}
                                      style={{ padding:'4px 8px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'6px', color:'var(--text)', fontSize:'11px', outline:'none' }}/>
                                    <input placeholder="Pengajar" defaultValue={defaultPengajar}
                                      onChange={e => setCheckInputs(prev=>({...prev,[m.id]:{...prev[m.id],pengajar:e.target.value}}))}
                                      style={{ flex:1, padding:'4px 8px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'6px', color:'var(--text)', fontSize:'11px', outline:'none' }}/>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
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
                            {[1,2,3,4,5].map(s => <Star key={s} size={13} style={{ color: s<=Math.round((item.score||0)/20)?'#f59e0b':'var(--border)', fill: s<=Math.round((item.score||0)/20)?'#f59e0b':'none' }} />)}
                          </div>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:600, background: item.rekomendasi==='stop'?'rgba(239,68,68,0.15)':'rgba(16,185,129,0.15)', color: item.rekomendasi==='stop'?'#ef4444':'#10b981' }}>
                            {item.rekomendasi==='lanjut'?'Lanjut ke Lapangan':item.rekomendasi==='stop'?'Stop':'Lanjut ke Lapangan'}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.feedback||item.catatan||'-'}</td>
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
                    <button type="button" key={n} onClick={() => setFeedbackForm(p => ({...p, score: String(n*20)}))}
                      style={{ width:'40px', height:'40px', borderRadius:'10px', border:'1px solid var(--border)', background: Number(feedbackForm.score)>=(n*20)?'rgba(245,158,11,0.2)':'var(--glass)', cursor:'pointer', color: Number(feedbackForm.score)>=(n*20)?'#f59e0b':'var(--text3)', fontWeight:700 }}>
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
                <textarea value={feedbackForm.feedback} onChange={e => setFeedbackForm(p => ({...p, feedback: e.target.value}))} style={{...inp, minHeight:'80px', resize:'vertical'}} placeholder="Catatan evaluasi pelatihan..." />
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

      {/* Modal Rating Popup */}
      {ratingPopup && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:'20px' }}>
          <div style={{ background:'var(--bg)', borderRadius:'20px', padding:'24px', maxWidth:'420px', width:'100%', border:'1px solid var(--border)' }}>
            <h3 style={{ fontSize:'18px', fontWeight:800, color:'var(--text)', marginBottom:'6px' }}>Beri Penilaian</h3>
            <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'20px' }}>{ratingPopup.materiNama}</p>

            <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', padding:'20px', marginBottom:'16px', textAlign:'center' }}>
              <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'12px' }}>Nilai pemahaman mitra (0–5 bintang)</p>
              <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'12px' }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setTempRating(star)}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:'4px', fontSize:'32px', color: star <= tempRating ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}>
                    {star <= tempRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <p style={{ fontSize:'24px', fontWeight:800, color:'#fbbf24' }}>{tempRating}.0 / 5.0</p>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>
                {tempRating >= 5 ? '🌟 Sangat Baik' : tempRating >= 4 ? '👍 Baik' : tempRating >= 3 ? '⚠️ Cukup' : '❌ Kurang'}
              </p>
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setRatingPopup(null)}
                style={{ flex:1, padding:'11px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontWeight:600, cursor:'pointer' }}>
                Batal
              </button>
              <button onClick={submitRating}
                style={{ flex:2, padding:'11px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, cursor:'pointer' }}>
                Simpan Ceklis + Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
