export const dynamic = 'force-dynamic';
import Navbar from '../../(components)/Navbar';
import Footer from '../../(components)/Footer';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';

async function getArtikel(slug: string) {
  try {
    const res = await fetch(`${API}/mga/artikel/${slug}`, { next: { revalidate: 3600 } });
    return (await res.json()).data || null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const artikel = await getArtikel(params.slug);
  if (!artikel) return { title: 'Artikel - Mikala Global Akademi' };
  const img = artikel.gambar || 'https://res.cloudinary.com/djgtchmsx/image/upload/v1780153870/mga-hero_uwjeh1.webp';
  const desc = artikel.ringkasan || (artikel.konten ? artikel.konten.replace(/<[^>]+>/g,'').slice(0,160) : artikel.judul);
  const url = `https://mikalaglobalakademi.co.id/artikel/${params.slug}`;
  return {
    title: `${artikel.judul} - Mikala Global Akademi`,
    description: desc,
    openGraph: {
      title: artikel.judul,
      description: desc,
      url,
      type: 'article',
      images: [{ url: img, width: 1200, height: 630, alt: artikel.judul }],
    },
    twitter: {
      card: 'summary_large_image',
      title: artikel.judul,
      description: desc,
      images: [img],
    },
  };
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const artikel = await getArtikel(params.slug);

  if (!artikel) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar/>
      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Artikel tidak ditemukan</h1>
        <Link href="/artikel" style={{ color: 'var(--green)', fontWeight: 700, marginTop: '16px', display: 'inline-block' }}>← Kembali ke Artikel</Link>
      </div>
      <Footer/>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar/>

      {/* Hero artikel */}
      <section style={{ background: 'linear-gradient(135deg, var(--dark), var(--dark2))', padding: 'clamp(100px,15vw,140px) 0 clamp(40px,6vw,60px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="tag tag-green" style={{ marginBottom: '16px', display: 'inline-block' }}>{artikel.kategori || 'Artikel'}</span>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif", lineHeight: 1.3 }}>{artikel.judul}</h1>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            <span>✍️ {artikel.author || 'Tim MGA'}</span>
            <span>📅 {artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {artikel.gambar && <img src={artikel.gambar} alt={artikel.judul} style={{ width: '100%', height: 'clamp(240px,40vw,400px)', objectFit: 'cover', borderRadius: '20px', marginBottom: '40px' }}/>}
          <div style={{ fontSize: '16px', lineHeight: 1.9, color: 'var(--text2)' }} dangerouslySetInnerHTML={{ __html: artikel.konten || artikel.isi || '' }}/>
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <Link href="/artikel" style={{ color: 'var(--green)', fontWeight: 700, fontSize: '14px' }}>← Kembali ke Artikel</Link>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
