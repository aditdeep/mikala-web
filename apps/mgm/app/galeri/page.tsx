import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

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
  { judul:'Homecare MGM', url:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg', kategori:'Tim' },
];

export default async function GaleriPage() {
  const galeri = await getGaleri();
  const data = galeri.length > 0 ? galeri : defaultGaleri;

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/galeri" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Galeri</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>Dokumentasi layanan dan aktivitas Mikala Global Medika</p>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%,260px), 1fr))', gap:'16px' }}>
          {data.map((g: any, i: number) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(10px)', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.07)', border:'1px solid rgba(45,122,94,0.08)' }}>
              <div style={{ height:'clamp(160px,25vw,220px)', overflow:'hidden', position:'relative' }}>
                <img src={g.url||g.thumbnail} alt={g.judul||`Galeri ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                {g.kategori && (
                  <div style={{ position:'absolute', top:'10px', left:'10px', background:'rgba(45,122,94,0.88)', backdropFilter:'blur(8px)', color:'white', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>
                    {g.kategori}
                  </div>
                )}
              </div>
              {g.judul && (
                <div style={{ padding:'12px 14px' }}>
                  <p style={{ fontWeight:600, color:'#1a2e25', fontSize:'13px', margin:0 }}>{g.judul}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(22px,4vw,32px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Ingin Layanan Kami?</h2>
        <p style={{ color:'rgba(255,255,255,0.85)', margin:'0 0 24px', fontSize:'clamp(13px,2vw,16px)' }}>Hubungi kami sekarang untuk konsultasi gratis</p>
        <a href={WA} target="_blank" rel="noreferrer"
          style={{ background:'white', color:GREEN, padding:'13px 30px', borderRadius:'25px', fontSize:'15px', fontWeight:700, textDecoration:'none', display:'inline-block' }}>
          💬 Konsultasi Gratis
        </a>
      </div>

      <Footer />
    </div>
  );
}
