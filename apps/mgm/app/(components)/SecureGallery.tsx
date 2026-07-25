'use client';
import { useEffect } from 'react';

export default function SecureGallery({ images }: { images: string[] }) {
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      const k = e.key?.toUpperCase();
      if (
        k === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(k)) ||
        (e.ctrlKey && k === 'U')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', block);
    return () => document.removeEventListener('keydown', block);
  }, []);

  return (
    <div style={{ display:'flex', gap:'20px', justifyContent:'center', flexWrap:'wrap' }} onContextMenu={e => e.preventDefault()}>
      {images.map((img, i) => (
        <div key={i} style={{ position:'relative', flex:'0 0 auto', width:'220px', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderRadius:'16px', overflow:'hidden', border:'1px solid rgba(14,146,179,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', userSelect:'none' }}>
          <img
            src={img}
            alt={`Sertifikat ${i + 1}`}
            draggable={false}
            style={{ width:'100%', height:'280px', objectFit:'cover', pointerEvents:'none', userSelect:'none' }}
          />
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
            <span style={{ transform:'rotate(-30deg)', color:'rgba(255,255,255,0.4)', fontSize:'12px', fontWeight:800, letterSpacing:'2px', textShadow:'0 1px 3px rgba(0,0,0,0.35)', whiteSpace:'nowrap' }}>
              MIKALA GLOBAL MEDIKA
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
