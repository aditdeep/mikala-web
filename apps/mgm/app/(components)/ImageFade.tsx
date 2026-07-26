'use client';
import { useState, useEffect, useCallback } from 'react';
import { cldOptimize } from '@/lib/cloudinary';

export default function ImageFade({ images, alt, arrows = false }: { images: string[]; alt: string; arrows?: boolean }) {
  const list = images && images.length > 0 ? images : ['https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png'];
  const [idx, setIdx] = useState(0);
  const n = list.length;

  const go = useCallback((i: number) => setIdx((i + n) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx(p => (p + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div style={{ position:'absolute', inset:0 }}>
      {list.map((img, i) => (
        <img key={i} src={cldOptimize(img, 1800)} alt={alt} style={{
          position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
          opacity: i === idx ? 1 : 0, transition:'opacity 1.2s ease',
        }} />
      ))}

      {arrows && n > 1 && (
        <>
          <button onClick={() => go(idx - 1)} aria-label="Prev" className="imgfade-arrow" style={{ left:'14px' }}>‹</button>
          <button onClick={() => go(idx + 1)} aria-label="Next" className="imgfade-arrow" style={{ right:'14px' }}>›</button>
          <style>{`
            .imgfade-arrow {
              position: absolute; top: 50%; transform: translateY(-50%); z-index: 4;
              width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
              background: rgba(255,255,255,0.18); backdrop-filter: blur(8px);
              border: 1px solid rgba(255,255,255,0.35); color: white; font-size: 22px; line-height: 1;
              display: flex; align-items: center; justify-content: center; transition: background 0.2s;
            }
            .imgfade-arrow:hover { background: rgba(255,255,255,0.32); }
          `}</style>
        </>
      )}
    </div>
  );
}
