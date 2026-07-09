'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { FileText, Image, Star, Settings, Plus, X, Edit2, Trash2, Eye, Upload, BarChart2, Globe } from 'lucide-react';
import RichEditor from '../../../components/RichEditor';

const TABS = [
  { key:'artikel',   label:'Artikel',   icon: FileText },
  { key:'layanan',   label:'Layanan',   icon: Globe },
  { key:'galeri',    label:'Galeri',    icon: Image },
  { key:'testimoni', label:'Testimoni', icon: Star },
  { key:'settings',  label:'Settings',  icon: Settings },
];

const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

export default function WebsitePage() {
  const [activeTab, setActiveTab] = useState('artikel');
  const [artikel, setArtikel] = useState<any[]>([]);
  const [layanan, setLayanan] = useState<any[]>([]);
  const [galeri, setGaleri] = useState<any[]>([]);
  const [testimoni, setTestimoni] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [artikelPage, setArtikelPage] = useState(1);
  const [artikelTotal, setArtikelTotal] = useState(0);
  const [artikelLastPage, setArtikelLastPage] = useState(1);
  const PER_PAGE = 10;

  // Forms
  const [formArtikel, setFormArtikel] = useState({ judul:'', slug:'', excerpt:'', konten:'', thumbnail:'', thumbnail_caption:'', kategori:'Artikel', status:'published', published_at:'' });
  const [formLayanan, setFormLayanan] = useState({ nama:'', deskripsi:'', gambar:'', wa_link:'http://wa.me/6281296998827', urutan:'1', is_active:true });
  const [formGaleri, setFormGaleri] = useState({ judul:'', url:'', kategori:'', deskripsi:'' });
  const [formSettings, setFormSettings] = useState<any>({});
  const [heroSlides, setHeroSlides] = useState<{ image:string; title:string; subtitle:string }[]>([]);

  useEffect(() => { fetchData(); }, [activeTab, artikelPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'artikel') {
        const r: any = await apiClient.get(`/internal/cms/artikel?page=${artikelPage}&per_page=${PER_PAGE}`);
        const d = r.data?.data;
        if (d?.data) {
          setArtikel(d.data);
          setArtikelTotal(d.total || 0);
          setArtikelLastPage(d.last_page || 1);
        } else {
          setArtikel(Array.isArray(d) ? d : []);
        }
      } else if (activeTab === 'layanan') {
        const r: any = await apiClient.get('/internal/cms/layanan');
        setLayanan(Array.isArray(r.data?.data) ? r.data.data : []);
      } else if (activeTab === 'galeri') {
        const r: any = await apiClient.get('/internal/cms/galeri');
        setGaleri(Array.isArray(r.data?.data) ? r.data.data : []);
      } else if (activeTab === 'testimoni') {
        const r: any = await apiClient.get('/internal/cms/testimoni');
        setTestimoni(Array.isArray(r.data?.data) ? r.data.data : []);
      } else if (activeTab === 'settings') {
        const r: any = await apiClient.get('/internal/cms/settings');
        const s = r.data?.data || {};
        setSettings(s);
        setFormSettings(s);
        try {
          const parsed = typeof s.hero_slides === 'string' ? JSON.parse(s.hero_slides) : s.hero_slides;
          setHeroSlides(Array.isArray(parsed) ? parsed : []);
        } catch { setHeroSlides([]); }
      }
    } catch {}
    setLoading(false);
  };

  const handleUpload = async (file: File, setter: (url: string) => void) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'mgm/cms');
      const res: any = await apiClient.post('/internal/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data?.success) setter(res.data.url);
      else alert('Upload gagal: ' + (res.data?.message || 'unknown response'));
    } catch(e: any) {
      console.error('Upload error', e);
      alert('Upload gagal: ' + (e.response?.data?.message || e.response?.status || e.message || 'unknown error'));
    }
  };

  const handleSaveArtikel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = formArtikel.slug || formArtikel.judul.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      const payload = { ...formArtikel, slug };
      if (editItem) await apiClient.patch('/internal/cms/artikel/'+editItem.id, payload);
      else await apiClient.post('/internal/cms/artikel', payload);
      setShowForm(false); setEditItem(null);
      setFormArtikel({ judul:'', slug:'', excerpt:'', konten:'', thumbnail:'', thumbnail_caption:'', kategori:'Artikel', status:'published', published_at:'' });
      fetchData();
    } catch(e: any) { alert(e.response?.data?.message || 'Gagal'); }
    setSaving(false);
  };

  const handleSaveLayanan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) await apiClient.patch('/internal/cms/layanan/'+editItem.id, formLayanan);
      else await apiClient.post('/internal/cms/layanan', formLayanan);
      setShowForm(false); setEditItem(null);
      setFormLayanan({ nama:'', deskripsi:'', gambar:'', wa_link:'http://wa.me/6281296998827', urutan:'1', is_active:true });
      fetchData();
    } catch(e: any) { alert(e.response?.data?.message || 'Gagal'); }
    setSaving(false);
  };

  const handleSaveGaleri = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/cms/galeri', formGaleri);
      setShowForm(false);
      setFormGaleri({ judul:'', url:'', kategori:'', deskripsi:'' });
      fetchData();
    } catch(e: any) { alert(e.response?.data?.message || 'Gagal'); }
    setSaving(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formSettings, hero_slides: JSON.stringify(heroSlides) };
      await apiClient.post('/internal/cms/settings', payload);
      alert('Settings tersimpan!');
      fetchData();
    } catch(e: any) { alert('Gagal'); }
    setSaving(false);
  };

  const addHeroSlide = () => setHeroSlides(p => [...p, { image:'', title:'', subtitle:'' }]);
  const removeHeroSlide = (i: number) => setHeroSlides(p => p.filter((_, idx) => idx !== i));
  const updateHeroSlide = (i: number, patch: Partial<{ image:string; title:string; subtitle:string }>) =>
    setHeroSlides(p => p.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const moveHeroSlide = (i: number, dir: -1 | 1) => setHeroSlides(p => {
    const j = i + dir;
    if (j < 0 || j >= p.length) return p;
    const copy = [...p];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  });

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Hapus item ini?')) return;
    try {
      await apiClient.delete(`/internal/cms/${type}/${id}`);
      fetchData();
    } catch {}
  };

  const handleApproveTestimoni = async (id: number, status: string) => {
    try {
      await apiClient.patch('/internal/cms/testimoni/'+id, { status });
      fetchData();
    } catch {}
  };

  const cardStyle = { background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };

  return (
    <div className="space-y-4">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Website MGM</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola konten website mikalaglobalmedika.com</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <a href="https://mikala-web-mgm.vercel.app" target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontSize:'13px', textDecoration:'none' }}>
            <Eye size={14}/>Preview Website
          </a>
          {['artikel','layanan','galeri'].includes(activeTab) && (
            <button onClick={() => { setShowForm(true); setEditItem(null); }}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #2d7a5e, #d63a7a)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
              <Plus size={15}/>Tambah {activeTab === 'artikel' ? 'Artikel' : activeTab === 'layanan' ? 'Layanan' : 'Foto'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab===t.key?'linear-gradient(135deg, #2d7a5e, #d63a7a)':'var(--glass)', color: activeTab===t.key?'white':'var(--text2)', border: activeTab===t.key?'none':'1px solid var(--border)' }}>
              <Icon size={14}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* TAB ARTIKEL */}
      {activeTab === 'artikel' && (
        <div style={cardStyle}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Thumbnail','Judul','Kategori','Tanggal','Status','Aksi'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} style={{ padding:'40px', textAlign:'center', color:'var(--text3)' }}>Memuat...</td></tr> :
                artikel.length === 0 ? <tr><td colSpan={6} style={{ padding:'40px', textAlign:'center', color:'var(--text3)' }}>Belum ada artikel</td></tr> :
                artikel.map((a: any) => (
                  <tr key={a.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 16px' }}>
                      {a.thumbnail ? <img src={a.thumbnail} alt="" style={{ width:'60px', height:'40px', objectFit:'cover', borderRadius:'8px' }} /> : <div style={{ width:'60px', height:'40px', background:'var(--glass)', borderRadius:'8px' }} />}
                    </td>
                    <td style={{ padding:'10px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)', maxWidth:'200px' }}>
                      <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.judul}</div>
                      <div style={{ fontSize:'11px', color:'var(--text3)' }}>/{a.slug}</div>
                    </td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'var(--text2)' }}>{a.kategori||'-'}</td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'var(--text2)' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID') : '-'}</td>
                    <td style={{ padding:'10px 16px' }}>
                      <span style={{ background: a.status==='published'?'rgba(16,185,129,0.15)':a.status==='scheduled'?'rgba(59,130,246,0.15)':'rgba(245,158,11,0.15)', color: a.status==='published'?'#10b981':a.status==='scheduled'?'#3b82f6':'#f59e0b', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                        {a.status==='published'?'Publish':a.status==='scheduled'?'📅 Jadwal':'Draft'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 16px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <a href={`https://mikala-web-mgm.vercel.app/artikel/${a.slug}`} target="_blank" rel="noreferrer"
                          style={{ padding:'5px 8px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', textDecoration:'none' }}>
                          <Eye size={12}/>
                        </a>
                        <button onClick={() => { setEditItem(a); setFormArtikel({judul:a.judul,slug:a.slug,excerpt:a.excerpt||'',konten:a.konten||'',thumbnail:a.thumbnail||'',thumbnail_caption:a.thumbnail_caption||'',kategori:a.kategori||'Artikel',status:a.status||'published',published_at:a.published_at?String(a.published_at).slice(0,16).replace(' ','T'):''}); setShowForm(true); }}
                          style={{ padding:'5px 8px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'8px', color:'#f59e0b', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
                          <Edit2 size={12}/>
                        </button>
                        <button onClick={() => handleDelete('artikel', a.id)}
                          style={{ padding:'5px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Artikel */}
      {activeTab === 'artikel' && artikelLastPage > 1 && (
        <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', background:'var(--glass)', borderRadius:'0 0 20px 20px' }}>
          <span style={{ fontSize:'12px', color:'var(--text3)' }}>Total {artikelTotal} artikel · Halaman {artikelPage}/{artikelLastPage}</span>
          <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
            <button disabled={artikelPage<=1} onClick={() => setArtikelPage(p=>p-1)}
              style={{ padding:'6px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', fontSize:'12px', cursor:artikelPage<=1?'not-allowed':'pointer', opacity:artikelPage<=1?0.5:1 }}>
              ← Prev
            </button>
            {Array.from({length:artikelLastPage},(_,i)=>i+1).map(p => (
              <button key={p} onClick={() => setArtikelPage(p)}
                style={{ width:'32px', height:'32px', borderRadius:'8px', border:'none', fontSize:'12px', fontWeight:600, cursor:'pointer',
                  background: p===artikelPage?'linear-gradient(135deg, #2d7a5e, #d63a7a)':'var(--glass)',
                  color: p===artikelPage?'white':'var(--text2)',
                  borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border)' }}>
                {p}
              </button>
            ))}
            <button disabled={artikelPage>=artikelLastPage} onClick={() => setArtikelPage(p=>p+1)}
              style={{ padding:'6px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', fontSize:'12px', cursor:artikelPage>=artikelLastPage?'not-allowed':'pointer', opacity:artikelPage>=artikelLastPage?0.5:1 }}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* TAB LAYANAN */}
      {activeTab === 'layanan' && (
        <div style={cardStyle}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Gambar','Nama','Urutan','Status','Aksi'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} style={{ padding:'40px', textAlign:'center', color:'var(--text3)' }}>Memuat...</td></tr> :
                layanan.map((l: any) => (
                  <tr key={l.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 16px' }}>
                      {l.gambar ? <img src={l.gambar} alt="" style={{ width:'60px', height:'40px', objectFit:'cover', borderRadius:'8px' }} /> : <div style={{ width:'60px', height:'40px', background:'var(--glass)', borderRadius:'8px' }} />}
                    </td>
                    <td style={{ padding:'10px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{l.nama}</td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'var(--text2)' }}>{l.urutan}</td>
                    <td style={{ padding:'10px 16px' }}>
                      <span style={{ background: l.is_active?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color: l.is_active?'#10b981':'#ef4444', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                        {l.is_active?'Aktif':'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 16px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={() => { setEditItem(l); setFormLayanan({nama:l.nama,deskripsi:l.deskripsi||'',gambar:l.gambar||'',wa_link:l.wa_link||'',urutan:String(l.urutan||1),is_active:l.is_active}); setShowForm(true); }}
                          style={{ padding:'5px 8px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'8px', color:'#f59e0b', cursor:'pointer', display:'flex', alignItems:'center' }}>
                          <Edit2 size={12}/>
                        </button>
                        <button onClick={() => handleDelete('layanan', l.id)}
                          style={{ padding:'5px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center' }}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB GALERI */}
      {activeTab === 'galeri' && (
        <div>
          {loading ? <div style={{ padding:'40px', textAlign:'center', color:'var(--text3)' }}>Memuat...</div> : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px' }}>
              {galeri.map((g: any) => (
                <div key={g.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', overflow:'hidden' }}>
                  <div style={{ height:'150px', overflow:'hidden' }}>
                    <img src={g.url||g.thumbnail} alt={g.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div style={{ padding:'10px' }}>
                    <p style={{ fontSize:'12px', fontWeight:600, color:'var(--text)', margin:'0 0 6px' }}>{g.judul||'-'}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'11px', color:'var(--text3)' }}>{g.kategori||'-'}</span>
                      <button onClick={() => handleDelete('galeri', g.id)}
                        style={{ padding:'4px', background:'rgba(239,68,68,0.1)', border:'none', borderRadius:'6px', color:'#ef4444', cursor:'pointer', display:'flex' }}>
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {galeri.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada foto galeri</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB TESTIMONI */}
      {activeTab === 'testimoni' && (
        <div style={cardStyle}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Nama','Layanan','Rating','Komentar','Status','Aksi'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} style={{ padding:'40px', textAlign:'center' }}>Memuat...</td></tr> :
                testimoni.length === 0 ? <tr><td colSpan={6} style={{ padding:'40px', textAlign:'center', color:'var(--text3)' }}>Belum ada testimoni</td></tr> :
                testimoni.map((t: any) => (
                  <tr key={t.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{t.nama}</td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'var(--text2)' }}>{t.layanan||'-'}</td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'#f59e0b' }}>{'★'.repeat(t.rating||5)}</td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.komentar}</td>
                    <td style={{ padding:'10px 16px' }}>
                      <span style={{ background: t.status==='approved'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)', color: t.status==='approved'?'#10b981':'#f59e0b', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                        {t.status==='approved'?'Approved':'Pending'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 16px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        {t.status !== 'approved' && (
                          <button onClick={() => handleApproveTestimoni(t.id, 'approved')}
                            style={{ padding:'5px 10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                            Approve
                          </button>
                        )}
                        <button onClick={() => handleDelete('testimoni', t.id)}
                          style={{ padding:'5px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center' }}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {[
              { key:'site_title', label:'Judul Website', type:'text' },
              { key:'site_description', label:'Deskripsi', type:'text' },
              { key:'hero_title', label:'Hero Title', type:'text' },
              { key:'hero_image', label:'Hero Image URL', type:'text' },
              { key:'wa_number', label:'No. WhatsApp', type:'text' },
              { key:'phone', label:'No. Telepon', type:'text' },
              { key:'email_cs', label:'Email CS', type:'text' },
              { key:'alamat', label:'Alamat', type:'text' },
              { key:'facebook', label:'Facebook URL', type:'text' },
              { key:'instagram', label:'Instagram URL', type:'text' },
              { key:'tiktok', label:'TikTok URL', type:'text' },
              { key:'youtube', label:'YouTube URL', type:'text' },
              { key:'stats_customer', label:'Jumlah Customer', type:'number' },
              { key:'stats_nakes', label:'Jumlah Nakes', type:'number' },
              { key:'stats_mitra', label:'Jumlah Mitra', type:'number' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                <input type={f.type} value={formSettings[f.key]||''} onChange={e => setFormSettings((p: any) => ({...p,[f.key]:e.target.value}))} style={inp} />
              </div>
            ))}
          </div>
          <div>
            <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Hero Subtitle</label>
            <textarea value={formSettings.hero_subtitle||''} onChange={e => setFormSettings((p: any) => ({...p,hero_subtitle:e.target.value}))} style={{...inp, minHeight:'80px', resize:'vertical'}} />
          </div>

          {/* Hero Slides */}
          <div style={{ ...cardStyle, padding:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
              <label style={{ color:'var(--text)', fontSize:'13px', fontWeight:700 }}>Hero Slider ({heroSlides.length} slide)</label>
              <button type="button" onClick={addHeroSlide} style={{ display:'flex', alignItems:'center', gap:'6px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px 12px', color:'var(--text)', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                <Plus size={14} /> Tambah Slide
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {heroSlides.map((s, i) => (
                <div key={i} style={{ display:'flex', gap:'12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', padding:'12px', alignItems:'flex-start' }}>
                  <label style={{ width:'110px', height:'70px', flexShrink:0, borderRadius:'8px', overflow:'hidden', background:'var(--bg2)', border:'1px dashed var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>
                    {s.image ? <img src={s.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <Upload size={18} color="var(--text2)" />}
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], (url) => updateHeroSlide(i, { image:url })); }} />
                  </label>
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'8px' }}>
                    <input placeholder="Judul slide" value={s.title} onChange={e => updateHeroSlide(i, { title:e.target.value })} style={inp} />
                    <input placeholder="Subtitle slide" value={s.subtitle} onChange={e => updateHeroSlide(i, { subtitle:e.target.value })} style={inp} />
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                    <button type="button" onClick={() => moveHeroSlide(i, -1)} disabled={i===0} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'6px', width:'28px', height:'28px', cursor:'pointer', color:'var(--text)', opacity:i===0?0.4:1 }}>↑</button>
                    <button type="button" onClick={() => moveHeroSlide(i, 1)} disabled={i===heroSlides.length-1} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'6px', width:'28px', height:'28px', cursor:'pointer', color:'var(--text)', opacity:i===heroSlides.length-1?0.4:1 }}>↓</button>
                    <button type="button" onClick={() => removeHeroSlide(i)} style={{ background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:'6px', width:'28px', height:'28px', cursor:'pointer', color:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {heroSlides.length === 0 && (
                <p style={{ color:'var(--text2)', fontSize:'12px', margin:0 }}>Belum ada slide. Jika kosong, hero akan pakai Hero Title/Subtitle/Image di atas sebagai fallback.</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={saving} style={{ padding:'12px', background:'linear-gradient(135deg, #2d7a5e, #d63a7a)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer', width:'fit-content', minWidth:'150px' }}>
            {saving ? 'Menyimpan...' : '💾 Simpan Settings'}
          </button>
        </form>
      )}

      {/* Modal Form Artikel */}
      {showForm && activeTab === 'artikel' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'600px', padding:'24px', maxHeight:'90vh', overflowY:'auto', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>{editItem?'Edit':'Tambah'} Artikel</h2>
              <button onClick={() => { setShowForm(false); setEditItem(null); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleSaveArtikel} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Judul *</label>
                <input required value={formArtikel.judul} onChange={e => setFormArtikel(p => ({...p,judul:e.target.value,slug:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}))} style={inp} placeholder="Judul artikel" />
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Slug</label>
                <input value={formArtikel.slug} onChange={e => setFormArtikel(p => ({...p,slug:e.target.value}))} style={inp} placeholder="url-artikel" />
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Thumbnail URL</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  <input value={formArtikel.thumbnail} onChange={e => setFormArtikel(p => ({...p,thumbnail:e.target.value}))} style={inp} placeholder="https://..." />
                  <label style={{ padding:'9px 14px', background:'rgba(45,122,94,0.1)', border:'1px solid rgba(45,122,94,0.2)', borderRadius:'10px', color:'#2d7a5e', fontSize:'12px', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'4px' }}>
                    <Upload size={13}/>Upload
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0], (url) => setFormArtikel(p => ({...p,thumbnail:url}))); }} />
                  </label>
                </div>
                {formArtikel.thumbnail && <img src={formArtikel.thumbnail} alt="" style={{ width:'80px', height:'50px', objectFit:'cover', borderRadius:'8px', marginTop:'6px' }} />}
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Caption Gambar (sumber foto, opsional)</label>
                <input value={formArtikel.thumbnail_caption} onChange={e => setFormArtikel(p => ({...p,thumbnail_caption:e.target.value}))} style={inp} placeholder="Foto: dok. MGM" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Kategori</label>
                  <select value={formArtikel.kategori} onChange={e => setFormArtikel(p => ({...p,kategori:e.target.value}))} style={inp}>
                    {['Artikel','Kesehatan','Tips','Motivasi','Tokoh','Layanan'].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Status</label>
                  <select value={formArtikel.status} onChange={e => setFormArtikel(p => ({...p,status:e.target.value}))} style={inp}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tanggal Publish (jadwal)</label>
                <input type="datetime-local" value={formArtikel.published_at} onChange={e => setFormArtikel(p => ({...p,published_at:e.target.value}))} style={inp} />
                <p style={{ color:'var(--text3)', fontSize:'11px', margin:'4px 0 0' }}>Kosongkan = publish sekarang. Isi tanggal ke depan = dijadwalkan (auto-publish saat waktunya). Backdate juga bisa.</p>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Excerpt/Ringkasan</label>
                <textarea value={formArtikel.excerpt} onChange={e => setFormArtikel(p => ({...p,excerpt:e.target.value}))} style={{...inp, minHeight:'60px', resize:'vertical'}} placeholder="Ringkasan artikel..." />
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Konten artikel (toolbar: bold, italic, heading, list, link)</label>
                <RichEditor value={formArtikel.konten} onChange={(html) => setFormArtikel(p => ({...p,konten:html}))} />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #2d7a5e, #d63a7a)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {saving ? 'Menyimpan...' : editItem ? 'Update Artikel' : 'Simpan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Layanan */}
      {showForm && activeTab === 'layanan' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>{editItem?'Edit':'Tambah'} Layanan</h2>
              <button onClick={() => { setShowForm(false); setEditItem(null); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleSaveLayanan} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div><label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Nama Layanan *</label><input required value={formLayanan.nama} onChange={e => setFormLayanan(p => ({...p,nama:e.target.value}))} style={inp} /></div>
              <div><label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Deskripsi</label><textarea value={formLayanan.deskripsi} onChange={e => setFormLayanan(p => ({...p,deskripsi:e.target.value}))} style={{...inp, minHeight:'80px', resize:'vertical'}} /></div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Gambar URL</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  <input value={formLayanan.gambar} onChange={e => setFormLayanan(p => ({...p,gambar:e.target.value}))} style={inp} placeholder="https://..." />
                  <label style={{ padding:'9px 14px', background:'rgba(45,122,94,0.1)', border:'1px solid rgba(45,122,94,0.2)', borderRadius:'10px', color:'#2d7a5e', fontSize:'12px', cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
                    <Upload size={13}/>
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0], (url) => setFormLayanan(p => ({...p,gambar:url}))); }} />
                  </label>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div><label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Urutan</label><input type="number" value={formLayanan.urutan} onChange={e => setFormLayanan(p => ({...p,urutan:e.target.value}))} style={inp} /></div>
                <div><label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Status</label>
                  <select value={formLayanan.is_active?'1':'0'} onChange={e => setFormLayanan(p => ({...p,is_active:e.target.value==='1'}))} style={inp}>
                    <option value="1">Aktif</option><option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #2d7a5e, #d63a7a)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Galeri */}
      {showForm && activeTab === 'galeri' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'440px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Tambah Foto Galeri</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleSaveGaleri} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Upload Foto *</label>
                <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'20px', background:'rgba(45,122,94,0.05)', border:'2px dashed rgba(45,122,94,0.3)', borderRadius:'12px', cursor:'pointer', color:'#2d7a5e', fontWeight:600, fontSize:'13px' }}>
                  <Upload size={18}/>{formGaleri.url ? '✓ Foto terupload — Ganti?' : 'Klik untuk upload foto'}
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0], (url) => setFormGaleri(p => ({...p,url}))); }} />
                </label>
                {formGaleri.url && <img src={formGaleri.url} alt="" style={{ width:'100%', height:'150px', objectFit:'cover', borderRadius:'10px', marginTop:'8px' }} />}
              </div>
              <div><label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Judul</label><input value={formGaleri.judul} onChange={e => setFormGaleri(p => ({...p,judul:e.target.value}))} style={inp} /></div>
              <div><label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Kategori</label>
                <select value={formGaleri.kategori} onChange={e => setFormGaleri(p => ({...p,kategori:e.target.value}))} style={inp}>
                  <option value="">-- Pilih --</option>
                  {['Tim','Layanan','Event','Fasilitas','Peralatan'].map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving||!formGaleri.url} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #2d7a5e, #d63a7a)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer', opacity:formGaleri.url?1:0.6 }}>
                  {saving ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
