'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO = 'https://res.cloudinary.com/djgtchmsx/image/upload/v1780153869/logo-mga-web_digdlz.png';
const MITRA_DAFTAR = 'https://mikala-web-mitra.vercel.app/auth/register';

const NAV = [
  { label: 'Beranda',  en: 'Home',    href: '/' },
  { label: 'Tentang',  en: 'About',   href: '/tentang' },
  { label: 'Program',  en: 'Program', href: '/program' },
  { label: 'Galeri',   en: 'Gallery', href: '/galeri' },
  { label: 'Artikel',  en: 'Articles',href: '/artikel' },
  { label: 'Kontak',   en: 'Contact', href: '/kontak' },
];

export default function Navbar({ active = '/', lang = 'id' }: { active?: string; lang?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [curLang, setCurLang]   = useState(lang);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll saat menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
            <img src={LOGO} alt="MGA" style={{ height: '38px', objectFit: 'contain' }}/>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}
            className="mga-desktop-nav">
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

            {/* Daftar button — hide on mobile */}
            <a href={MITRA_DAFTAR} className="btn-primary mga-daftar-btn"
              style={{ padding: '9px 20px', fontSize: '13px' }} target="_blank" rel="noreferrer">
              {curLang === 'id' ? 'Daftar Sekarang' : 'Apply Now'} →
            </a>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(m => !m)}
              className="mga-hamburger"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px', width: '36px' }}>
              <span style={{ display: 'block', height: '2px', borderRadius: '2px', transition: 'all 0.3s', background: scrolled || menuOpen ? 'var(--text)' : 'white', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}/>
              <span style={{ display: 'block', height: '2px', borderRadius: '2px', transition: 'all 0.3s', background: scrolled || menuOpen ? 'var(--text)' : 'white', opacity: menuOpen ? 0 : 1 }}/>
              <span style={{ display: 'block', height: '2px', borderRadius: '2px', transition: 'all 0.3s', background: scrolled || menuOpen ? 'var(--text)' : 'white', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu — overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 998,
        background: 'rgba(0,0,0,0.5)',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }} onClick={() => setMenuOpen(false)}/>

      {/* Mobile Slide Panel — dari kanan */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 999,
        width: 'min(320px, 85vw)',
        background: 'white',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
      }}>
        {/* Panel header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <img src={LOGO} alt="MGA" style={{ height: '32px', objectFit: 'contain' }}/>
          <button onClick={() => setMenuOpen(false)}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '7px 10px', cursor: 'pointer', fontSize: '16px', color: 'var(--text)', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {NAV.map((n, i) => {
            const isActive = active === n.href;
            return (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 24px', fontSize: '16px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--green)' : 'var(--text)',
                  background: isActive ? 'var(--green3)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--green)' : '3px solid transparent',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                  transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
                  transitionDelay: menuOpen ? `${i * 40}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                }}>
                <span>{curLang === 'id' ? n.label : n.en}</span>
                {isActive && <span style={{ color: 'var(--green)', fontSize: '12px' }}>●</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href={MITRA_DAFTAR} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--green), var(--green2))', color: 'white', padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,122,94,0.3)' }}
            onClick={() => setMenuOpen(false)}>
            🚀 {curLang === 'id' ? 'Daftar Sekarang' : 'Apply Now'}
          </a>
          <button onClick={() => { setCurLang(l => l === 'id' ? 'en' : 'id'); }}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text2)' }}>
            {curLang === 'id' ? '🇬🇧 Switch to English' : '🇮🇩 Ganti ke Indonesia'}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mga-hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .mga-desktop-nav { display: none !important; }
          .mga-daftar-btn { display: none !important; }
          .mga-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
