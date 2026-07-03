'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import {
  Plus, Search, X, Edit2, Trash2, Eye, Globe,
  Image, BookOpen, Users, Star, Settings,
} from 'lucide-react';

const TABS = [
  { key: 'artikel',   label: 'Artikel',   icon: BookOpen },
  { key: 'program',   label: 'Program',   icon: Users },
  { key: 'galeri',    label: 'Galeri',    icon: Image },
  { key: 'testimoni', label: 'Testimoni', icon: Star },
  { key: 'settings',  label: 'Settings',  icon: Settings },
];

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: '10px', color: 'var(--text)', fontSize: '13px', outline: 'none',
};
const lbl: React.CSSProperties = {
  fontSize: '12px', fontWeight: 500, color: 'var(--text2)',
  display: 'block', marginBottom: '5px',
};

export default function WebsiteMgaPage() {
  const [tab, setTab]             = useState('artikel');
  const [data, setData]           = useState<any[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState<any>(null);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');
  const [settings, setSettings]   = useState<any>({});

  // Form states
  const [form, setForm] = useState<any>({});

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'settings') {
        const r: any = await apiClient.get('/internal/mga/settings');
        setSettings(r.data?.data || {});
      } else {
        const r: any = await apiClient.get(`/internal/mga/${tab}`);
        setData(r.data?.data || []);
      }
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (tab === 'settings') {
        await apiClient.post('/internal/mga/settings', settings);
      } else if (editItem) {
        await apiClient.put(`/internal/mga/${tab}/${editItem.id}`, form);
      } else {
        await apiClient.post(`/internal/mga/${tab}`, form);
      }
      setShowModal(false); setEditItem(null); setForm({});
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus item ini?')) return;
    await apiClient.delete(`/internal/mga/${tab}/${id}`).catch(() => {});
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const filtered = data.filter(d =>
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  );

  const s = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>CMS Website MGA</h1>
          <p style={{ color: 'var(--text3)', fontSize: '13px' }}>Kelola konten website Mikala Global Akademi</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="https://mikala-web-mga.vercel.app" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text2)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            <Globe size={14}/> Preview Website
          </a>
          {tab !== 'settings' && (
            <button onClick={() => { setShowModal(true); setEditItem(null); setForm({}); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              <Plus size={14}/> Tambah {TABS.find(t => t.key === tab)?.label}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: tab === t.key ? 'linear-gradient(135deg,#1a7a5e,#22a07a)' : 'var(--glass)', color: tab === t.key ? 'white' : 'var(--text2)', border: tab === t.key ? 'none' : '1px solid var(--border)' }}>
              <Icon size={13}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>Pengaturan Website MGA</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { key: 'hero_title',    label: 'Judul Hero' },
                { key: 'hero_subtitle', label: 'Subjudul Hero' },
                { key: 'hero_image',    label: 'URL Gambar Hero' },
                { key: 'wa_number',     label: 'Nomor WhatsApp' },
                { key: 'email',         label: 'Email' },
                { key: 'alamat',        label: 'Alamat' },
                { key: 'instagram',     label: 'URL Instagram' },
                { key: 'facebook',      label: 'URL Facebook' },
                { key: 'youtube',       label: 'URL YouTube' },
                { key: 'gtm_id',        label: 'Google Tag Manager ID' },
              ].map(f => (
                <div key={f.key}>
                  <label style={lbl}>{f.label}</label>
                  <input value={settings[f.key] || ''} onChange={e => setSettings((s: any) => ({ ...s, [f.key]: e.target.value }))} style={inp} placeholder={f.label}/>
                </div>
              ))}
            </div>
            <button type="submit" disabled={saving}
              style={{ marginTop: '20px', padding: '10px 24px', background: 'linear-gradient(135deg,#1a7a5e,#22a07a)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              {saving ? 'Menyimpan...' : 'Simpan Settings'}
            </button>
          </form>
        </div>
      )}

      {/* List Tab */}
      {tab !== 'settings' && (
        <>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
            <Search size={15} style={{ color: 'var(--text3)' }}/>
            <input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '13px', width: '100%' }}/>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>Memuat...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text3)' }}>
              <Plus size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }}/>
              <p style={{ fontWeight: 600 }}>Belum ada data</p>
              <p style={{ fontSize: '13px' }}>Klik "Tambah" untuk menambahkan konten baru</p>
            </div>
          ) : (
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {tab === 'artikel' && ['Judul', 'Kategori', 'Author', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                    {tab === 'program' && ['Judul', 'Durasi', 'Kuota', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                    {tab === 'galeri' && ['Gambar', 'Caption', 'Kategori', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                    {tab === 'testimoni' && ['Nama', 'Asal', 'Rating', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item: any) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      {tab === 'artikel' && <>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{item.judul}</p>
                          {item.gambar && <img src={item.gambar} style={{ width: '60px', height: '36px', objectFit: 'cover', borderRadius: '6px', marginTop: '4px' }}/>}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)' }}>{item.kategori}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)' }}>{item.author}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: item.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: item.status === 'published' ? '#10b981' : '#f59e0b' }}>
                            {item.status === 'published' ? '✓ Published' : item.status === 'scheduled' ? '📅 Jadwal' : '⏳ Draft'}
                          </span>
                        </td>
                      </>}
                      {tab === 'program' && <>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{item.icon} {item.judul}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text3)' }}>{item.subtitle}</p>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)' }}>{item.durasi}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)' }}>{item.kuota}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{item.status}</span>
                        </td>
                      </>}
                      {tab === 'galeri' && <>
                        <td style={{ padding: '12px 16px' }}>
                          <img src={item.url} alt={item.caption} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}/>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text)' }}>{item.caption}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)' }}>{item.kategori}</td>
                      </>}
                      {tab === 'testimoni' && <>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{item.foto} {item.nama}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text3)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.teks}</p>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)' }}>{item.asal}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{'⭐'.repeat(item.rating || 5)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{item.status}</span>
                        </td>
                      </>}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {tab === 'artikel' && (
                            <a href={`https://mikala-web-mga.vercel.app/artikel/${item.slug}`} target="_blank" rel="noreferrer"
                              style={{ padding: '5px 8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '7px', color: '#3b82f6', display: 'flex', cursor: 'pointer' }}>
                              <Eye size={13}/>
                            </a>
                          )}
                          <button onClick={() => handleEdit(item)}
                            style={{ padding: '5px 8px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '7px', color: '#7c3aed', cursor: 'pointer', display: 'flex' }}>
                            <Edit2 size={13}/>
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            style={{ padding: '5px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '7px', color: '#ef4444', cursor: 'pointer', display: 'flex' }}>
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, overflowY: 'auto', padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', width: '100%', maxWidth: '600px', padding: '24px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                {editItem ? 'Edit' : 'Tambah'} {TABS.find(t => t.key === tab)?.label}
              </h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); setForm({}); }}
                style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text2)', display: 'flex' }}>
                <X size={16}/>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Artikel form */}
                {tab === 'artikel' && <>
                  <div><label style={lbl}>Judul *</label><input required value={form.judul||''} onChange={e=>s('judul',e.target.value)} style={inp} placeholder="Judul artikel"/></div>
                  <div><label style={lbl}>Ringkasan</label><textarea value={form.ringkasan||''} onChange={e=>s('ringkasan',e.target.value)} style={{...inp,minHeight:'60px',resize:'vertical' as const}} placeholder="Ringkasan singkat..."/></div>
                  <div><label style={lbl}>Konten *</label><textarea required value={form.konten||''} onChange={e=>s('konten',e.target.value)} style={{...inp,minHeight:'160px',resize:'vertical' as const}} placeholder="Konten artikel (HTML diperbolehkan)..."/></div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
                    <div><label style={lbl}>Kategori</label>
                      <select value={form.kategori||'Informasi'} onChange={e=>s('kategori',e.target.value)} style={inp}>
                        {['Informasi','Program','Tips','Alumni','Berita'].map(k=><option key={k}>{k}</option>)}
                      </select>
                    </div>
                    <div><label style={lbl}>Status</label>
                      <select value={form.status||'draft'} onChange={e=>s('status',e.target.value)} style={inp}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Tanggal Publish (jadwal)</label>
                    <input type="datetime-local" value={form.published_at ? String(form.published_at).slice(0,16).replace(' ','T') : ''} onChange={e=>s('published_at',e.target.value)} style={inp} />
                    <p style={{ color:'var(--text3)', fontSize:'11px', margin:'4px 0 0' }}>Kosongkan = publish sekarang. Isi tanggal ke depan = dijadwalkan (auto-publish). Backdate juga bisa.</p>
                  </div>
                  <div><label style={lbl}>URL Gambar</label><input value={form.gambar||''} onChange={e=>s('gambar',e.target.value)} style={inp} placeholder="https://res.cloudinary.com/..."/></div>
                  <div><label style={lbl}>Author</label><input value={form.author||''} onChange={e=>s('author',e.target.value)} style={inp} placeholder="Nama penulis"/></div>
                </>}

                {/* Program form */}
                {tab === 'program' && <>
                  <div style={{display:'grid',gridTemplateColumns:'60px 1fr',gap:'12px'}}>
                    <div><label style={lbl}>Icon</label><input value={form.icon||''} onChange={e=>s('icon',e.target.value)} style={inp} placeholder="🎌"/></div>
                    <div><label style={lbl}>Judul *</label><input required value={form.judul||''} onChange={e=>s('judul',e.target.value)} style={inp} placeholder="Nama program"/></div>
                  </div>
                  <div><label style={lbl}>Subtitle</label><input value={form.subtitle||''} onChange={e=>s('subtitle',e.target.value)} style={inp} placeholder="EPA / SSW / dll"/></div>
                  <div><label style={lbl}>Deskripsi</label><textarea value={form.deskripsi||''} onChange={e=>s('deskripsi',e.target.value)} style={{...inp,minHeight:'80px',resize:'vertical' as const}}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
                    <div><label style={lbl}>Durasi</label><input value={form.durasi||''} onChange={e=>s('durasi',e.target.value)} style={inp} placeholder="12 Bulan"/></div>
                    <div><label style={lbl}>Kuota</label><input value={form.kuota||''} onChange={e=>s('kuota',e.target.value)} style={inp} placeholder="20 Peserta"/></div>
                    <div><label style={lbl}>Biaya</label><input value={form.biaya||''} onChange={e=>s('biaya',e.target.value)} style={inp} placeholder="Hubungi Kami"/></div>
                  </div>
                  <div><label style={lbl}>Kurikulum (pisahkan dengan |)</label><textarea value={form.kurikulum||''} onChange={e=>s('kurikulum',e.target.value)} style={{...inp,minHeight:'60px',resize:'vertical' as const}} placeholder="Bahasa Jepang N4|Keperawatan Dasar|Budaya Jepang"/></div>
                  <div><label style={lbl}>Persyaratan (pisahkan dengan |)</label><textarea value={form.syarat||''} onChange={e=>s('syarat',e.target.value)} style={{...inp,minHeight:'60px',resize:'vertical' as const}} placeholder="D3 Keperawatan|Usia 18-35 tahun|Sehat jasmani"/></div>
                </>}

                {/* Galeri form */}
                {tab === 'galeri' && <>
                  <div><label style={lbl}>URL Gambar *</label><input required value={form.url||''} onChange={e=>s('url',e.target.value)} style={inp} placeholder="https://res.cloudinary.com/..."/></div>
                  {form.url && <img src={form.url} style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'10px'}} alt="preview"/>}
                  <div><label style={lbl}>Caption</label><input value={form.caption||''} onChange={e=>s('caption',e.target.value)} style={inp} placeholder="Keterangan foto"/></div>
                  <div><label style={lbl}>Kategori</label>
                    <select value={form.kategori||'Umum'} onChange={e=>s('kategori',e.target.value)} style={inp}>
                      {['Umum','Pelatihan','Keberangkatan','Alumni','Fasilitas'].map(k=><option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div><label style={lbl}>Urutan</label><input type="number" value={form.urutan||0} onChange={e=>s('urutan',Number(e.target.value))} style={inp}/></div>
                </>}

                {/* Testimoni form */}
                {tab === 'testimoni' && <>
                  <div style={{display:'grid',gridTemplateColumns:'60px 1fr',gap:'12px'}}>
                    <div><label style={lbl}>Foto (emoji)</label><input value={form.foto||'👤'} onChange={e=>s('foto',e.target.value)} style={inp} placeholder="👩"/></div>
                    <div><label style={lbl}>Nama *</label><input required value={form.nama||''} onChange={e=>s('nama',e.target.value)} style={inp} placeholder="Nama alumni"/></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                    <div><label style={lbl}>Asal Kota</label><input value={form.asal||''} onChange={e=>s('asal',e.target.value)} style={inp} placeholder="Jakarta"/></div>
                    <div><label style={lbl}>Jabatan</label><input value={form.jabatan||''} onChange={e=>s('jabatan',e.target.value)} style={inp} placeholder="Alumni Program Kaigo"/></div>
                  </div>
                  <div><label style={lbl}>Testimoni *</label><textarea required value={form.teks||''} onChange={e=>s('teks',e.target.value)} style={{...inp,minHeight:'80px',resize:'vertical' as const}} placeholder="Cerita sukses alumni..."/></div>
                  <div><label style={lbl}>Rating (1-5)</label>
                    <select value={form.rating||5} onChange={e=>s('rating',Number(e.target.value))} style={inp}>
                      {[5,4,3,2,1].map(r=><option key={r} value={r}>{'⭐'.repeat(r)} ({r})</option>)}
                    </select>
                  </div>
                </>}

              </div>
              <div style={{ display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'20px' }}>
                <button type="button" onClick={()=>{setShowModal(false);setEditItem(null);setForm({});}}
                  style={{padding:'9px 20px',background:'var(--glass)',border:'1px solid var(--border)',borderRadius:'10px',color:'var(--text2)',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  style={{padding:'9px 24px',background:'linear-gradient(135deg,#1a7a5e,#22a07a)',border:'none',borderRadius:'10px',color:'white',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>
                  {saving ? 'Menyimpan...' : editItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
