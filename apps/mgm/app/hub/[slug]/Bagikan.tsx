'use client';
import { useEffect, useState } from 'react';

/** Tombol bagikan + lembar QR code (QR sudah digenerate di server sbg PNG data URL). */
export default function Bagikan({ url, qr, nama, slug }: { url: string; qr: string; nama: string; slug: string }) {
  const [buka, setBuka] = useState(false);
  const [tersalin, setTersalin] = useState(false);
  const [bisaShare, setBisaShare] = useState(false);

  useEffect(() => { setBisaShare(typeof navigator !== 'undefined' && !!navigator.share); }, []);
  useEffect(() => {
    if (!buka) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setBuka(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [buka]);

  const salin = async () => {
    try { await navigator.clipboard.writeText(url); setTersalin(true); setTimeout(() => setTersalin(false), 1600); } catch {}
  };

  return (
    <>
      <button className="hub-share" onClick={() => setBuka(true)} aria-label="Bagikan & QR code">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <path d="M6 6h2v2H6zM16 6h2v2h-2zM6 16h2v2H6z" fill="currentColor" stroke="none" />
          <path d="M14 14h2.5v2.5H14zM18 14h2.5v2.5H18zM16 18h2.5v2.5H16z" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {buka && (
        <div className="hub-sheet-latar" onClick={() => setBuka(false)}>
          <div className="hub-sheet" role="dialog" aria-modal="true" aria-label={`Bagikan ${nama}`} onClick={e => e.stopPropagation()}>
            <div className="hub-sheet-pegangan" />
            <p className="hub-sheet-judul">Bagikan {nama}</p>
            <div className="hub-qr"><img src={qr} alt={`QR code ${url}`} width={220} height={220} /></div>
            <p className="hub-sheet-url">{url.replace(/^https?:\/\//, '')}</p>
            <div className="hub-sheet-aksi">
              <button onClick={salin}>{tersalin ? '✓ Tersalin' : 'Salin Link'}</button>
              {bisaShare && <button onClick={() => navigator.share({ title: nama, url }).catch(() => {})}>Bagikan</button>}
              <a href={qr} download={`qr-${slug}.png`}>Unduh QR</a>
            </div>
            <button className="hub-sheet-tutup" onClick={() => setBuka(false)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}
