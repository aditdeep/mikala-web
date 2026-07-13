'use client';
import { useState, useEffect } from 'react';

const GREEN = '#0e92b3';

export default function TranslateButton({ scrolled = false }: { scrolled?: boolean }) {
  const [lang, setLang] = useState<'id'|'en'>('id');

  useEffect(() => {
    // Baca cookie Google Translate untuk detect bahasa aktif
    const saved = localStorage.getItem('mgm-translate-lang') as 'id'|'en';
    if (saved) setLang(saved);
  }, []);

  const translate = (to: 'id'|'en') => {
    setLang(to);
    localStorage.setItem('mgm-translate-lang', to);

    // hapus cookie googtrans di SEMUA scope dulu (biar bersih)
    const host = window.location.hostname;
    const rootDomain = '.' + host.split('.').slice(-2).join('.'); // .mikalaglobalmedika.com
    const clearCookie = (domain?: string) => {
      const d = domain ? `; domain=${domain}` : '';
      document.cookie = `googtrans=; path=/${d}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    };
    clearCookie();
    clearCookie(host);
    clearCookie(rootDomain);

    if (to === 'en') {
      // set cookie English di semua scope
      document.cookie = `googtrans=/id/en; path=/`;
      document.cookie = `googtrans=/id/en; path=/; domain=${host}`;
      document.cookie = `googtrans=/id/en; path=/; domain=${rootDomain}`;
    }
    // kalau to === 'id', cukup hapus (udah di atas) → balik default Indonesia
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', gap: '2px', background: scrolled ? 'rgba(14,146,179,0.08)' : 'rgba(255,255,255,0.14)', borderRadius: '10px', padding: '3px', border: `1px solid ${scrolled ? 'rgba(14,146,179,0.15)' : 'rgba(255,255,255,0.25)'}` }}>
      <button onClick={() => translate('id')}
        style={{
          padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', border: 'none', transition: 'all 0.2s',
          background: lang === 'id' ? (scrolled ? GREEN : 'white') : 'transparent',
          color: lang === 'id' ? (scrolled ? 'white' : GREEN) : (scrolled ? '#6b7280' : 'rgba(255,255,255,0.65)'),
        }}>
        🇮🇩 ID
      </button>
      <button onClick={() => translate('en')}
        style={{
          padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', border: 'none', transition: 'all 0.2s',
          background: lang === 'en' ? (scrolled ? GREEN : 'white') : 'transparent',
          color: lang === 'en' ? (scrolled ? 'white' : GREEN) : (scrolled ? '#6b7280' : 'rgba(255,255,255,0.65)'),
        }}>
        🇬🇧 EN
      </button>
    </div>
  );
}
