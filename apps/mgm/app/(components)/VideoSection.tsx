'use client';
import { useState } from 'react';

const GREEN = '#0e92b3';
const PINK = '#9c488b';

export default function VideoSection({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section className="video-parallax-bg" style={{
      position: 'relative', padding: '110px 0', overflow: 'hidden',
      backgroundImage: `linear-gradient(180deg, rgba(4,35,43,0.82), rgba(61,28,55,0.82)), url(${thumb})`,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
    }}>
      {/* decorative glass blobs */}
      <div style={{ position: 'absolute', top: '-120px', left: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: `radial-gradient(circle, ${GREEN}40, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-140px', right: '-100px', width: '420px', height: '420px', borderRadius: '50%', background: `radial-gradient(circle, ${PINK}40, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '30px', padding: '6px 18px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Video Profil</span>
        <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: 'white', margin: 0, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>{title}</h2>
      </div>

      {/* full-width glass frame */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          position: 'relative', borderRadius: '32px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.5)', boxShadow: `0 30px 80px rgba(14,146,179,0.25), 0 0 0 1px rgba(255,255,255,0.4) inset`,
          padding: 'clamp(8px,1.5vw,16px)',
        }}>
          <div style={{ position: 'relative', paddingBottom: '52%', height: 0, borderRadius: '24px', overflow: 'hidden', background: '#0d2933' }}>
            {playing ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                aria-label={`Putar video: ${title}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, padding: 0, cursor: 'pointer', background: 'none' }}
              >
                <img src={thumb} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(4,35,43,0.45), rgba(61,28,55,0.35))' }} />
                <span style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                  width: 'clamp(64px,8vw,96px)', height: 'clamp(64px,8vw,96px)', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${GREEN}, ${PINK})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 0 10px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.35)`,
                  border: '3px solid rgba(255,255,255,0.85)',
                }} className="video-play-btn">
                  <svg width="34%" height="34%" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '4px' }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .video-play-btn { transition: transform 0.25s ease, box-shadow 0.25s ease; animation: video-pulse 2.4s ease-in-out infinite; }
        button:hover .video-play-btn { transform: translate(-50%,-50%) scale(1.08); }
        @keyframes video-pulse {
          0%, 100% { box-shadow: 0 0 0 10px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.35); }
          50% { box-shadow: 0 0 0 18px rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.35); }
        }
        @media (max-width: 768px) {
          .video-parallax-bg { background-attachment: scroll !important; }
        }
      `}</style>
    </section>
  );
}
