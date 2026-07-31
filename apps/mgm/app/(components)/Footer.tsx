import Link from 'next/link';
import { slugify } from '@/lib/slug';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK = '#9c488b';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6282114488878";
const PHONE_DISPLAY = "0821-1448-8878";
const MAP_QUERY = encodeURIComponent('Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi');
const ADDRESS = 'Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi';

const defaultSocial = [
  { label:'Facebook', url:'https://www.facebook.com/mikalaglobalmdk/', icon:'', letter:'f', bg:'#1877f2' },
  { label:'Instagram', url:'https://www.instagram.com/mikalaglobalmedika/', icon:'', letter:'ig', bg:'#e1306c' },
  { label:'TikTok', url:'https://www.tiktok.com/@mikalaglobalmedika_pt', icon:'', letter:'tt', bg:'#000' },
  { label:'YouTube', url:'https://www.youtube.com/@MikalaGlobalMedika', icon:'', letter:'yt', bg:'#ff0000' },
  { label:'WhatsApp', url: WA, icon:'', letter:'wa', bg:'#25d366' },
];

async function getSocialIcons() {
  try {
    const res = await fetch(`${API}/cms/settings`, { next: { revalidate: 60 } });
    const data = await res.json();
    const raw = data.data?.footer_social_icons;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return defaultSocial;
}

const defaultLayananNames = [
  'Perawat Medis', 'Babysitter', 'Perawat Jiwa', 'Terapi',
  'Dokter Visit', 'Medikal Evakuasi', 'Pelayanan Penunjang', 'Persewaan & Penjualan Alat Medis',
];

async function getLayananLinks() {
  try {
    const res = await fetch(`${API}/cms/layanan`, { next: { revalidate: 60 } });
    const data = await res.json();
    const list = Array.isArray(data.data) && data.data.length > 0 ? data.data : defaultLayananNames.map(n => ({ nama: n }));
    return list.slice(0, 7).map((l: any) => ({ l: l.nama, h: `/layanan/${slugify(l.nama)}` }));
  } catch {
    return defaultLayananNames.slice(0, 7).map(n => ({ l: n, h: `/layanan/${slugify(n)}` }));
  }
}

const COLS = [
  {
    title: 'Perusahaan',
    links: [
      { l:'Tentang Kami', h:'/perusahaan' },
      { l:'Sambutan Pendiri', h:'/perusahaan/prakata' },
      { l:'Perizinan', h:'/perusahaan#legalitas' },
      { l:'Akademi Pelatihan', h:'/perusahaan#mga' },
      { l:'Karir', h:'/perusahaan#mga' },
    ],
  },
  {
    title: 'Majalah',
    links: [
      { l:'Artikel Kesehatan', h:'/artikel?kategori=' + encodeURIComponent('Artikel Kesehatan') },
      { l:'Berita Perusahaan', h:'/artikel?kategori=' + encodeURIComponent('Berita Perusahaan') },
      { l:'Tips Kesehatan', h:'/artikel?kategori=' + encodeURIComponent('Tips Kesehatan') },
      { l:'Tokoh Kesehatan', h:'/artikel?kategori=' + encodeURIComponent('Tokoh Kesehatan') },
      { l:'Pengembangan Diri', h:'/artikel?kategori=' + encodeURIComponent('Pengembangan Diri') },
    ],
  },
  {
    title: 'Kontak',
    links: [
      { l:'Hubungi Kami', h:'/kontak' },
      { l:'Kerjasama', h:'/kontak' },
      { l:'FAQ', h:'/kontak' },
    ],
  },
];

export default async function Footer() {
  const [socialIcons, layananLinks] = await Promise.all([getSocialIcons(), getLayananLinks()]);
  const cols = [
    COLS[0],
    { title: 'Layanan', links: layananLinks },
    ...COLS.slice(1),
  ];
  return (
    <footer style={{ background:'linear-gradient(160deg, #cbddd9 0%, #b8d6ce 100%)', color:'#1a2e25', padding:'60px 20px 24px' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr repeat(4, 1fr)', gap:'32px', marginBottom:'40px' }} className="footer-grid">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
              <div style={{ width:'48px', height:'48px', borderRadius:'12px', overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.65)' }}>
                <img src={LOGO} alt="Mikala" style={{ height:'48px', width:'48px', objectFit:'cover', objectPosition:'left center' }} />
              </div>
              <div>
                <p style={{ color:'rgba(26,46,37,0.65)', fontSize:'12px', margin:'0 0 2px' }}>Part of:</p>
                <p style={{ color:'#1a2e25', fontSize:'16px', fontWeight:800, letterSpacing:'0.3px', margin:0 }}>MIKALA GLOBAL GROUP</p>
              </div>
            </div>

            <p style={{ color:'rgba(26,46,37,0.7)', fontSize:'14px', lineHeight:1.8, margin:'0 0 10px', display:'flex', gap:'8px' }}>
              <span>📍</span><span>{ADDRESS}</span>
            </p>
            <a href={WA} target="_blank" rel="noreferrer" style={{ color:'#0e6a80', fontSize:'14px', lineHeight:1.8, margin:'0 0 18px', display:'flex', gap:'8px', textDecoration:'none', fontWeight:600 }}>
              <span>📞</span><span>{PHONE_DISPLAY}</span>
            </a>

            {/* Peta kecil */}
            <a href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`} target="_blank" rel="noreferrer" style={{ display:'block', marginBottom:'18px' }}>
              <iframe
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                width="100%" height="110" loading="lazy"
                style={{ border:0, borderRadius:'12px', pointerEvents:'none' }}
                title="Lokasi Mikala Global Medika"
              />
            </a>

            <div style={{ display:'flex', gap:'10px' }}>
              {socialIcons.map((s: any, i: number) => (
                <a key={i} href={s.url||s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  style={{ width:'34px', height:'34px', borderRadius:'8px', background: s.icon ? 'transparent' : (s.bg||GREEN), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'10px', fontWeight:700, textDecoration:'none', overflow:'hidden' }}>
                  {s.icon ? <img src={s.icon} alt={s.label||''} style={{ width:'34px', height:'34px', objectFit:'contain' }} /> : (s.letter||s.icon||'?')}
                </a>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight:700, fontSize:'15px', marginBottom:'16px', color:'#1a2e25' }}>{col.title}</h4>
              {col.links.map(l => (
                <div key={l.l} style={{ marginBottom:'8px' }}>
                  <Link href={l.h} style={{ color:'rgba(26,46,37,0.7)', fontSize:'14px', textDecoration:'none' }}>{l.l}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(26,46,37,0.15)', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
          <p style={{ color:'rgba(26,46,37,0.55)', fontSize:'13px', margin:0 }}>Copyright © 2026 mikalaglobalmedika.com. All Rights Reserved</p>
          <p style={{ color:'rgba(26,46,37,0.55)', fontSize:'13px', margin:0, fontStyle:'italic' }}>With Love We Serve ❤️</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important; }
        }
      `}</style>
    </footer>
  );
}
