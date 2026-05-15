'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Search, Eye, X, Plus, TrendingUp, TrendingDown, FileText } from 'lucide-react';

export default function FinancePage() {
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('tagihan');
  const [detail, setDetail] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ klien_id:'', subtotal:'', pajak:'0', diskon:'0', tanggal_jatuh_tempo:'', catatan:'' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/finance/tagihan').then((r: any) => setTagihan(Array.isArray(r.data?.data) ? r.data.data : [])),
      apiClient.get('/internal/finance/payroll').then((r: any) => setPayroll(Array.isArray(r.data?.data) ? r.data.data : [])),
    ]).finally(() => setLoading(false));
  };

  const handleCreateTagihan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/finance/tagihan', form);
      setShowForm(false);
      setForm({ klien_id:'', subtotal:'', pajak:'0', diskon:'0', tanggal_jatuh_tempo:'', catatan:'' });
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat tagihan');
    } finally { setSaving(false); }
  };

  const updateTagihanStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch(`/internal/finance/tagihan/${id}/status`, { status });
      fetchAll();
      if (detail) setDetail({ ...detail, status });
    } catch {}
  };

  const totalTagihan = tagihan.reduce((a: number, b: any) => a + (Number(b.total_amount) || 0), 0);
  const totalPaid = tagihan.filter((t: any) => t.status === 'paid').reduce((a: number, b: any) => a + (Number(b.total_amount) || 0), 0);
  const totalPayroll = payroll.reduce((a: number, b: any) => a + (Number(b.amount) || 0), 0);

  const statusMap: any = {
    paid: { label:'Lunas', color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
    pending: { label:'Pending', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)' },
    overdue: { label:'Jatuh Tempo', color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)' },
    cancelled: { label:'Dibatalkan', color:'#6b7280', bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.3)' },
  };

  const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Finance</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola tagihan dan payroll</p>
        </div>
        {activeTab === 'tagihan' && (
          <button onClick={() => setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #f59e0b, #d97706)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(245,158,11,0.35)' }}>
            <Plus size={15} />Buat Tagihan
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px' }}>
        {[
          { icon: TrendingUp, label:'Total Tagihan', value:`Rp ${(totalTagihan/1000000).toFixed(1)}Jt`, gradient:'linear-gradient(135deg, #f59e0b, #d97706)', glow:'rgba(245,158,11,0.3)' },
          { icon: DollarSign, label:'Sudah Dibayar', value:`Rp ${(totalPaid/1000000).toFixed(1)}Jt`, gradient:'linear-gradient(135deg, #10b981, #059669)', glow:'rgba(16,185,129,0.3)' },
          { icon: TrendingDown, label:'Total Payroll', value:`Rp ${(totalPayroll/1000000).toFixed(1)}Jt`, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)', glow:'rgba(124,58,237,0.3)' },
          { icon: FileText, label:'Jumlah Tagihan', value: tagihan.length, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)', glow:'rgba(236,72,153,0.3)' },
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
                  <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px' }}>
        {[{ key:'tagihan', label:`Tagihan (${tagihan.length})` }, { key:'payroll', label:`Payroll (${payroll.length})` }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding:'7px 18px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab === t.key ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--glass)', color: activeTab === t.key ? 'white' : 'var(--text2)', border: activeTab === t.key ? 'none' : '1px solid var(--border)' }}>
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
        ) : activeTab === 'tagihan' ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Invoice #','Jumlah','Jatuh Tempo','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tagihan.filter(t => JSON.stringify(t).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                  const s = statusMap[item.status] || statusMap.pending;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>#{item.id}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#10b981' }}>Rp {Number(item.total_amount || 0).toLocaleString('id')}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.due_date ? new Date(item.due_date).toLocaleDateString('id-ID') : '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.label}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'8px', color:'#f59e0b', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12} />Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {tagihan.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada tagihan</div>}
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Payroll #','Mitra','Jumlah','Tanggal','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payroll.filter(p => JSON.stringify(p).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                  const s = statusMap[item.status] || statusMap.pending;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>#{item.id}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#10b981' }}>Rp {Number(item.amount || 0).toLocaleString('id')}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.payment_date ? new Date(item.payment_date).toLocaleDateString('id-ID') : '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.label}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12} />Detail
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

      {/* Form Tagihan */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Buat Tagihan Baru</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateTagihan} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { key:'klien_id', label:'ID Klien', type:'number', placeholder:'ID klien (opsional)' },
                { key:'subtotal', label:'Subtotal (Rp) *', type:'number', placeholder:'500000' },
                { key:'pajak', label:'Pajak (Rp)', type:'number', placeholder:'0' },
                { key:'diskon', label:'Diskon (Rp)', type:'number', placeholder:'0' },
                { key:'tanggal_jatuh_tempo', label:'Jatuh Tempo *', type:'date', placeholder:'' },
                { key:'catatan', label:'Catatan', type:'text', placeholder:'Keterangan tagihan' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input required={['subtotal','tanggal_jatuh_tempo'].includes(f.key)} type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
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

      {/* Detail Modal */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail #{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            {Object.entries(detail).filter(([k]) => !['created_at','updated_at','deleted_at'].includes(k)).map(([k, v]: any) => (
              <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'110px', textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', wordBreak:'break-word' as const }}>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '-')}</span>
              </div>
            ))}
            {activeTab === 'tagihan' && (
              <div style={{ marginTop:'16px', display:'flex', gap:'6px' }}>
                {Object.entries(statusMap).map(([s, cfg]: any) => (
                  <button key={s} onClick={() => updateTagihanStatus(detail.id, s)} style={{ flex:1, padding:'7px 6px', borderRadius:'10px', border:`1px solid ${cfg.border}`, background: detail.status === s ? cfg.bg : 'transparent', color:cfg.color, fontSize:'10px', fontWeight:600, cursor:'pointer' }}>
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
