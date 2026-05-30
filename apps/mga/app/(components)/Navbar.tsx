'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO = 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png';
const MITRA_DAFTAR = 'https://mikala-web-mitra.vercel.app/auth/register';

const NAV = [
  { label: 'Beranda',     en: 'Home',     href: '/' },
  { label: 'Tentang',     en: 'About',    href: '/tentang' },
  { label: 'Program',     en: 'Program',  href: '/program' },
  { label: 'Galeri',      en: 'Gallery',  href: '/galeri' },
  { label: 'Artikel',     en: 'Articles', href: '/artikel' },
  { label: 'Kontak',      en: 'Contact',  href: '/kontak' },
];

export default function Navbar({ active = '/', lang = 'id' }: { active?: string; lang?: string }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [curLang, setCurLang]     = useState(lang);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,122,94,0.1)' : 'none',
        transition: 'all 0.3s',
        padding: '0 clamp(16px,4vw,48px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '72px', gap: '32px' }}>
          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0 }}>
            <img src={LOGO} alt="MGA" style={{ height: '36px', objectFit: 'contain' }}/>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }} className="hide-mobile">
            {NAV.map(n => {
              const isActive = active === n.href;
              return (
                <Link key={n.href} href={n.href} style={{
                  padding: '8px 14px', borderRadius: '10px', fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--green)' : scrolled ? 'var(--text2)' : 'rgba(255,255,255,0.9)',
                  background: isActive ? 'var(--green3)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  {curLang === 'id' ? n.label : n.en}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexShrink: 0 }}>
            {/* Lang toggle */}
            <button onClick={() => setCurLang(l => l === 'id' ? 'en' : 'id')}
              style={{ background: 'transparent', border: `1px solid ${scrolled ? 'var(--border)' : 'rgba(255,255,255,0.4)'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: scrolled ? 'var(--text2)' : 'white' }}>
              {curLang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>

            <a href={MITRA_DAFTAR} className="btn-primary" style={{ padding: '9px 20px', fontSize: '13px' }} target="_blank" rel="noreferrer">
              {curLang === 'id' ? 'Daftar Sekarang' : 'Apply Now'} →
            </a>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(m => !m)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              className="hide-desktop" id="hamburger">
              <div style={{ width: '24px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[0,1,2].map(i => <span key={i} style={{ display: 'block', height: '2px', background: scrolled ? 'var(--text)' : 'white', borderRadius: '2px', transition: 'all 0.3s' }}/>)}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', padding: '80px 24px 24px' }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
              style={{ padding: '16px 0', fontSize: '20px', fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
              {curLang === 'id' ? n.label : n.en}
            </Link>
          ))}
          <a href={MITRA_DAFTAR} className="btn-primary" style={{ marginTop: '24px', justifyContent: 'center' }} target="_blank" rel="noreferrer">
            {curLang === 'id' ? '🚀 Daftar Sekarang' : '🚀 Apply Now'}
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #hamburger { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
