import Link from 'next/link';

const GREEN = '#0e92b3';
const PINK = '#9c488b';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";
const MAP_QUERY = encodeURIComponent('Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi');

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
    title: 'Layanan',
    links: [
      { l:'Perawat Medis', h:'/layanan' },
      { l:'Babysitter', h:'/layanan' },
      { l:'Perawat Jiwa', h:'/layanan' },
      { l:'Terapi', h:'/layanan' },
      { l:'Kunjungan Dokter', h:'/layanan' },
      { l:'Evakuasi Medis', h:'/layanan' },
      { l:'Penunjang Kesehatan', h:'/layanan' },
    ],
  },
  {
    title: 'Majalah',
    links: [
      { l:'Berita Perusahaan', h:'/artikel' },
      { l:'Tips Kesehatan', h:'/artikel' },
      { l:'Tokoh Kesehatan', h:'/artikel' },
      { l:'Pengembangan Diri', h:'/artikel' },
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

export default function Footer() {
  return (
    <footer style={{ background:'linear-gradient(160deg, #06333f 0%, #04232b 100%)', color:'white', padding:'60px 20px 24px' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr repeat(4, 1fr)', gap:'32px', marginBottom:'40px' }} className="footer-grid">
          <div>
            <img src={LOGO} alt="Mikala" style={{ height:'36px', marginBottom:'10px', filter:'brightness(0) invert(1)' }} />
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'12px', fontWeight:600, letterSpacing:'0.5px', margin:'0 0 14px' }}>
              Part of Mikala Global Group
            </p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'13px', lineHeight:1.8, margin:'0 0 18px' }}>
              Penyedia layanan medis terpercaya yang mendedikasikan diri untuk meningkatkan kesehatan masyarakat.
            </p>

            {/* Peta kecil */}
            <a href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`} target="_blank" rel="noreferrer" style={{ display:'block', marginBottom:'18px' }}>
              <iframe
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                width="100%" height="110" loading="lazy"
                style={{ border:0, borderRadius:'12px', filter:'grayscale(0.3) saturate(1.2)', pointerEvents:'none' }}
                title="Lokasi Mikala Global Medika"
              />
            </a>

            <div style={{ display:'flex', gap:'10px' }}>
              {[
                { href:'https://www.facebook.com/mikalaglobalmdk/', icon:'f', bg:'#1877f2' },
                { href:'https://www.instagram.com/mikalaglobalmedika/', icon:'ig', bg:'#e1306c' },
                { href:'https://www.tiktok.com/@mikalaglobalmedika_pt', icon:'tt', bg:'#000' },
                { href:'https://www.youtube.com/@MikalaGlobalMedika', icon:'yt', bg:'#ff0000' },
                { href:WA, icon:'wa', bg:'#25d366' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"
                  style={{ width:'34px', height:'34px', borderRadius:'8px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'10px', fontWeight:700, textDecoration:'none' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px', color:'white' }}>{col.title}</h4>
              {col.links.map(l => (
                <div key={l.l} style={{ marginBottom:'8px' }}>
                  <Link href={l.h} style={{ color:'rgba(255,255,255,0.55)', fontSize:'13px', textDecoration:'none' }}>{l.l}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>Copyright © 2026 mikalaglobalmedika.com. All Rights Reserved</p>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0, fontStyle:'italic' }}>With Love We Serve ❤️</p>
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
