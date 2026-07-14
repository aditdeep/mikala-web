'use client';
import { useState, useEffect, useCallback } from 'react';

type Slide = { image: string; title?: string; subtitle?: string };

const GREEN = '#0e92b3';
const PINK = '#9c488b';
const WA = 'https://wa.me/6281296998827';

export default function HeroSlider({ slides, fallbackTitle, fallbackSubtitle }: {
  slides: Slide[];
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}) {
  const list = (slides && slides.length > 0) ? slides : [{
    image: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png',
    title: fallbackTitle || 'Melayani Kebutuhan Kesehatan Anda',
    subtitle: fallbackSubtitle || 'Penyedia layanan homecare terpercaya',
  }];

  const [idx, setIdx] = useState(0);
  const n = list.length;
  const go = useCallback((i: number) => setIdx((i + n) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx(p => (p + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', background: `linear-gradient(135deg, #04232b 0%, #0a5568 35%, #0e92b3 65%, #9c488b 100%)` }}>
      {list.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, opacity: i === idx ? 1 : 0,
          transition: 'opacity 1s ease', zIndex: i === idx ? 1 : 0,
        }}>
          <img src={s.image} alt={s.title || 'Mikala'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,35,43,0.35) 0%, rgba(4,35,43,0.05) 30%, transparent 60%)' }} />
        </div>
      ))}

      {n > 1 && (
        <>
          <button onClick={() => go(idx - 1)} aria-label="Prev" className="hero-arrow" style={{ left: '18px' }}>‹</button>
          <button onClick={() => go(idx + 1)} aria-label="Next" className="hero-arrow" style={{ right: '18px' }}>›</button>
        </>
      )}

      {n > 1 && (
        <div style={{ position: 'absolute', bottom: '26px', left: 0, right: 0, zIndex: 4, display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {list.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} style={{
              width: i === idx ? '28px' : '10px', height: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer',
              background: i === idx ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s',
            }} />
          ))}
        </div>
      )}

      <style>{`
        .hero-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 4;
          width: 46px; height: 46px; border-radius: 50%; cursor: pointer;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 26px; line-height: 1;
          display: flex; align-items: center; justify-content: center; transition: background 0.2s;
        }
        .hero-arrow:hover { background: rgba(255,255,255,0.3); }
        @media (max-width: 768px) { .hero-arrow {
 display: none; } }
      `}</style>
    </section>
  );
}
