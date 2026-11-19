'use client';
// Editor halaman mikalaglobalmedika.com/hub/{slug} (pengganti linktree.mikalaglobalmedika.com).
// Disimpan ke CMS setting `linktree` = JSON { slug: { nama, bio, foto, links:[{label,url,ikon}] } }.
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Upload } from 'lucide-react';

type Link = { label: string; url: string; ikon?: string };
type Profil = { nama: string; bio?: string; foto?: string; links: Link[] };

const SITE = 'https://mikalaglobalmedika.com';
const IKON = [['', 'Otomatis (dari URL)'], ['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['facebook', 'Facebook'],
  ['youtube', 'YouTube'], ['linkedin', 'LinkedIn'], ['web', 'Website'], ['email', 'Email'], ['telepon', 'Telepon'], ['lokasi', 'Lokasi / Maps'], ['link', 'Link lain']];
// Sama dgn isi bawaan halaman publik (= isi linktree lama), dipakai kalau CMS masih kosong
const BAWAAN: Record<string, Profil> = {
  mgm: {
    nama: 'Mikala Global Medika',
    bio: 'Layanan perawat homecare, caregiver lansia & babysitter profesional.',
    foto: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png',
    links: [
      { label: 'Website', url: 'https://mikalaglobalmedika.com/' },
      { label: 'WhatsApp Admin 1', url: 'https://wa.me/6282114488878' },
      { label: 'WhatsApp Admin 2', url: 'https://wa.me/6281296998827' },
      { label: 'WhatsApp Admin 3', url: 'https://wa.me/6281513382031' },
      { label: 'Instagram', url: 'https://www.instagram.com/mikalaglobalmedika' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@mikalaglobalmedika_pt' },
      { label: 'Facebook', url: 'https://www.facebook.com/mikalaglobalmdk' },
      { label: 'YouTube', url: 'https://www.youtube.com/@MikalaGlobalMedika' },
    ],
  },
};

/** "0812-xxx" / "62812xxx" / "+62 812" -> https://wa.me/62812xxx; URL lain dibiarkan. */
function rapikanUrl(u: string): string {
  const t = u.trim();
  if (/^\+?[\d\s-]{8,}$/.test(t)) {
    let d = t.replace(/\D/g, '');
    if (d.startsWith('0')) d = '62' + d.slice(1); else if (d.startsWith('8')) d = '62' + d;
    return `https://wa.me/${d}`;
  }
  if (t && !/^(https?:|mailto:|tel:)/i.test(t)) return 'https://' + t;
  return t;
}

const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { fontSize: '12px', fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: '5px' };
const ikonBtn: React.CSSProperties = { background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text2)', display: 'flex' };

export default function LinktreeEditor({ onUpload }: { onUpload: (file: File, setter: (url: string) => void) => void }) {
  const [semua, setSemua] = useState<Record<string, Profil>>({});
  const [slug, setSlug] = useState('mgm');
  const [slugBaru, setSlugBaru] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get('/internal/cms/settings').then((r: any) => {
      let d: any = {};
      try { const raw = r.data?.data?.linktree; d = (typeof raw === 'string' ? JSON.parse(raw) : raw) || {}; } catch {}
      setSemua(Object.keys(d).length ? d : BAWAAN);
      setSlug(Object.keys(d)[0] || 'mgm');
    }).catch(() => setSemua(BAWAAN)).finally(() => setLoading(false));
  }, []);

  const p: Profil = semua[slug] || { nama: '', links: [] };
  const ubah = (patch: Partial<Profil>) => setSemua(s => ({ ...s, [slug]: { ...p, ...patch } }));
  const ubahLink = (i: number, patch: Partial<Link>) => ubah({ links: p.links.map((l, j) => j === i ? { ...l, ...patch } : l) });
  const geser = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= p.links.length) return;
    const l = [...p.links]; [l[i], l[j]] = [l[j], l[i]]; ubah({ links: l });
  };

  const tambahHalaman = () => {
    const s = slugBaru.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!s) return;
    if (!semua[s]) setSemua(x => ({ ...x, [s]: { nama: '', bio: '', foto: '', links: [] } }));
    setSlug(s); setSlugBaru('');
  };
  const hapusHalaman = () => {
    if (!confirm(`Hapus halaman /hub/${slug}?`)) return;
    const { [slug]: _, ...sisa } = semua;
    setSemua(sisa); setSlug(Object.keys(sisa)[0] || '');
  };

  const simpan = async () => {
    for (const [s, x] of Object.entries(semua)) if (!x.nama?.trim()) { alert(`Nama di halaman "${s}" wajib diisi`); setSlug(s); return; }
    const bersih = Object.fromEntries(Object.entries(semua).map(([s, x]) => [s, {
      ...x, links: x.links.filter(l => l.label.trim() && l.url.trim()).map(l => ({ ...l, label: l.label.trim(), url: rapikanUrl(l.url) })),
    }]));
    setSaving(true);
    try {
      await apiClient.post('/internal/cms/settings', { linktree: JSON.stringify(bersih) });
      setSemua(bersih);
      alert('Linktree tersimpan. Halaman publik terupdate dalam ±1 menit.');
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal menyimpan'); }
    setSaving(false);
  };

  if (loading) return <p style={{ color: 'var(--text3)', fontSize: '13px' }}>Memuat...</p>;

  return (
    <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>Linktree</h2>
        <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Halaman link bio untuk Instagram/TikTok, alamat: <b>{SITE.replace('https://', '')}/hub/&lt;nama&gt;</b></p>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.keys(semua).map(s => (
          <button key={s} onClick={() => setSlug(s)} style={{ padding: '7px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: s === slug ? 'linear-gradient(135deg,#0e92b3,#9c488b)' : 'var(--glass)', color: s === slug ? 'white' : 'var(--text2)', border: s === slug ? 'none' : '1px solid var(--border)' }}>/{s}</button>
        ))}
        <input value={slugBaru} onChange={e => setSlugBaru(e.target.value)} onKeyDown={e => e.key === 'Enter' && tambahHalaman()} placeholder="halaman baru, mis. mga" style={{ ...inp, width: '170px' }} />
        <button onClick={tambahHalaman} style={ikonBtn} title="Tambah halaman"><Plus size={15} /></button>
      </div>

      {slug && semua[slug] && <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div><label style={lbl}>Nama *</label><input value={p.nama} onChange={e => ubah({ nama: e.target.value })} style={inp} placeholder="Mikala Global Medika" /></div>
          <div><label style={lbl}>Bio singkat</label><input value={p.bio || ''} onChange={e => ubah({ bio: e.target.value })} style={inp} placeholder="Layanan perawat homecare ..." /></div>
          <div>
            <label style={lbl}>Logo / foto profil (URL)</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input value={p.foto || ''} onChange={e => ubah({ foto: e.target.value })} style={inp} placeholder="https://..." />
              <label style={{ ...ikonBtn, cursor: 'pointer' }} title="Upload gambar">
                <Upload size={15} />
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, url => ubah({ foto: url })); }} />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label style={lbl}>Daftar link (urutan = urutan tampil). URL boleh nomor WA langsung, mis. 0812xxxx → otomatis jadi link WhatsApp.</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {p.links.map((l, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,1fr) minmax(160px,2fr) 150px auto', gap: '6px', alignItems: 'center' }}>
                <input value={l.label} onChange={e => ubahLink(i, { label: e.target.value })} style={inp} placeholder="Judul tombol" />
                <input value={l.url} onChange={e => ubahLink(i, { url: e.target.value })} onBlur={e => ubahLink(i, { url: rapikanUrl(e.target.value) })} style={inp} placeholder="https://... atau 0812..." />
                <select value={l.ikon || ''} onChange={e => ubahLink(i, { ikon: e.target.value || undefined })} style={inp}>
                  {IKON.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => geser(i, -1)} style={ikonBtn} title="Naik"><ArrowUp size={14} /></button>
                  <button onClick={() => geser(i, 1)} style={ikonBtn} title="Turun"><ArrowDown size={14} /></button>
                  <button onClick={() => ubah({ links: p.links.filter((_, j) => j !== i) })} style={{ ...ikonBtn, color: '#ef4444' }} title="Hapus"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => ubah({ links: [...p.links, { label: '', url: '' }] })}
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--glass)', border: '1px dashed var(--border)', borderRadius: '10px', color: 'var(--text2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} />Tambah link
          </button>
        </div>
      </>}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={simpan} disabled={saving}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#0e92b3,#9c488b)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer', opacity: saving ? .6 : 1 }}>
          {saving ? 'Menyimpan...' : 'Simpan Linktree'}
        </button>
        {slug && <a href={`${SITE}/hub/${slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#0e92b3', textDecoration: 'none' }}>
          <ExternalLink size={14} />Lihat /hub/{slug}
        </a>}
        {slug && Object.keys(semua).length > 1 && <button onClick={hapusHalaman} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Hapus halaman ini</button>}
      </div>
    </div>
  );
}
