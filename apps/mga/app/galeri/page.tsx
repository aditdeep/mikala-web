import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri — Mikala Global Akademi',
  description: 'Dokumentasi kegiatan pelatihan, keberangkatan alumni, dan momen berharga di Mikala Global Akademi.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';

async function getGaleri() {
  try {
    const res = await fetch(`${API}/mga/galeri`, { next: { revalidate: 3600 } });
    return (await res.json()).data || [];
  } catch { return []; }
}

const DEFAULT_GALERI = [
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/Perawatan-khusus.png', caption: 'Pelatihan Keperawatan' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg',    caption: 'Kegiatan Pelatihan' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/rawat-jalan.jpg',       caption: 'Praktek Klinik' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/1.jpg',                 caption: 'Perawatan Profesional' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/babysitter_oke.jpg',    caption: 'Pelatihan Babysitter' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Fisioterapi_ok.jpg',    caption: 'Fisioterapi' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/periksa-berkala_new.jpg','caption': 'Pemeriksaan Berkala' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Medikal-evakuasi.jpg',  caption: 'Medikal Evakuasi' },
  { url: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Alat-Medis.jpg',        caption: 'Peralatan Medis' },
];

export default async function GaleriPage() {
  const galeri = await getGaleri();
  const data   = galeri.length > 0 ? galeri : DEFAULT_GALERI;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/galeri"/>

      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 60%, #0d2a4a 100%)', padding: 'clamp(100px,15vw,140px) 0 clamp(60px,10vw,100px)', textAlign: 'center' }}>
        <div className="container">
          <div className="tag tag-green" style={{ marginBottom: '16px' }}>Galeri</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif" }}>
            Momen Berharga Bersama MGA
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(14px,2vw,17px)', maxWidth: '500px', margin: '16px auto 0' }}>
            Dokumentasi perjalanan peserta dari pelatihan hingga keberangkatan ke Jepang
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ columns: 'auto 300px', gap: '16px' }}>
            {data.map((g: any, i: number) => (
              <div key={i} style={{ marginBottom: '16px', breakInside: 'avoid', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow)', position: 'relative', background: 'var(--bg)' }}>
                <img src={g.url || g.gambar} alt={g.caption || g.judul || `Galeri ${i+1}`}
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}/>
                {(g.caption || g.judul) && (
                  <div style={{ padding: '12px 16px', background: 'white' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)' }}>{g.caption || g.judul}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
