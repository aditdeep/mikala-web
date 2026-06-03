'use client';
import { useState, useEffect } from 'react';

export default function TranslateButton({ scrolled = false }: { scrolled?: boolean }) {
  const [lang, setLang] = useState<'id'|'en'>('id');

  useEffect(() => {
    // Baca cookie Google Translate untuk detect bahasa aktif
    const saved = localStorage.getItem('mga-translate-lang') as 'id'|'en';
    if (saved) setLang(saved);
  }, []);

  const translate = (to: 'id'|'en') => {
    setLang(to);
    localStorage.setItem('mga-translate-lang', to);

    if (to === 'en') {
      // Set cookie googtrans untuk English
      document.cookie = `googtrans=/id/en; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/id/en; path=/`;
    } else {
      // Reset ke Indonesia
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', gap: '2px', background: scrolled ? 'rgba(26,46,40,0.08)' : 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '3px', border: `1px solid ${scrolled ? 'rgba(26,46,40,0.15)' : 'rgba(255,255,255,0.2)'}` }}>
      <button onClick={() => translate('id')}
        style={{
          padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', border: 'none', transition: 'all 0.2s',
          background: lang === 'id' ? (scrolled ? 'var(--green)' : 'white') : 'transparent',
          color: lang === 'id' ? (scrolled ? 'white' : 'var(--green)') : (scrolled ? 'var(--text3)' : 'rgba(255,255,255,0.6)'),
        }}>
        🇮🇩 ID
      </button>
      <button onClick={() => translate('en')}
        style={{
          padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', border: 'none', transition: 'all 0.2s',
          background: lang === 'en' ? (scrolled ? 'var(--green)' : 'white') : 'transparent',
          color: lang === 'en' ? (scrolled ? 'white' : 'var(--green)') : (scrolled ? 'var(--text3)' : 'rgba(255,255,255,0.6)'),
        }}>
        🇬🇧 EN
      </button>
    </div>
  );
}
