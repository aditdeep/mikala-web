'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Search, Eye, X, Plus, TrendingUp, TrendingDown, FileText, BookOpen, BarChart2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const statusTagihan: any = {
  paid:      { label:'Lunas',       color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
  unpaid:    { label:'Belum Bayar', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)' },
  partial:   { label:'Sebagian',    color:'#3b82f6', bg:'rgba(59,130,246,0.15)', border:'rgba(59,130,246,0.3)' },
  overdue:   { label:'Jatuh Tempo', color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)' },
  cancelled: { label:'Dibatalkan',  color:'#6b7280', bg:'rgba(107,114,128,0.15)',border:'rgba(107,114,128,0.3)' },
};

const TABS = [
  { key:'tagihan',  label:'Tagihan',  icon: FileText },
  { key:'payroll',  label:'Payroll',  icon: DollarSign },
  { key:'jurnal',   label:'Jurnal',   icon: BookOpen },
  { key:'report',   label:'Report',   icon: BarChart2 },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('tagihan');
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [jurnal, setJurnal] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingJurnal, setLoadingJurnal] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [klienList, setKlienList] = useState<any[]>([]);

  // Form tagihan
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ klien_id:'', subtotal:'', pajak:'0', diskon:'0', tanggal_jatuh_tempo:'', catatan:'' });

  // Generate payroll
  const [showGeneratePayroll, setShowGeneratePayroll] = useState(false);
  const [generatingPayroll, setGeneratingPayroll] = useState(false);
  const [periodePayroll, setPeriodePayroll] = useState('');

  // Form jurnal
  const [showFormJurnal, setShowFormJurnal] = useState(false);
  const [savingJurnal, setSavingJurnal] = useState(false);
  const [formJurnal, setFormJurnal] = useState({ tipe:'income', kategori:'', deskripsi:'', jumlah:'', tanggal:'' });

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (activeTab === 'jurnal') fetchJurnal();
    if (activeTab === 'report') fetchReport();
  }, [activeTab]);

  const fetchAll = () => {
    setLoading(true);
    apiClient.get('/internal/klien-list').then((r: any) => {
      setKlienList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => {});
    Promise.all([
      apiClient.get('/internal/finance/tagihan').then((r: any) => {
        const d = r.data?.data;
        setTagihan(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }),
      apiClient.get('/internal/finance/payroll').then((r: any) => {
        const d = r.data?.data;
        setPayroll(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }),
    ]).finally(() => setLoading(false));
  };

  const fetchJurnal = () => {
    setLoadingJurnal(true);
    apiClient.get('/internal/finance/jurnal').then((r: any) => {
      const d = r.data?.data;
      setJurnal(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      setLoadingJurnal(false);
    }).catch(() => setLoadingJurnal(false));
  };

  const fetchReport = () => {
    setLoadingReport(true);
    Promise.all([
      apiClient.get('/internal/finance/report/income'),
      apiClient.get('/internal/finance/report/outcome'),
      apiClient.get('/internal/finance/report/saldo'),
      apiClient.get('/internal/finance/report/piutang'),
    ]).then(([income, outcome, saldo, piutang]: any) => {
      setReport({
        income:  income.data?.data,
        outcome: outcome.data?.data,
        saldo:   saldo.data?.data,
        piutang: piutang.data?.data,
      });
      setLoadingReport(false);
    }).catch(() => setLoadingReport(false));
  };

  const handleCreateTagihan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/finance/tagihan', form);
      setShowForm(false);
      setForm({ klien_id:'', subtotal:'', pajak:'0', diskon:'0', tanggal_jatuh_tempo:'', catatan:'' });
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal membuat tagihan'); }
    finally { setSaving(false); }
  };

  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingPayroll(true);
    try {
      const res: any = await apiClient.post('/internal/finance/payroll/generate', { periode: periodePayroll });
      const count = res.data?.data?.length || 0;
      alert('Berhasil generate ' + count + ' payroll untuk periode ' + periodePayroll);
      setShowGeneratePayroll(false);
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal generate payroll'); }
    finally { setGeneratingPayroll(false); }
  };

  const handleCreateJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJurnal(true);
    try {
      await apiClient.post('/internal/finance/jurnal', formJurnal);
      setShowFormJurnal(false);
      setFormJurnal({ tipe:'income', kategori:'', deskripsi:'', jumlah:'', tanggal:'' });
      fetchJurnal();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan jurnal'); }
    finally { setSavingJurnal(false); }
  };

  const updateTagihanStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch('/internal/finance/tagihan/' + id + '/status', { status });
      fetchAll();
      if (detail) setDetail({ ...detail, status });
    } catch {}
  };

  const totalTagihan = tagihan.reduce((a, b) => a + (Number(b.total) || 0), 0);
  const totalPaid    = tagihan.filter(t => t.status === 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);
  const totalPayroll = payroll.reduce((a, b) => a + (Number(b.amount) || 0), 0);

  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };

  return (
    <div className="space-y-4">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Finance</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola tagihan, payroll & jurnal keuangan</p>
        </div>
        {activeTab === 'tagihan' && (
          <button onClick={() => setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #f59e0b, #d97706)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Buat Tagihan
          </button>
        )}
        {activeTab === 'payroll' && (
          <button onClick={() => setShowGeneratePayroll(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Generate Payroll
          </button>
        )}
        {activeTab === 'jurnal' && (
          <button onClick={() => setShowFormJurnal(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #f59e0b, #d97706)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Tambah Jurnal
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
        {[
          { icon: TrendingUp,   label:'Total Tagihan',  value: 'Rp '+(totalTagihan/1000000).toFixed(1)+'Jt', gradient:'linear-gradient(135deg, #f59e0b, #d97706)' },
          { icon: DollarSign,   label:'Sudah Dibayar',  value: 'Rp '+(totalPaid/1000000).toFixed(1)+'Jt',    gradient:'linear-gradient(135deg, #10b981, #059669)' },
          { icon: TrendingDown, label:'Total Payroll',  value: 'Rp '+(totalPayroll/1000000).toFixed(1)+'Jt', gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)' },
          { icon: FileText,     label:'Jumlah Tagihan', value: tagihan.length,                                gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'12px', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={17} color="white" />
                </div>
                <div>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{s.label}</p>
                  <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab===t.key ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--glass)', color: activeTab===t.key ? 'white' : 'var(--text2)', border: activeTab===t.key ? 'none' : '1px solid var(--border)' }}>
              <Icon size={14}/>{t.label}
              {t.key==='tagihan' && ` (${tagihan.length})`}
              {t.key==='payroll' && ` (${payroll.length})`}
            </button>
          );
        })}
      </div>

      {/* Search */}
      {['tagihan','payroll','jurnal'].includes(activeTab) && (
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
          <Search size={16} style={{ color:'var(--text3)' }} />
          <input placeholder="Cari data..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
        </div>
      )}

      {/* TAB TAGIHAN */}
      {activeTab === 'tagihan' && (
        <div style={cardStyle}>
          {loading ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Invoice #','Klien','Jumlah','Jatuh Tempo','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {tagihan.filter(t => JSON.stringify(t).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                    const s = statusTagihan[item.status] || statusTagihan.unpaid;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>#{item.id}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.klien?.nama_lengkap||item.klien?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#10b981' }}>Rp {Number(item.total||0).toLocaleString('id')}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.tanggal_jatuh_tempo||item.due_date ? new Date(item.tanggal_jatuh_tempo||item.due_date).toLocaleDateString('id-ID') : '-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.label}</span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'8px', color:'#f59e0b', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {tagihan.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada tagihan</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB PAYROLL */}
      {activeTab === 'payroll' && (
        <div style={cardStyle}>
          {loading ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Payroll #','Mitra','Jumlah','Periode','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {payroll.filter(p => JSON.stringify(p).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                    const s = statusTagihan[item.status] || statusTagihan.unpaid;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>#{item.id}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#10b981' }}>Rp {Number(item.amount||0).toLocaleString('id')}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.periode||item.payment_date||'-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.label}</span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {payroll.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data payroll</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB JURNAL */}
      {activeTab === 'jurnal' && (
        <div style={cardStyle}>
          {loadingJurnal ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Tanggal','Tipe','Kategori','Deskripsi','Jumlah'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {jurnal.filter(j => JSON.stringify(j).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => (
                    <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background: item.tipe==='income'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color: item.tipe==='income'?'#10b981':'#ef4444', border:'1px solid '+(item.tipe==='income'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'), borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          {item.tipe==='income' ? <ArrowUpCircle size={11}/> : <ArrowDownCircle size={11}/>}
                          {item.tipe==='income' ? 'Income' : 'Outcome'}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{item.kategori||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.deskripsi||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color: item.tipe==='income'?'#10b981':'#ef4444' }}>
                        {item.tipe==='income'?'+':'-'} Rp {Number(item.jumlah||0).toLocaleString('id')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jurnal.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data jurnal</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-3">
          {loadingReport ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat report...</div>
          ) : report ? (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'12px' }}>
                {[
                  { label:'Total Income',   value: 'Rp '+(Number(report.income?.total||0)/1000000).toFixed(1)+'Jt',   color:'#10b981', icon: ArrowUpCircle },
                  { label:'Total Outcome',  value: 'Rp '+(Number(report.outcome?.total||0)/1000000).toFixed(1)+'Jt',  color:'#ef4444', icon: ArrowDownCircle },
                  { label:'Saldo',          value: 'Rp '+(Number(report.saldo?.saldo||0)/1000000).toFixed(1)+'Jt',    color:'#3b82f6', icon: DollarSign },
                  { label:'Piutang',        value: 'Rp '+(Number(report.piutang?.total||totalTagihan-totalPaid)/1000000).toFixed(1)+'Jt', color:'#f59e0b', icon: TrendingUp },
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
                      <p style={{ fontWeight:700, fontSize:'20px', color: card.color }}>{card.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Status tagihan breakdown */}
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>Status Tagihan</p>
                {Object.entries(statusTagihan).map(([status, cfg]: any) => {
                  const count = tagihan.filter(t => t.status === status).length;
                  const pct = tagihan.length > 0 ? Math.round((count/tagihan.length)*100) : 0;
                  return (
                    <div key={status} style={{ marginBottom:'10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                        <span style={{ fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{cfg.label}</span>
                        <span style={{ fontSize:'12px', color:'var(--text3)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width: pct+'%', background: cfg.color, borderRadius:'3px', transition:'width 0.5s' }} />
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

      {/* Modal Form Tagihan */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Buat Tagihan Baru</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleCreateTagihan} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Klien</label>
                <select value={form.klien_id} onChange={e => setForm(p => ({...p, klien_id: e.target.value}))} style={inp}>
                  <option value="">-- Pilih Klien --</option>
                  {klienList.map((k: any) => <option key={k.id} value={String(k.id)}>{k.nama_lengkap||k.user?.name} - {k.user?.email}</option>)}
                </select>
              </div>
              {[
                { key:'subtotal', label:'Subtotal (Rp) *', type:'number', placeholder:'500000' },
                { key:'pajak', label:'Pajak (Rp)', type:'number', placeholder:'0' },
                { key:'diskon', label:'Diskon (Rp)', type:'number', placeholder:'0' },
                { key:'tanggal_jatuh_tempo', label:'Jatuh Tempo *', type:'date', placeholder:'' },
                { key:'catatan', label:'Catatan', type:'text', placeholder:'Keterangan tagihan' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input required={['subtotal','tanggal_jatuh_tempo'].includes(f.key)} type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                </div>
              ))}
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #f59e0b, #d97706)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {saving ? 'Menyimpan...' : 'Buat Tagihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Generate Payroll */}
      {showGeneratePayroll && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'400px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Generate Payroll</h2>
              <button onClick={() => setShowGeneratePayroll(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
              <p style={{ color:'var(--text2)', fontSize:'13px', lineHeight:'1.6' }}>
                Generate payroll otomatis untuk semua mitra yang memiliki order aktif (<b>in_progress</b>) di periode yang dipilih. Payroll dihitung berdasarkan hari kerja × tarif per hari × 80%.
              </p>
            </div>
            <form onSubmit={handleGeneratePayroll} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Periode (Bulan-Tahun) *</label>
                <input required type="month" value={periodePayroll} onChange={e => setPeriodePayroll(e.target.value)} style={inp} />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowGeneratePayroll(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={generatingPayroll} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {generatingPayroll ? 'Generating...' : 'Generate Payroll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Jurnal */}
      {showFormJurnal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'420px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Tambah Jurnal</h2>
              <button onClick={() => setShowFormJurnal(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleCreateJurnal} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe *</label>
                <select value={formJurnal.tipe} onChange={e => setFormJurnal(p => ({...p, tipe: e.target.value}))} style={inp}>
                  <option value="income">Income (Pemasukan)</option>
                  <option value="outcome">Outcome (Pengeluaran)</option>
                </select>
              </div>
              {[
                { key:'kategori', label:'Kategori *', type:'text', placeholder:'Biaya operasional, gaji mitra, dll' },
                { key:'deskripsi', label:'Deskripsi', type:'text', placeholder:'Keterangan detail' },
                { key:'jumlah', label:'Jumlah (Rp) *', type:'number', placeholder:'1000000' },
                { key:'tanggal', label:'Tanggal *', type:'date', placeholder:'' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input required={['kategori','jumlah','tanggal'].includes(f.key)} type={f.type} value={(formJurnal as any)[f.key]} onChange={e => setFormJurnal(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                </div>
              ))}
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowFormJurnal(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingJurnal} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #f59e0b, #d97706)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingJurnal ? 'Menyimpan...' : 'Simpan Jurnal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail #{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            {Object.entries(detail).filter(([k]) => !['created_at','updated_at','deleted_at'].includes(k)).map(([k,v]: any) => (
              <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'110px', textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', wordBreak:'break-word' as const }}>{typeof v==='object'?JSON.stringify(v):String(v??'-')}</span>
              </div>
            ))}
            {activeTab === 'tagihan' && (
              <div style={{ marginTop:'16px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {Object.entries(statusTagihan).map(([s,cfg]: any) => (
                  <button key={s} onClick={() => updateTagihanStatus(detail.id, s)}
                    style={{ flex:1, minWidth:'80px', padding:'7px 6px', borderRadius:'10px', border:'1px solid '+cfg.border, background: detail.status===s?cfg.bg:'transparent', color:cfg.color, fontSize:'10px', fontWeight:600, cursor:'pointer' }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
