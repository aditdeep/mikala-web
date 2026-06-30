'use client';
import Link from 'next/link';
import { useState } from 'react';
import TranslateButton from './TranslateButton';

const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";

const NAV_LINKS = [
  { href:'/', l:'Beranda' },
  { href:'/tentang', l:'Tentang' },
  { href:'/layanan', l:'Layanan' },
  { href:'/artikel', l:'Artikel' },
  { href:'/galeri', l:'Galeri' },
  { href:'/kontak', l:'Kontak' },
];

export default function Navbar({ active = '' }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.72)', backdropFilter:'blur(18px) saturate(180%)', WebkitBackdropFilter:'blur(18px) saturate(180%)', borderBottom:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 2px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'65px' }}>
          <Link href="/"><img src={LOGO} alt="Mikala" style={{ height:'36px', objectFit:'contain' }} /></Link>

          {/* Desktop */}
          <div style={{ display:'flex', alignItems:'center', gap:'24px' }} className="mgm-desktop-nav">
            {NAV_LINKS.map(n => (
              <Link key={n.href} href={n.href} style={{ color: active===n.href?GREEN:'#374151', fontSize:'14px', fontWeight: active===n.href?700:500, textDecoration:'none', borderBottom: active===n.href?`2px solid ${GREEN}`:'2px solid transparent', paddingBottom:'2px', transition:'all 0.2s' }}>{n.l}</Link>
            ))}
            <TranslateButton />
            <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'9px 20px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', boxShadow:`0 4px 12px rgba(45,122,94,0.3)` }}>Konsultasi</a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="mgm-mobile-menu-btn" style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:'8px', flexDirection:'column', gap:'5px' }}>
            <span style={{ display:'block', width:'22px', height:'2px', background:'#374151', transition:'all 0.3s', transform: open?'rotate(45deg) translateY(7px)':'none' }} />
            <span style={{ display:'block', width:'22px', height:'2px', background:'#374151', transition:'all 0.3s', opacity: open?0:1 }} />
            <span style={{ display:'block', width:'22px', height:'2px', background:'#374151', transition:'all 0.3s', transform: open?'rotate(-45deg) translateY(-7px)':'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background:'white', borderTop:'1px solid rgba(45,122,94,0.1)', padding:'16px 20px', display:'flex', flexDirection:'column', gap:'4px' }} className="mgm-mobile-nav mgm-zoom-anim">
            {NAV_LINKS.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                style={{ color: active===n.href?GREEN:'#374151', fontSize:'15px', fontWeight: active===n.href?700:500, textDecoration:'none', padding:'10px 12px', borderRadius:'10px', background: active===n.href?`${GREEN}10`:'transparent' }}>{n.l}</Link>
            ))}
            <div style={{ display:'flex', justifyContent:'center', margin:'8px 0' }}><TranslateButton scrolled={true} /></div>
            <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 20px', borderRadius:'12px', fontSize:'14px', fontWeight:600, textDecoration:'none', textAlign:'center', marginTop:'8px' }}>Konsultasi Sekarang</a>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes mgmZoomIn { 0% { opacity:0; transform:scale(0.92) translateY(-8px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
        .mgm-zoom-anim { animation: mgmZoomIn 0.28s cubic-bezier(0.34,1.56,0.64,1); transform-origin: top center; }
        @media (max-width: 768px) {
          .mgm-desktop-nav { display: none !important; }
          .mgm-mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
