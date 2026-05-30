export const dynamic = 'force-dynamic';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artikel — Mikala Global Akademi',
  description: 'Informasi terbaru seputar program Kaigo Jepang, tips karir perawat, dan berita dari MGA.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';

async function getArtikel() {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/mga/artikel?per_page=12`, { signal: controller.signal, next: { revalidate: 3600 } });
    return (await res.json()).data || [];
  } catch { return []; }
}

export default async function ArtikelPage() {
  const artikel = await getArtikel();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/artikel"/>

      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 60%, #0d2a4a 100%)', padding: 'clamp(100px,15vw,140px) 0 clamp(60px,10vw,100px)', textAlign: 'center' }}>
        <div className="container">
          <div className="tag tag-green" style={{ marginBottom: '16px' }}>Blog & Artikel</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif" }}>
            Informasi & Inspirasi
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '16px', fontSize: 'clamp(14px,2vw,17px)' }}>Tips karir, informasi program, dan cerita alumni MGA</p>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          {artikel.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text)' }}>Artikel segera hadir</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Tim kami sedang mempersiapkan konten terbaik untuk Anda</p>
            </div>
          ) : (
            <div className="grid-3">
              {artikel.map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} className="card" style={{ display: 'block' }}>
                  {a.gambar && <img src={a.gambar} alt={a.judul} style={{ width: '100%', height: '220px', objectFit: 'cover' }}/>}
                  <div style={{ padding: '20px' }}>
                    <span className="tag tag-green" style={{ marginBottom: '10px', display: 'inline-block' }}>{a.kategori || 'Informasi'}</span>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.5 }}>{a.judul}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '14px' }}>{a.ringkasan || a.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text3)' }}>
                      <span>{a.author || 'Tim MGA'}</span>
                      <span>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer/>
    </div>
  );
}
