import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';

async function getGaleri() {
  try {
    const res = await fetch(`${API}/cms/galeri`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

const defaultGaleri = [
  { judul:'Tim Perawat Medis', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/1.jpg', kategori:'Tim' },
  { judul:'Caregiver', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/caregiver_cover.jpg', kategori:'Layanan' },
  { judul:'Babysitter', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/bunda-ini-panduan-memilih-dan-melatih-babysitter-untuk-si-kecil.jpg', kategori:'Layanan' },
  { judul:'Medikal Evakuasi', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Medikal-evakuasi.jpg', kategori:'Layanan' },
  { judul:'Fisioterapi', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Fisioterapi_ok.jpg', kategori:'Layanan' },
  { judul:'Alat Medis', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Alat-Medis.jpg', kategori:'Peralatan' },
  { judul:'Apotik', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Apotik_ok.jpg', kategori:'Peralatan' },
  { judul:'Homecare', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg', kategori:'Tim' },
];

export default async function GaleriPage() {
  const galeri = await getGaleri();
  const data = galeri.length > 0 ? galeri : defaultGaleri;
  const categories = ['Semua', ...Array.from(new Set(data.map((g: any) => g.kategori).filter(Boolean))) as string[]];

  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>
      <Navbar active="/galeri" />

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'60px 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(28px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Galeri</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', margin:0 }}>Dokumentasi layanan dan aktivitas Mikala Global Medika</p>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'60px 20px' }}>
        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' }}>
          {data.map((g: any, i: number) => (
            <div key={i} style={{ borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', background:'white', transition:'transform 0.3s' }}>
              <div style={{ height:'220px', overflow:'hidden', position:'relative' }}>
                <img src={g.url||g.thumbnail} alt={g.judul||`Galeri ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                {g.kategori && (
                  <div style={{ position:'absolute', top:'12px', left:'12px', background:'rgba(45,122,94,0.9)', backdropFilter:'blur(8px)', color:'white', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>
                    {g.kategori}
                  </div>
                )}
              </div>
              {g.judul && (
                <div style={{ padding:'14px 16px' }}>
                  <p style={{ fontWeight:600, color:'#1a2e25', fontSize:'14px', margin:0 }}>{g.judul}</p>
                  {g.deskripsi && <p style={{ color:'#6b7280', fontSize:'12px', margin:'4px 0 0' }}>{g.deskripsi}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'60px 20px', textAlign:'center' }}>
        <h2 style={{ fontSize:'28px', fontWeight:800, color:'white', margin:'0 0 12px' }}>Ingin Layanan Kami?</h2>
        <p style={{ color:'rgba(255,255,255,0.85)', margin:'0 0 24px' }}>Hubungi kami sekarang untuk konsultasi gratis</p>
        <a href="https://wa.me/6281296998827" target="_blank" rel="noreferrer"
          style={{ background:'white', color:GREEN, padding:'14px 32px', borderRadius:'25px', fontSize:'15px', fontWeight:700, textDecoration:'none', display:'inline-block' }}>
          💬 Konsultasi Gratis
        </a>
      </div>

      <Footer />
    </div>
  );
}
