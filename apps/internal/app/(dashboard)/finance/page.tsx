'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Search, Eye, X, Plus, TrendingUp, TrendingDown, FileText, BookOpen, BarChart2, ArrowUpCircle, ArrowDownCircle , Calendar, Settings as SettingsIcon, Check, AlertCircle } from "lucide-react";
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/Pagination';

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
  { key:'cuti',     label:'Cuti',     icon: Calendar },
  { key:'settings', label:'Settings', icon: SettingsIcon },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('tagihan');

  // Cuti management
  const [cutiList, setCutiList] = useState<any[]>([]);
  const [cutiLoading, setCutiLoading] = useState(false);
  const [cutiFilter, setCutiFilter] = useState('all');

  // Payroll workflow
  const [payrollPeriode, setPayrollPeriode] = useState(new Date().toISOString().slice(0,7));
  const [payrollGenerating, setPayrollGenerating] = useState(false);
  const [payrollDetail, setPayrollDetail] = useState<any>(null);
  const [payrollEditMode, setPayrollEditMode] = useState(false);
  const [payrollForm, setPayrollForm] = useState<any>({});

  // Settings
  const [settings, setSettings] = useState<any>({});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [rateCuti, setRateCuti] = useState('500000');
  const [maxCuti, setMaxCuti] = useState('2');

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


  const fetchCuti = async () => {
    setCutiLoading(true);
    try {
      const params: any = cutiFilter !== 'all' ? { status: cutiFilter } : {};
      const res = await apiClient.get('/internal/finance/cuti', { params });
      setCutiList(res.data.data?.data || res.data.data || []);
    } catch {}
    setCutiLoading(false);
  };

  const handleApproveCuti = async (id: number, status: 'approved'|'rejected') => {
    let catatan = '';
    if (status === 'rejected') {
      catatan = prompt('Alasan penolakan:') || '';
      if (!catatan) return;
    }
    try {
      await apiClient.patch(`/internal/finance/cuti/${id}/approve`, { status, catatan_admin: catatan });
      alert(status === 'approved' ? 'Cuti disetujui' : 'Cuti ditolak');
      fetchCuti();
    } catch (e: any) {
      alert('Error: ' + (e?.response?.data?.message || 'gagal'));
    }
  };


  const openPayrollDetail = (p: any) => {
    setPayrollDetail(p);
    setPayrollEditMode(false);
    setPayrollForm({
      jumlah_hari_kerja: p.jumlah_hari_kerja || 0,
      tarif_per_hari:    p.tarif_per_hari || 0,
      hari_cuti:         p.hari_cuti || 0,
      rate_cuti:         p.rate_cuti || 500000,
      bonus:             p.bonus || 0,
      potongan_kasbon:   p.potongan_kasbon || 0,
      potongan_kredit:   p.potongan_kredit || 0,
      adjustment:        p.adjustment || 0,
      catatan_adjustment:p.catatan_adjustment || '',
    });
  };

  const handleSaveAdjust = async () => {
    if (!payrollDetail) return;
    try {
      await apiClient.patch(`/internal/finance/payroll/${payrollDetail.id}/adjust`, payrollForm);
      alert('Payroll berhasil di-adjust');
      setPayrollEditMode(false);
      fetchAll();
      const res = await apiClient.get(`/internal/finance/payroll/${payrollDetail.id}`);
      setPayrollDetail(res.data.data);
    } catch (e: any) {
      alert('Error: ' + (e?.response?.data?.message || 'gagal'));
    }
  };

  const handleApprovePayroll = async (id: number) => {
    if (!confirm('Approve payroll? Tidak bisa di-edit lagi setelahnya.')) return;
    try {
      await apiClient.patch(`/internal/finance/payroll/${id}/approve`);
      alert('Payroll approved');
      fetchAll();
      setPayrollDetail(null);
    } catch (e: any) {
      alert('Error: ' + (e?.response?.data?.message || 'gagal'));
    }
  };

  const handleMarkPaid = async (id: number) => {
    if (!confirm('Mark sebagai PAID? Kasbon dan kredit akan auto-update.')) return;
    try {
      await apiClient.patch(`/internal/finance/payroll/${id}/paid`);
      alert('Payroll marked as paid');
      fetchAll();
      setPayrollDetail(null);
    } catch (e: any) {
      alert('Error: ' + (e?.response?.data?.message || 'gagal'));
    }
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await apiClient.get('/internal/finance/payroll-settings');
      const s = res.data.data || {};
      setSettings(s);
      setRateCuti(s.rate_cuti_default?.value || '500000');
      setMaxCuti(s.max_cuti_per_bulan?.value || '2');
    } catch {}
    setSettingsLoading(false);
  };

  const handleSaveSettings = async () => {
    try {
      await apiClient.patch('/internal/finance/payroll-settings', {
        settings: { rate_cuti_default: rateCuti, max_cuti_per_bulan: maxCuti },
      });
      alert('Settings berhasil disimpan');
      fetchSettings();
    } catch (e: any) {
      alert('Error: ' + (e?.response?.data?.message || 'gagal'));
    }
  };

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
  const totalPayroll = payroll.reduce((a, b) => a + (Number(b.total) || 0), 0);

  const tagihanFiltered = tagihan.filter((t:any) => JSON.stringify(t).toLowerCase().includes(search.toLowerCase()));
  const payrollFiltered = payroll.filter((p:any) => JSON.stringify(p).toLowerCase().includes(search.toLowerCase()));
  const jurnalFiltered = jurnal.filter((j:any) => JSON.stringify(j).toLowerCase().includes(search.toLowerCase()));
  const tagihanPg = usePagination(tagihanFiltered, 20, [search, activeTab]);
  const payrollPg = usePagination(payrollFiltered, 20, [search, activeTab]);
  const jurnalPg = usePagination(jurnalFiltered, 20, [search, activeTab]);

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
                  {['No','Invoice #','Klien','Jumlah','Jatuh Tempo','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {tagihanPg.paged.map((item: any, i: number) => {
                    const s = statusTagihan[item.status] || statusTagihan.unpaid;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{(tagihanPg.page-1)*tagihanPg.perPage+i+1}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>#{item.id}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.klien?.nama_lengkap||item.klien?.user?.name||item.order?.klien?.nama_lengkap||item.order?.klien?.user?.name||'-'}</td>
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
              <Pagination page={tagihanPg.page} totalPages={tagihanPg.totalPages} total={tagihanPg.total} onPageChange={tagihanPg.setPage} label="tagihan" />
              {tagihan.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada tagihan</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB PAYROLL */}
      {activeTab === 'payroll' && (
        <>
          {/* Generate Payroll Bar */}
          <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:'14px', padding:'14px', marginBottom:'14px', display:'flex', gap:'10px', alignItems:'flex-end', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:'180px' }}>
              <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'4px', fontWeight:600 }}>Generate Payroll Periode</p>
              <input type="month" value={periodePayroll} onChange={(e) => setPeriodePayroll(e.target.value)}
                style={{ width:'100%', padding:'8px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', outline:'none' }}/>
            </div>
            <button onClick={(e: any) => handleGeneratePayroll(e)} disabled={generatingPayroll}
              style={{ background: generatingPayroll ? '#666' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'10px', padding:'9px 18px', color:'white', fontWeight:700, fontSize:'13px', cursor: generatingPayroll ? 'not-allowed' : 'pointer' }}>
              {generatingPayroll ? 'Generating...' : 'Generate Payroll'}
            </button>
          </div>
        <div style={cardStyle}>
          {loading ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['No','Payroll #','Mitra','Jumlah','Periode','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {payrollPg.paged.map((item: any, i: number) => {
                    const s = statusTagihan[item.status] || statusTagihan.unpaid;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{(payrollPg.page-1)*payrollPg.perPage+i+1}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>#{item.id}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#10b981' }}>Rp {Number(item.total||0).toLocaleString('id')}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.periode_mulai ? new Date(item.periode_mulai).toLocaleDateString('id-ID',{month:'long',year:'numeric'}) : '-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.label}</span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <button onClick={() => openPayrollDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pagination page={payrollPg.page} totalPages={payrollPg.totalPages} total={payrollPg.total} onPageChange={payrollPg.setPage} label="payroll" />
              {payroll.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data payroll</div>}
            </div>
          )}
        </div>
        </>
      )}

      {/* TAB JURNAL */}
      {activeTab === 'jurnal' && (
        <div style={cardStyle}>
          {loadingJurnal ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['No','Tanggal','Tipe','Kategori','Deskripsi','Jumlah'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {jurnalPg.paged.map((item: any, i: number) => (
                    <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{(jurnalPg.page-1)*jurnalPg.perPage+i+1}</td>
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
              <Pagination page={jurnalPg.page} totalPages={jurnalPg.totalPages} total={jurnalPg.total} onPageChange={jurnalPg.setPage} label="jurnal" />
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
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'460px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>
                {activeTab==='tagihan' ? 'Detail Tagihan' : activeTab==='payroll' ? 'Detail Payroll' : 'Detail'}
              </h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>

            {activeTab === 'tagihan' ? (
              <div>
                {[
                  { label:'Invoice', value: '#'+detail.id },
                  { label:'Klien', value: detail.klien?.nama_lengkap||detail.klien?.user?.name||detail.order?.klien?.nama_lengkap||detail.order?.klien?.user?.name||'-' },
                  { label:'Subtotal', value: 'Rp '+Number(detail.subtotal||0).toLocaleString('id') },
                  { label:'Pajak', value: 'Rp '+Number(detail.pajak||0).toLocaleString('id') },
                  { label:'Diskon', value: 'Rp '+Number(detail.diskon||0).toLocaleString('id') },
                  { label:'Total', value: 'Rp '+Number(detail.total||0).toLocaleString('id') },
                  { label:'Jatuh Tempo', value: detail.tanggal_jatuh_tempo ? new Date(detail.tanggal_jatuh_tempo).toLocaleDateString('id-ID') : '-' },
                  { label:'Status', value: statusTagihan[detail.status]?.label||detail.status },
                  { label:'Catatan', value: detail.catatan||'-' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'110px', flexShrink:0 }}>{item.label}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ marginTop:'16px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>Update Status:</p>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {[
                      { s:'paid',      label:'Lunas',       color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
                      { s:'unpaid',    label:'Belum Bayar', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)' },
                      { s:'partial',   label:'Sebagian',    color:'#8b5cf6', bg:'rgba(139,92,246,0.15)', border:'rgba(139,92,246,0.3)' },
                      { s:'overdue',   label:'Jatuh Tempo', color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)' },
                      { s:'cancelled', label:'Dibatalkan',  color:'#6b7280', bg:'rgba(107,114,128,0.15)',border:'rgba(107,114,128,0.3)' },
                    ].map(btn => (
                      <button key={btn.s} onClick={() => updateTagihanStatus(detail.id, btn.s)}
                        style={{ flex:1, minWidth:'70px', padding:'7px 4px', borderRadius:'10px', border:'1px solid '+btn.border, background: detail.status===btn.s?btn.bg:'transparent', color:btn.color, fontSize:'10px', fontWeight:600, cursor:'pointer' }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 'payroll' ? (
              <div>
                <div style={{ background:'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
                  <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'11px' }}>Payroll Number</p>
                  <p style={{ color:'white', fontWeight:700, fontSize:'16px' }}>{detail.payroll_number||'#'+detail.id}</p>
                  <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'20px', fontWeight:700, marginTop:'4px' }}>Rp {Number(detail.total||0).toLocaleString('id')}</p>
                </div>
                {[
                  { label:'Mitra', value: detail.mitra?.user?.name||detail.mitra?.nama_lengkap||'Mitra #'+detail.mitra_id },
                  { label:'Periode', value: detail.periode_mulai ? new Date(detail.periode_mulai).toLocaleDateString('id-ID',{month:'long',year:'numeric'}) : '-' },
                  { label:'Hari Kerja', value: (detail.jumlah_hari_kerja||0)+' hari' },
                  { label:'Tarif/Hari', value: 'Rp '+Number(detail.tarif_per_hari||0).toLocaleString('id') },
                  { label:'Gaji Pokok', value: 'Rp '+Number(detail.gaji_pokok||0).toLocaleString('id') },
                  { label:'Bonus', value: 'Rp '+Number(detail.bonus||0).toLocaleString('id') },
                  { label:'Potongan', value: 'Rp '+Number(detail.potongan||0).toLocaleString('id') },
                  { label:'Status', value: detail.status },
                  { label:'Catatan', value: detail.catatan||'-' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'110px', flexShrink:0 }}>{item.label}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500, textTransform: item.label==='Status'?'capitalize':'none' }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ marginTop:'16px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>Update Status Pembayaran:</p>
                  <div style={{ display:'flex', gap:'8px' }}>
                    {[
                      { s:'pending',   label:'Pending',       color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)' },
                      { s:'paid',      label:'Sudah Dibayar', color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
                      { s:'cancelled', label:'Batal',         color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)' },
                    ].map(btn => (
                      <button key={btn.s} onClick={async () => {
                        try {
                          await apiClient.patch('/internal/finance/payroll/'+detail.id+'/status', { status: btn.s });
                          setDetail((p: any) => ({...p, status: btn.s}));
                          fetchAll();
                        } catch(e: any) { alert(e.response?.data?.message||'Gagal update status'); }
                      }}
                        style={{ flex:1, padding:'10px', borderRadius:'12px', border:'1px solid '+btn.border, background: detail.status===btn.s?btn.bg:'transparent', color:btn.color, fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(detail).filter(([k]) => !['created_at','updated_at','deleted_at'].includes(k)).map(([k,v]: any) => (
                  <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'110px', textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px' }}>{typeof v==='object'?'-':String(v??'-')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === CUTI TAB === */}
      {activeTab === 'cuti' && (
        <div>
          <div style={{ display:'flex', gap:'8px', marginBottom:'14px', alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:'13px', color:'var(--text3)' }}>Filter:</span>
            {[['all','Semua'],['pending','Pending'],['approved','Disetujui'],['rejected','Ditolak']].map(([k,l]) => (
              <button key={k} onClick={() => { setCutiFilter(k); setTimeout(fetchCuti, 50); }}
                style={{ padding:'5px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer',
                  background: cutiFilter===k ? '#7c3aed' : 'var(--glass)',
                  color: cutiFilter===k ? 'white' : 'var(--text3)',
                  border: cutiFilter===k ? 'none' : '1px solid var(--border)' }}>
                {l}
              </button>
            ))}
          </div>
          {cutiLoading ? <p style={{ color:'var(--text3)', textAlign:'center' }}>Loading...</p> :
            cutiList.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px', color:'var(--text3)' }}>
                <Calendar size={32} style={{ opacity:0.2, marginBottom:8 }}/>
                <p>Belum ada pengajuan cuti</p>
              </div>
            ) : (
              <div style={{ display:'grid', gap:'10px' }}>
                {cutiList.map((c: any) => (
                  <div key={c.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', padding:'14px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{c.mitra?.nama_lengkap || ('Mitra #' + c.mitra_id)}</p>
                        <p style={{ fontSize:'12px', color:'var(--text2)', marginTop:'2px' }}>
                          {new Date(c.tanggal_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})} – {new Date(c.tanggal_selesai).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})} ({c.jumlah_hari} hari)
                        </p>
                        <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'4px' }}>Alasan: {c.alasan}</p>
                        {c.catatan_admin && <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px', fontStyle:'italic' }}>Catatan admin: {c.catatan_admin}</p>}
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <span style={{
                          padding:'3px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700,
                          background: c.status === 'pending' ? 'rgba(245,158,11,0.15)' : c.status === 'approved' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: c.status === 'pending' ? '#f59e0b' : c.status === 'approved' ? '#10b981' : '#ef4444',
                        }}>
                          {c.status === 'pending' ? 'Pending' : c.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </span>
                        {c.status === 'pending' && (
                          <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
                            <button onClick={() => handleApproveCuti(c.id, 'approved')} style={{ background:'#10b981', border:'none', borderRadius:'6px', padding:'5px 10px', color:'white', fontSize:'11px', fontWeight:700, cursor:'pointer' }}>Setujui</button>
                            <button onClick={() => handleApproveCuti(c.id, 'rejected')} style={{ background:'#ef4444', border:'none', borderRadius:'6px', padding:'5px 10px', color:'white', fontSize:'11px', fontWeight:700, cursor:'pointer' }}>Tolak</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* === SETTINGS TAB === */}
      {activeTab === 'settings' && (
        <div>
          {settingsLoading ? <p style={{ color:'var(--text3)' }}>Loading...</p> : (
            <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'20px', maxWidth:'500px' }}>
              <h3 style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'16px' }}>Pengaturan Payroll</h3>
              <div style={{ marginBottom:'14px' }}>
                <label style={{ fontSize:'12px', color:'var(--text3)', display:'block', marginBottom:'6px', fontWeight:600 }}>Rate Uang Cuti per Hari (Rp)</label>
                <input type="number" value={rateCuti} onChange={(e) => setRateCuti(e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' }}/>
                <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>Tarif default cuti per hari</p>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'12px', color:'var(--text3)', display:'block', marginBottom:'6px', fontWeight:600 }}>Max Hari Cuti per Bulan</label>
                <input type="number" value={maxCuti} onChange={(e) => setMaxCuti(e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' }}/>
                <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>Maksimal cuti yang dapat diajukan mitra per bulan</p>
              </div>
              <button onClick={handleSaveSettings}
                style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                Simpan Settings
              </button>
            </div>
          )}
        </div>
      )}

      {/* === MODAL PAYROLL DETAIL === */}
      {payrollDetail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:'20px' }}>
          <div style={{ background:'var(--bg)', borderRadius:'20px', padding:'24px', maxWidth:'600px', width:'100%', maxHeight:'90vh', overflowY:'auto', border:'1px solid var(--border)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
              <div>
                <h3 style={{ fontSize:'17px', fontWeight:800, color:'var(--text)' }}>Detail Payroll</h3>
                <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'3px' }}>{payrollDetail.payroll_number}</p>
              </div>
              <button onClick={() => setPayrollDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px 10px', color:'var(--text)', cursor:'pointer' }}>x</button>
            </div>
            <div style={{ background:'var(--glass)', borderRadius:'12px', padding:'14px', marginBottom:'14px' }}>
              <p style={{ fontSize:'11px', color:'var(--text3)' }}>Mitra</p>
              <p style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{payrollDetail.mitra?.nama_lengkap || ('#' + payrollDetail.mitra_id)}</p>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'6px' }}>Periode</p>
              <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>
                {new Date(payrollDetail.periode_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})} - {new Date(payrollDetail.periode_selesai).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}
              </p>
            </div>
            {[
              ['Jumlah Hari Kerja','jumlah_hari_kerja','int'],
              ['Tarif per Hari (Rp)','tarif_per_hari','rp'],
              ['Hari Cuti','hari_cuti','int'],
              ['Rate Cuti per Hari (Rp)','rate_cuti','rp'],
              ['Bonus (Rp)','bonus','rp'],
              ['Potongan Kasbon (Rp)','potongan_kasbon','rp'],
              ['Potongan Kredit (Rp)','potongan_kredit','rp'],
              ['Adjustment (+/-)','adjustment','rp'],
            ].map(([label, key, type]) => (
              <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:'12px', color:'var(--text3)' }}>{label}</span>
                {payrollEditMode && payrollDetail.status === 'draft' ? (
                  <input
                    type="number"
                    value={payrollForm[key as string] ?? 0}
                    onChange={(e) => setPayrollForm({ ...payrollForm, [key as string]: e.target.value })}
                    style={{ width:'140px', padding:'5px 8px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'6px', color:'var(--text)', fontSize:'12px', textAlign:'right' }}
                  />
                ) : (
                  <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text)' }}>
                    {type === 'int' ? Number(payrollDetail[key as string] || 0) : 'Rp ' + Number(payrollDetail[key as string] || 0).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            ))}
            {payrollEditMode && payrollDetail.status === 'draft' && (
              <div style={{ marginTop:'10px' }}>
                <label style={{ fontSize:'11px', color:'var(--text3)' }}>Catatan Adjustment</label>
                <textarea value={payrollForm.catatan_adjustment || ''} onChange={(e) => setPayrollForm({ ...payrollForm, catatan_adjustment: e.target.value })}
                  style={{ width:'100%', padding:'8px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'12px', marginTop:'4px', minHeight:'50px', resize:'vertical' }}
                />
              </div>
            )}
            <div style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:'10px', padding:'12px', marginTop:'14px' }}>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'2px' }}>Total Gaji Bersih</p>
              <p style={{ fontSize:'22px', fontWeight:800, color:'#a78bfa' }}>Rp {Number(payrollDetail.total || 0).toLocaleString('id-ID')}</p>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>
                Status: <strong style={{ color: payrollDetail.status === 'paid' ? '#10b981' : payrollDetail.status === 'approved' ? '#3b82f6' : '#f59e0b' }}>
                  {payrollDetail.status === 'paid' ? 'Paid' : payrollDetail.status === 'approved' ? 'Approved' : 'Draft'}
                </strong>
              </p>
            </div>
            <div style={{ display:'flex', gap:'8px', marginTop:'18px', flexWrap:'wrap' }}>
              {payrollDetail.status === 'draft' && (
                payrollEditMode ? (
                  <>
                    <button onClick={() => setPayrollEditMode(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontWeight:600, cursor:'pointer' }}>Batal</button>
                    <button onClick={handleSaveAdjust} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'10px', color:'white', fontWeight:700, cursor:'pointer' }}>Simpan Adjustment</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setPayrollEditMode(true)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontWeight:600, cursor:'pointer' }}>Edit</button>
                    <button onClick={() => handleApprovePayroll(payrollDetail.id)} style={{ flex:1, padding:'10px', background:'#3b82f6', border:'none', borderRadius:'10px', color:'white', fontWeight:700, cursor:'pointer' }}>Approve</button>
                  </>
                )
              )}
              {payrollDetail.status === 'approved' && (
                <button onClick={() => handleMarkPaid(payrollDetail.id)} style={{ flex:1, padding:'10px', background:'#10b981', border:'none', borderRadius:'10px', color:'white', fontWeight:700, cursor:'pointer' }}>Mark as Paid</button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
