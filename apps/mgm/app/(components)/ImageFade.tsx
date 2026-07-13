'use client';
import { useState, useEffect } from 'react';

export default function ImageFade({ images, alt }: { images: string[]; alt: string }) {
  const list = images && images.length > 0 ? images : ['https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png'];
  const [idx, setIdx] = useState(0);
  const n = list.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx(p => (p + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div style={{ position:'absolute', inset:0 }}>
      {list.map((img, i) => (
        <img key={i} src={img} alt={alt} style={{
          position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
          opacity: i === idx ? 1 : 0, transition:'opacity 1.2s ease',
        }} />
      ))}
    </div>
  );
}
