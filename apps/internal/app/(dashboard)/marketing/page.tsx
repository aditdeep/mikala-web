'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { TrendingUp, Search, Eye, X, Plus, Users, Handshake, CheckCircle, Clock, XCircle, BarChart2 } from 'lucide-react';

const TABS = [
  { key:'leads',     label:'Leads',     icon: Users },
  { key:'kerjasama', label:'Kerjasama', icon: Handshake },
  { key:'report',    label:'Report',    icon: BarChart2 },
];

const statusMap: any = {
  new:       { label:'Baru',       color:'#3b82f6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  icon: Clock },
  contacted: { label:'Dihubungi',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)',  icon: Clock },
  converted: { label:'Berhasil',   color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)',  icon: CheckCircle },
  lost:      { label:'Tidak Jadi', color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)',   icon: XCircle },
};

export default function MarketingPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [kerjasama, setKerjasama] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [detail, setDetail] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formLead, setFormLead] = useState({ nama:'', email:'', phone:'', source:'website_mgm', tipe_layanan:'homecare_harian', pesan:'' });
  const [formKerjasama, setFormKerjasama] = useState({ partner_name:'', partner_type:'referral', contact_person:'', phone:'', email:'', notes:'' });

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { if (activeTab === 'report') fetchReport(); }, [activeTab]);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/marketing/leads').then((r: any) => {
        const d = r.data?.data;
        setLeads(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }),
      apiClient.get('/internal/marketing/kerjasama').then((r: any) => {
        const d = r.data?.data;
        setKerjasama(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }),
    ]).finally(() => setLoading(false));
  };

  const fetchReport = () => {
    setLoadingReport(true);
    Promise.all([
      apiClient.get('/internal/marketing/report/order-in').catch(() => ({ data: {} })),
      apiClient.get('/internal/marketing/report/deal').catch(() => ({ data: {} })),
    ]).then(([orderIn, deal]: any) => {
      setReport({ orderIn: orderIn.data?.data, deal: deal.data?.data });
      setLoadingReport(false);
    }).catch(() => setLoadingReport(false));
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/marketing/leads', formLead);
      setShowForm(false);
      setFormLead({ nama:'', email:'', phone:'', source:'website_mgm', tipe_layanan:'homecare_harian', pesan:'' });
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan lead'); }
    finally { setSaving(false); }
  };

  const handleSubmitKerjasama = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/marketing/kerjasama', formKerjasama);
      setShowForm(false);
      setFormKerjasama({ partner_name:'', partner_type:'referral', contact_person:'', phone:'', email:'', notes:'' });
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan kerjasama'); }
    finally { setSaving(false); }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch('/internal/marketing/leads/'+id+'/status', { status });
      fetchAll();
      if (detail) setDetail((p: any) => ({...p, status}));
    } catch(e: any) { alert(e.response?.data?.message || 'Gagal update status'); }
  };

  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };

  return (
    <div className="space-y-4">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Marketing</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola leads dan kerjasama</p>
        </div>
        {activeTab !== 'report' && (
          <button onClick={() => setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #3b82f6, #2563eb)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>{activeTab === 'leads' ? 'Tambah Lead' : 'Tambah Kerjasama'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
        {[
          { icon: Users,       label:'Total Leads',    value: leads.length,                                          gradient:'linear-gradient(135deg, #3b82f6, #2563eb)' },
          { icon: Handshake,   label:'Total Kerjasama', value: kerjasama.length,                                     gradient:'linear-gradient(135deg, #10b981, #059669)' },
          { icon: CheckCircle, label:'Lead Berhasil',  value: leads.filter((l:any) => l.status==='converted').length, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)' },
          { icon: TrendingUp,  label:'Lead Baru',      value: leads.filter((l:any) => l.status==='new').length,       gradient:'linear-gradient(135deg, #f59e0b, #d97706)' },
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
                  <p style={{ fontWeight:700, fontSize:'20px', color:'var(--text)' }}>{s.value}</p>
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
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab===t.key?'linear-gradient(135deg, #3b82f6, #2563eb)':'var(--glass)', color: activeTab===t.key?'white':'var(--text2)', border: activeTab===t.key?'none':'1px solid var(--border)' }}>
              <Icon size={14}/>{t.label}{t.key==='leads'?` (${leads.length})`:t.key==='kerjasama'?` (${kerjasama.length})`:''}
            </button>
          );
        })}
      </div>

      {/* Search */}
      {activeTab !== 'report' && (
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
          <Search size={16} style={{ color:'var(--text3)' }} />
          <input placeholder="Cari data..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
        </div>
      )}

      {/* TAB LEADS */}
      {activeTab === 'leads' && (
        <div style={cardStyle}>
          {loading ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'550px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama','Email','Telepon','Sumber','Layanan','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {leads.filter(l => JSON.stringify(l).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                    const s = statusMap[item.status] || statusMap.new;
                    const Icon = s.icon;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.nama||item.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.email||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.phone||item.telepon||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{(item.source||item.sumber||'-').replace(/_/g,' ')}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{(item.tipe_layanan||item.layanan_interest||'-').replace(/_/g,' ')}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                            <Icon size={11}/>{s.label}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {leads.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada leads</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB KERJASAMA */}
      {activeTab === 'kerjasama' && (
        <div style={cardStyle}>
          {loading ? <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Partner','Contact Person','Telepon','Email','Tipe','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {kerjasama.filter(k => JSON.stringify(k).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => (
                    <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.nama_partner||item.partner_name||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.contact_person||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.phone||item.telepon||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.email||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{item.tipe||item.type||'-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12}/>Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {kerjasama.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data kerjasama</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-3">
          {loadingReport ? <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat report...</div> : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:'12px' }}>
                {[
                  { label:'Total Leads',     value: leads.length,                                            color:'#3b82f6' },
                  { label:'Lead Berhasil',   value: leads.filter((l:any)=>l.status==='converted').length,    color:'#10b981' },
                  { label:'Lead Gagal',      value: leads.filter((l:any)=>l.status==='lost').length,         color:'#ef4444' },
                  { label:'Total Kerjasama', value: kerjasama.length,                                        color:'#7c3aed' },
                ].map(card => (
                  <div key={card.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                    <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>{card.label}</p>
                    <p style={{ fontWeight:700, fontSize:'28px', color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Konversi Rate */}
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>Konversi Rate per Status</p>
                {Object.entries(statusMap).map(([status, cfg]: any) => {
                  const count = leads.filter((l:any) => l.status === status).length;
                  const pct = leads.length > 0 ? Math.round((count/leads.length)*100) : 0;
                  return (
                    <div key={status} style={{ marginBottom:'10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                        <span style={{ fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{cfg.label}</span>
                        <span style={{ fontSize:'12px', color:'var(--text3)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:pct+'%', background:cfg.color, borderRadius:'3px', transition:'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sumber Leads */}
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>Sumber Leads</p>
                {Array.from(new Set(leads.map((l:any) => l.source||l.sumber||'unknown'))).map((source: any) => {
                  const count = leads.filter((l:any) => (l.source||l.sumber||'unknown') === source).length;
                  const pct = leads.length > 0 ? Math.round((count/leads.length)*100) : 0;
                  return (
                    <div key={source} style={{ marginBottom:'10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                        <span style={{ fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{source.replace(/_/g,' ')}</span>
                        <span style={{ fontSize:'12px', color:'var(--text3)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:pct+'%', background:'#3b82f6', borderRadius:'3px' }} />
                      </div>
                    </div>
                  );
                })}
                {leads.length === 0 && <p style={{ color:'var(--text3)', fontSize:'13px' }}>Belum ada data</p>}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>{activeTab==='leads'?'Tambah Lead':'Tambah Kerjasama'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>

            {activeTab === 'leads' ? (
              <form onSubmit={handleSubmitLead} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  { key:'nama', label:'Nama *', type:'text', placeholder:'Nama prospek' },
                  { key:'email', label:'Email', type:'email', placeholder:'email@contoh.com' },
                  { key:'phone', label:'Telepon *', type:'text', placeholder:'08xxxxxxxxxx' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                    <input required={f.label.includes('*')} type={f.type} value={(formLead as any)[f.key]} onChange={e => setFormLead(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Sumber</label>
                  <select value={formLead.source} onChange={e => setFormLead(p => ({...p, source: e.target.value}))} style={inp}>
                    {['website_mgm','instagram','facebook','tiktok','referral','walk_in','telepon','whatsapp','lainnya'].map(s => (
                      <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Layanan Diminati</label>
                  <select value={formLead.tipe_layanan} onChange={e => setFormLead(p => ({...p, tipe_layanan: e.target.value}))} style={inp}>
                    {['homecare_harian','homecare_live_in','medical_checkup','konsultasi','fisioterapi','lainnya'].map(s => (
                      <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Catatan</label>
                  <textarea value={formLead.pesan} onChange={e => setFormLead(p => ({...p, pesan: e.target.value}))} style={{...inp, minHeight:'60px', resize:'vertical'}} placeholder="Catatan tambahan..." />
                </div>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                  <button type="submit" disabled={saving} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #3b82f6, #2563eb)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                    {saving ? 'Menyimpan...' : 'Simpan Lead'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitKerjasama} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  { key:'partner_name', label:'Nama Partner *', type:'text', placeholder:'Nama institusi/perusahaan' },
                  { key:'contact_person', label:'Contact Person *', type:'text', placeholder:'Nama PIC' },
                  { key:'phone', label:'Telepon *', type:'text', placeholder:'08xxxxxxxxxx' },
                  { key:'email', label:'Email', type:'email', placeholder:'email@partner.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                    <input required={f.label.includes('*')} type={f.type} value={(formKerjasama as any)[f.key] || ''} onChange={e => setFormKerjasama(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe Kerjasama</label>
                  <select value={formKerjasama.partner_type} onChange={e => setFormKerjasama(p => ({...p, partner_type: e.target.value}))} style={inp}>
                    {['referral','vendor','sponsor','media_partner','lainnya'].map(s => (
                      <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Catatan</label>
                  <textarea value={formKerjasama.notes} onChange={e => setFormKerjasama(p => ({...p, notes: e.target.value}))} style={{...inp, minHeight:'60px', resize:'vertical'}} placeholder="Catatan kerjasama..." />
                </div>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                  <button type="submit" disabled={saving} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                    {saving ? 'Menyimpan...' : 'Simpan Kerjasama'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>{activeTab==='leads'?'Detail Lead':'Detail Kerjasama'}</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            {Object.entries(detail).filter(([k]) => !['created_at','updated_at','deleted_at','id'].includes(k)).map(([k,v]: any) => (
              <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px', flexShrink:0, textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500, textTransform:'capitalize' }}>{typeof v==='object'?'-':String(v??'-').replace(/_/g,' ')}</span>
              </div>
            ))}
            {activeTab === 'leads' && (
              <div style={{ marginTop:'16px' }}>
                <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>Update Status:</p>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {Object.entries(statusMap).map(([s,cfg]: any) => (
                    <button key={s} onClick={() => updateLeadStatus(detail.id, s)}
                      style={{ flex:1, minWidth:'80px', padding:'7px 6px', borderRadius:'10px', border:'1px solid '+cfg.border, background: detail.status===s?cfg.bg:'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
