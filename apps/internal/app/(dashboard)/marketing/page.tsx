'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { TrendingUp, Search, Eye, X, Plus, Users, Handshake, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MarketingPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [kerjasama, setKerjasama] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [detail, setDetail] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', source:'', notes:'' });
  const [formKerjasama, setFormKerjasama] = useState({ partner_name:'', contact_person:'', phone:'', email:'', type:'', notes:'' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/marketing/leads').then((r: any) => setLeads(Array.isArray(r.data?.data) ? r.data.data : [])),
      apiClient.get('/internal/marketing/kerjasama').then((r: any) => setKerjasama(Array.isArray(r.data?.data) ? r.data.data : [])),
    ]).finally(() => setLoading(false));
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/marketing/leads', form);
      setShowForm(false);
      setForm({ name:'', email:'', phone:'', source:'', notes:'' });
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan lead');
    } finally { setSaving(false); }
  };

  const handleSubmitKerjasama = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/marketing/kerjasama', formKerjasama);
      setShowForm(false);
      setFormKerjasama({ partner_name:'', contact_person:'', phone:'', email:'', type:'', notes:'' });
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan kerjasama');
    } finally { setSaving(false); }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch(`/internal/marketing/leads/${id}/status`, { status });
      fetchAll();
      if (detail) setDetail({ ...detail, status });
    } catch {}
  };

  const statusMap: any = {
    new: { label:'Baru', color:'#3b82f6', bg:'rgba(59,130,246,0.15)', border:'rgba(59,130,246,0.3)', icon: Clock },
    contacted: { label:'Dihubungi', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', icon: Clock },
    converted: { label:'Berhasil', color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)', icon: CheckCircle },
    lost: { label:'Tidak Jadi', color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)', icon: XCircle },
  };

  const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Marketing</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola leads dan kerjasama</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #3b82f6, #2563eb)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(59,130,246,0.35)' }}>
          <Plus size={15} />{activeTab === 'leads' ? 'Tambah Lead' : 'Tambah Kerjasama'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px' }}>
        {[
          { icon: Users, label:'Total Leads', value: leads.length, gradient:'linear-gradient(135deg, #3b82f6, #2563eb)', glow:'rgba(59,130,246,0.3)' },
          { icon: Handshake, label:'Total Kerjasama', value: kerjasama.length, gradient:'linear-gradient(135deg, #10b981, #059669)', glow:'rgba(16,185,129,0.3)' },
          { icon: CheckCircle, label:'Lead Berhasil', value: leads.filter((l:any) => l.status === 'converted').length, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)', glow:'rgba(124,58,237,0.3)' },
          { icon: TrendingUp, label:'Lead Baru', value: leads.filter((l:any) => l.status === 'new').length, gradient:'linear-gradient(135deg, #f59e0b, #d97706)', glow:'rgba(245,158,11,0.3)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'12px', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${s.glow}` }}>
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
      <div style={{ display:'flex', gap:'6px' }}>
        {[{ key:'leads', label:`Leads (${leads.length})` }, { key:'kerjasama', label:`Kerjasama (${kerjasama.length})` }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding:'7px 18px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab === t.key ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'var(--glass)', color: activeTab === t.key ? 'white' : 'var(--text2)', border: activeTab === t.key ? 'none' : '1px solid var(--border)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari data..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      {/* Table */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
        ) : activeTab === 'leads' ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama','Email','Telepon','Sumber','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.filter(l => JSON.stringify(l).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                  const s = statusMap[item.status] || statusMap.new;
                  const Icon = s.icon;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.name || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.email || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.phone || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.source || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          <Icon size={11} />{s.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12} />Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {leads.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada leads</div>}
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Partner','Kontak','Telepon','Tipe','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kerjasama.filter(k => JSON.stringify(k).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => (
                  <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.partner_name || '-'}</td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.contact_person || '-'}</td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.phone || '-'}</td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.type || '-'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer' }}>
                        <Eye size={12} />Detail
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

      {/* Form Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>{activeTab === 'leads' ? 'Tambah Lead' : 'Tambah Kerjasama'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            {activeTab === 'leads' ? (
              <form onSubmit={handleSubmitLead} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  { key:'name', label:'Nama *', type:'text', placeholder:'Nama prospek' },
                  { key:'email', label:'Email', type:'email', placeholder:'email@contoh.com' },
                  { key:'phone', label:'Telepon *', type:'text', placeholder:'08xxxxxxxxxx' },
                  { key:'source', label:'Sumber', type:'text', placeholder:'Instagram, Referral, dll' },
                  { key:'notes', label:'Catatan', type:'text', placeholder:'Catatan tambahan' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                    <input required={['name','phone'].includes(f.key)} type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
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
                  { key:'type', label:'Tipe Kerjasama', type:'text', placeholder:'Referral, Vendor, dll' },
                  { key:'notes', label:'Catatan', type:'text', placeholder:'Catatan kerjasama' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                    <input required={['partner_name','contact_person','phone'].includes(f.key)} type={f.type} value={(formKerjasama as any)[f.key]} onChange={e => setFormKerjasama(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
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
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            {Object.entries(detail).filter(([k]) => !['created_at','updated_at','deleted_at'].includes(k)).map(([k, v]: any) => (
              <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'110px', textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', wordBreak:'break-word' as const }}>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '-')}</span>
              </div>
            ))}
            {activeTab === 'leads' && (
              <div style={{ marginTop:'16px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {Object.entries(statusMap).map(([s, cfg]: any) => (
                  <button key={s} onClick={() => updateLeadStatus(detail.id, s)} style={{ flex:1, padding:'7px 6px', borderRadius:'10px', border:`1px solid ${cfg.border}`, background: detail.status === s ? cfg.bg : 'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
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
