'use client';
// Popup pengumuman di homepage MGM. Tampil SEKALI per pengunjung (disimpan di localStorage).
// Ganti / matikan pengumuman: ubah konstanta di bawah. Kalau isi pengumumannya berubah, ganti
// juga KEY supaya pengunjung yg sudah pernah menutup popup lama melihat yg baru.
import { useEffect, useState } from 'react';

const AKTIF = true;
const KEY = 'mgm_popup_hotline_wa_2026_10';
const GAMBAR = '/pengumuman-hotline-wa.jpg';
const ALT = 'Pemberitahuan: Hotline WhatsApp Official Mikala Global Medika dialihkan sementara dari 0821-1448-8878 menjadi 0815-1338-2031, karena sedang perbaikan akun hotline WhatsApp official.';
const WA_BARU = 'https://wa.me/6281513382031?text=' + encodeURIComponent('Halo Mikala Global Medika, saya ingin bertanya.');
const WA_LABEL = 'WhatsApp 0815-1338-2031';

export default function PengumumanPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!AKTIF) return;
    let sudah = false;
    try { sudah = localStorage.getItem(KEY) === '1'; } catch {}
    if (sudah) return;
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') tutup(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const tutup = () => {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Pemberitahuan" onClick={tutup}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,15,30,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'mgmPopupFade .25s ease-out' }}>
      <style>{`
        @keyframes mgmPopupFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mgmPopupUp { from { opacity: 0; transform: translateY(16px) scale(.98) } to { opacity: 1; transform: none } }
      `}</style>
      <div onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: '760px', animation: 'mgmPopupUp .3s ease-out' }}>
        {/* tombol tutup di LUAR gambar (sudut kartu), supaya tidak menutupi judul "Pemberitahuan!" */}
        <button onClick={tutup} aria-label="Tutup pemberitahuan"
          style={{ position: 'absolute', top: '-12px', right: '-8px', width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #fff', background: '#0f172a', color: '#fff', fontSize: '22px', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 4px 14px rgba(0,0,0,0.35)' }}>
          ×
        </button>
        <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.35)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={GAMBAR} alt={ALT} width={1600} height={1131}
          style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '72vh', objectFit: 'contain', background: '#fff' }} />
        <div style={{ padding: '12px', borderTop: '1px solid #eef2f7' }}>
          <a href={WA_BARU} target="_blank" rel="noopener noreferrer" onClick={tutup}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 14px', borderRadius: '12px', background: '#25d366', color: '#fff', fontWeight: 700, fontSize: 'clamp(13px, 4vw, 16px)', textDecoration: 'none', textAlign: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.5zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.9 9.9 0 0 1-1.5-5.3c0-5.5 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.5 9.9-10 9.9zm5.4-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>
            {WA_LABEL}
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}
