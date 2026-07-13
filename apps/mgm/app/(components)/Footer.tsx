import Link from 'next/link';

const GREEN = '#0e92b3';
const PINK = '#9c488b';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";

export default function Footer() {
  return (
    <footer style={{ background:'#0a1f14', color:'white', padding:'60px 20px 24px' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'40px', marginBottom:'40px' }}>
          <div>
            <img src={LOGO} alt="Mikala" style={{ height:'36px', marginBottom:'16px', filter:'brightness(0) invert(1)' }} />
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'13px', lineHeight:1.8, margin:'0 0 20px' }}>
              Penyedia layanan medis terpercaya yang mendedikasikan diri untuk meningkatkan kesehatan masyarakat.
            </p>
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
          <div>
            <h4 style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px', color:'white' }}>Layanan</h4>
            {['Perawat Medis','Perawat Jiwa','Caregiver','Babysitter','Dokter Visit','Medikal Evakuasi'].map(l => (
              <div key={l} style={{ marginBottom:'8px' }}>
                <Link href="/layanan" style={{ color:'rgba(255,255,255,0.55)', fontSize:'13px', textDecoration:'none' }}>{l}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px', color:'white' }}>Navigasi</h4>
            {[{l:'Beranda',h:'/'},{l:'Perusahaan',h:'/perusahaan'},{l:'Artikel',h:'/artikel'},{l:'Galeri',h:'/galeri'},{l:'Kontak',h:'/kontak'}].map(n => (
              <div key={n.l} style={{ marginBottom:'8px' }}>
                <Link href={n.h} style={{ color:'rgba(255,255,255,0.55)', fontSize:'13px', textDecoration:'none' }}>{n.l}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px', color:'white' }}>Kontak</h4>
            {[
              { icon:'📍', text:'Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi' },
              { icon:'📞', text:'0821-1448-8878' },
              { icon:'✉️', text:'cs@mikalaglobalmedika.com' },
              { icon:'🕐', text:'Senin-Sabtu 08.00-21.00' },
            ].map(c => (
              <div key={c.icon} style={{ display:'flex', gap:'8px', marginBottom:'10px', color:'rgba(255,255,255,0.55)', fontSize:'13px' }}>
                <span style={{ flexShrink:0 }}>{c.icon}</span><span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>Copyright © 2026 mikalaglobalmedika.com. All Rights Reserved</p>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0, fontStyle:'italic' }}>With Love We Serve ❤️</p>
        </div>
      </div>
    </footer>
  );
}
