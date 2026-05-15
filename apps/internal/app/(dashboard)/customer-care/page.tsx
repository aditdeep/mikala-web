'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Headphones, Search, Eye, X, Plus, CheckCircle, Clock, AlertCircle, Users, HeartPulse } from 'lucide-react';

export default function CustomerCarePage() {
  const [layanan, setLayanan] = useState<any[]>([]);
  const [klien, setKlien] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('layanan');
  const [detail, setDetail] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nama: '', email: '', phone: '', alamat: '', kota: '', provinsi: '', tipe: 'individu', password: 'password123' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/cc/layanan').then((r: any) => setLayanan(Array.isArray(r.data?.data) ? r.data.data : [])),
      apiClient.get('/internal/cc/klien').then((r: any) => setKlien(Array.isArray(r.data?.data) ? r.data.data : [])),
    ]).finally(() => setLoading(false));
  };

  const handleRegisterKlien = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/cc/registrasi/klien', {
        name: formData.nama,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        alamat: formData.alamat,
        kota: formData.kota,
        provinsi: formData.provinsi,
        tipe: formData.tipe,
      });
      setShowForm(false);
      setFormData({ nama: '', email: '', phone: '', alamat: '', kota: '', provinsi: '', tipe: 'individu', password: 'password123' });
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mendaftar klien');
    } finally { setSaving(false); }
  };

  const updateLayananStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch(`/internal/cc/layanan/${id}/status`, { status });
      fetchAll();
      if (detail) setDetail({ ...detail, status });
    } catch {}
  };

  const statusMap: any = {
    active: { label:'Aktif', color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)', icon: CheckCircle },
    pending: { label:'Pending', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', icon: Clock },
    completed: { label:'Selesai', color:'#3b82f6', bg:'rgba(59,130,246,0.15)', border:'rgba(59,130,246,0.3)', icon: CheckCircle },
    cancelled: { label:'Dibatalkan', color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)', icon: AlertCircle },
  };

  const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Customer Care</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola layanan dan klien</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(236,72,153,0.35)' }}>
          <Plus size={15} />Daftarkan Klien
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px' }}>
        {[
          { icon: HeartPulse, label:'Total Layanan', value: layanan.length, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)', glow:'rgba(236,72,153,0.3)' },
          { icon: Users, label:'Total Klien', value: klien.length, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)', glow:'rgba(124,58,237,0.3)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${s.glow}` }}>
                  <Icon size={18} color="white" />
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
        {[{ key:'layanan', label:'Layanan' }, { key:'klien', label:'Klien' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding:'7px 18px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab === t.key ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'var(--glass)', color: activeTab === t.key ? 'white' : 'var(--text2)', border: activeTab === t.key ? 'none' : '1px solid var(--border)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder={`Cari ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      {/* Table */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
        ) : activeTab === 'layanan' ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Tipe Layanan','Klien','Mitra','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {layanan.filter(l => JSON.stringify(l).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                  const s = statusMap[item.status] || statusMap.pending;
                  const Icon = s.icon;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.service_type || item.tipe_layanan || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.klien?.name || item.klien_name || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name || item.mitra_name || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          <Icon size={11} />{s.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12} />Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {layanan.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data layanan</div>}
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama Klien','Email','Telepon','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {klien.filter(k => JSON.stringify(k).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => (
                  <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontSize:'12px', fontWeight:700 }}>
                          {item.user?.name?.[0]?.toUpperCase() || item.name?.[0]?.toUpperCase() || 'K'}
                        </div>
                        <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.user?.name || item.name || '-'}</p>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.user?.email || item.email || '-'}</td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.user?.phone || item.phone || '-'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                        {item.status || 'Aktif'}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer' }}>
                        <Eye size={12} />Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {klien.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data klien</div>}
          </div>
        )}
      </div>

      {/* Form Daftar Klien */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Daftarkan Klien Baru</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleRegisterKlien} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { key:'nama', label:'Nama Lengkap *', type:'text', placeholder:'Nama klien' },
                { key:'email', label:'Email *', type:'email', placeholder:'email@contoh.com' },
                { key:'phone', label:'Nomor HP *', type:'text', placeholder:'08xxxxxxxxxx' },
                { key:'password', label:'Password *', type:'password', placeholder:'Min. 8 karakter' },
                { key:'alamat', label:'Alamat *', type:'text', placeholder:'Alamat lengkap' },
                { key:'kota', label:'Kota *', type:'text', placeholder:'Jakarta' },
                { key:'provinsi', label:'Provinsi *', type:'text', placeholder:'DKI Jakarta' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input required={['nama','email','phone','password','alamat','kota','provinsi'].includes(f.key)} type={f.type} value={(formData as any)[f.key]} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe Klien</label>
                <select value={formData.tipe} onChange={e => setFormData(p => ({ ...p, tipe: e.target.value }))} style={inputStyle}>
                  <option value="individu">Individu</option>
                  <option value="keluarga">Keluarga</option>
                  <option value="rumah_sakit">Rumah Sakit</option>
                  <option value="panti_jompo">Panti Jompo</option>
                  <option value="klinik">Klinik</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {saving ? 'Mendaftarkan...' : 'Daftarkan Klien'}
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
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail</h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16} /></button>
            </div>
            {Object.entries(detail).filter(([k]) => !['id','created_at','updated_at','deleted_at'].includes(k)).map(([k, v]: any) => (
              <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px', textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', wordBreak:'break-word' as const }}>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '-')}</span>
              </div>
            ))}
            {activeTab === 'layanan' && (
              <div style={{ marginTop:'16px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {Object.entries(statusMap).map(([s, cfg]: any) => (
                  <button key={s} onClick={() => updateLayananStatus(detail.id, s)} style={{ padding:'7px 12px', borderRadius:'10px', border:`1px solid ${cfg.border}`, background: detail.status === s ? cfg.bg : 'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
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
