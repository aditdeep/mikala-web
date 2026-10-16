'use client';
import { useEffect } from 'react';

/**
 * Keyboard HP sering menutupi field input di PWA (terutama iOS, yg mengabaikan
 * viewport interactive-widget). Saat field difokus: tandai <html class="kb-open"> (menu
 * bawah disembunyikan lewat CSS) lalu gulir field ke tengah area yg masih terlihat.
 */
const BUKAN_KETIK = ['checkbox', 'radio', 'file', 'button', 'submit', 'range', 'color'];

function isField(el: EventTarget | null): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable) return true;
  return el.tagName === 'INPUT' && !BUKAN_KETIK.includes((el as HTMLInputElement).type);
}

export default function KeyboardFix() {
  useEffect(() => {
    const root = document.documentElement;
    let tutup: ReturnType<typeof setTimeout> | undefined;
    const gulir = (el: HTMLElement) => setTimeout(() => {
      if (document.activeElement === el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 350);

    const onFocusIn = (e: FocusEvent) => {
      if (!isField(e.target)) return;
      clearTimeout(tutup);
      root.classList.add('kb-open');
      gulir(e.target);
    };
    // jeda kecil: pindah dari satu field ke field lain jangan bikin menu bawah kedip
    const onFocusOut = () => { tutup = setTimeout(() => { if (!isField(document.activeElement)) root.classList.remove('kb-open'); }, 150); };
    // keyboard selesai muncul / ganti tinggi (iOS) -> pastikan field aktif tetap terlihat
    const onResize = () => { const el = document.activeElement; if (isField(el)) gulir(el); };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      window.visualViewport?.removeEventListener('resize', onResize);
      clearTimeout(tutup);
    };
  }, []);
  return null;
}
