'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TranslateButton from './TranslateButton';

const GREEN = '#0e92b3';
const PINK = '#9c488b';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";

const NAV_LINKS = [
  { href:'/', l:'Beranda' },
  { href:'/perusahaan', l:'Perusahaan' },
  { href:'/layanan', l:'Layanan' },
  { href:'/artikel', l:'Artikel' },
  { href:'/galeri', l:'Galeri' },
  { href:'/kontak', l:'Kontak' },
];

function SearchIcon({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.4" y2="16.4" />
    </svg>
  );
}

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="white">
      <path d="M16.001 3C9.107 3 3.5 8.607 3.5 15.5c0 2.44.696 4.72 1.9 6.653L3 29l7.03-2.35a12.44 12.44 0 0 0 5.97 1.522c6.894 0 12.5-5.607 12.5-12.5S22.895 3 16.001 3zm0 22.75a10.2 10.2 0 0 1-5.212-1.428l-.374-.222-4.172 1.395 1.42-4.067-.244-.418A10.2 10.2 0 0 1 5.75 15.5c0-5.652 4.6-10.25 10.251-10.25 5.652 0 10.25 4.598 10.25 10.25 0 5.653-4.598 10.25-10.25 10.25zm5.63-7.68c-.31-.155-1.828-.902-2.11-1.005-.283-.103-.489-.155-.694.155-.206.31-.798 1.005-.978 1.211-.18.206-.36.232-.669.077-.31-.155-1.309-.483-2.494-1.54-.922-.823-1.545-1.84-1.726-2.15-.18-.31-.02-.478.136-.632.14-.14.31-.362.464-.542.155-.18.206-.31.31-.516.103-.206.052-.387-.026-.542-.077-.155-.694-1.674-.952-2.293-.25-.6-.505-.519-.694-.529-.18-.008-.386-.01-.592-.01-.206 0-.542.077-.826.387-.283.31-1.082 1.057-1.082 2.577 0 1.52 1.108 2.988 1.263 3.194.155.206 2.18 3.33 5.283 4.67.738.319 1.314.51 1.763.652.741.236 1.415.203 1.948.123.594-.089 1.828-.747 2.086-1.469.257-.722.257-1.34.18-1.469-.077-.129-.283-.206-.593-.361z" />
    </svg>
  );
}

export default function Navbar({ active = '' }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/artikel?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.72)', backdropFilter:'blur(18px) saturate(180%)', WebkitBackdropFilter:'blur(18px) saturate(180%)', borderBottom:'1px solid rgba(14,146,179,0.12)', boxShadow:'0 2px 20px rgba(14,146,179,0.06)' }}>
        <div style={{ maxWidth:'1440px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', gap:'20px', height:'86px' }} className="mgm-nav-inner">
          <Link href="/" style={{ flexShrink:0 }}><img src={LOGO} alt="Mikala" style={{ height:'44px', objectFit:'contain' }} /></Link>

          {/* Search bar - selalu tampil */}
          <form onSubmit={doSearch} style={{ flex:1, maxWidth:'420px', display:'flex' }} className="mgm-search-form">
            <div style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', background:'rgba(14,146,179,0.06)', border:'1px solid rgba(14,146,179,0.15)', borderRadius:'22px', padding:'11px 16px' }}>
              <SearchIcon color={GREEN} size={16} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Apa yang Anda cari?"
                style={{ border:'none', outline:'none', background:'transparent', fontSize:'14px', color:'#1a2e25', width:'100%' }}
              />
            </div>
          </form>

          <div style={{ flex:1 }} className="mgm-spacer" />

          {/* Desktop nav links */}
          <div style={{ display:'flex', alignItems:'center', gap:'30px' }} className="mgm-desktop-nav">
            {NAV_LINKS.map(n => (
              <Link key={n.href} href={n.href} style={{ color: active===n.href?GREEN:'#374151', fontSize:'15.5px', fontWeight: active===n.href?700:600, textDecoration:'none', borderBottom: active===n.href?`2px solid ${GREEN}`:'2px solid transparent', paddingBottom:'3px', transition:'all 0.2s', whiteSpace:'nowrap' }}>{n.l}</Link>
            ))}
          </div>

          <TranslateButton />

          <a href={WA} target="_blank" rel="noreferrer" aria-label="WhatsApp"
            style={{ flexShrink:0, width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg,#25d366,#1fb655)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(37,211,102,0.35)' }} className="hide-mobile">
            <WaIcon size={20} />
          </a>

          {/* Hamburger - selalu tampil, buka panel gradient */}
          <button onClick={() => setOpen(true)} aria-label="Menu" style={{ flexShrink:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, border:'none', borderRadius:'13px', cursor:'pointer', width:'46px', height:'46px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'5px', boxShadow:`0 4px 14px rgba(14,146,179,0.35)` }}>
            <span style={{ display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px' }} />
            <span style={{ display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px' }} />
            <span style={{ display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px' }} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(6,20,26,0.45)', backdropFilter:'blur(2px)', zIndex:199 }} />
      )}

      {/* Slide-out gradient glass panel */}
      <div className={`mgm-panel ${open ? 'mgm-panel-open' : ''}`} style={{
        position:'fixed', top:0, right:0, height:'100%', width:'min(360px,88vw)', zIndex:200,
        background:`linear-gradient(160deg, ${GREEN} 0%, #6a6ba0 50%, ${PINK} 100%)`,
        borderTopLeftRadius:'28px', borderBottomLeftRadius:'28px',
        boxShadow:'-10px 0 50px rgba(0,0,0,0.25)',
        display:'flex', flexDirection:'column', padding:'20px 26px 26px',
        backdropFilter:'blur(20px) saturate(160%)', WebkitBackdropFilter:'blur(20px) saturate(160%)',
        border:'1px solid rgba(255,255,255,0.15)', borderRight:'none',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'22px' }}>
          <Link href="/" onClick={() => setOpen(false)} aria-label="Beranda" style={{ width:'38px', height:'38px', borderRadius:'12px', background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/></svg>
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Tutup" style={{ width:'38px', height:'38px', borderRadius:'12px', background:'rgba(255,255,255,0.18)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="white" strokeWidth="2.4" strokeLinecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
          </button>
        </div>

        {/* Search di dalam panel (mobile-friendly) */}
        <form onSubmit={doSearch} style={{ marginBottom:'22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.16)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'16px', padding:'10px 14px' }}>
            <SearchIcon color="white" size={15} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Apa yang Anda cari?"
              style={{ border:'none', outline:'none', background:'transparent', fontSize:'13px', color:'white', width:'100%' }}
            />
          </div>
        </form>

        <div style={{ display:'flex', flexDirection:'column', gap:'4px', flex:1, overflowY:'auto' }}>
          {NAV_LINKS.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', color:'white', fontSize:'21px', fontWeight: active===n.href?800:700, textDecoration:'none', padding:'12px 6px', borderBottom:'1px solid rgba(255,255,255,0.15)', opacity: active===n.href?1:0.92 }}>
              {n.l}
              {active===n.href && <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'white' }} />}
            </Link>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'center', margin:'18px 0 14px' }}><TranslateButton /></div>

        <a href={WA} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background:'rgba(255,255,255,0.95)', color:GREEN, padding:'13px', borderRadius:'14px', fontSize:'14px', fontWeight:700, textDecoration:'none', marginBottom:'18px' }}>
          <WaIcon size={16} /> Konsultasi via WhatsApp
        </a>

        <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginBottom:'14px' }}>
          {[
            { href:'https://www.facebook.com/mikalaglobalmdk/', label:'f' },
            { href:'https://www.instagram.com/mikalaglobalmedika/', label:'ig' },
            { href:'https://www.tiktok.com/@mikalaglobalmedika_pt', label:'tt' },
            { href:'https://www.youtube.com/@MikalaGlobalMedika', label:'yt' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'10px', fontWeight:700, textDecoration:'none' }}>{s.label}</a>
          ))}
        </div>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.85)', fontSize:'12px', fontStyle:'italic', margin:'0 0 4px' }}>"With Love We Serve"</p>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:'10px', margin:0 }}>Copyright © 2026 mikalaglobalmedika.com</p>
      </div>

      <style>{`
        .mgm-panel { transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.32,0.72,0,1); }
        .mgm-panel-open { transform: translateX(0); }
        @media (max-width: 900px) {
          .mgm-desktop-nav { display: none !important; }
          .mgm-spacer { display: none !important; }
          .mgm-nav-inner { height: 68px !important; padding: 0 16px !important; }
          .mgm-nav-inner img { height: 34px !important; }
        }
        @media (max-width: 480px) {
          .mgm-search-form { max-width: 150px !important; }
        }
      `}</style>
    </>
  );
}
