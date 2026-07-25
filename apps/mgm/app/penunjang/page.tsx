import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import ImageFade from '../(components)/ImageFade';
import { slugify } from '@/lib/slug';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Penunjang Kesehatan – Mikala Global Medika',
  description: 'Fasilitas penunjang kesehatan: terapi, alat kesehatan, dan alat medis untuk mendukung pemulihan Anda di rumah.',
  openGraph: { title: 'Penunjang Kesehatan – Mikala Global Medika', description: 'Fasilitas penunjang kesehatan profesional', url: 'https://mikalaglobalmedika.com/penunjang' },
};

const API   = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK  = '#9c488b';
const WA    = 'https://wa.me/6281296998827';

const defaultPenunjang = [
  {
    nama: 'Terapi', tipe: 'Fisioterapi & Terapi Wicara', icon: '🧘',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/fisioterapi.jpg',
    deskripsi: 'Fisioterapi, hipnoterapi, dan terapi wicara langsung di rumah untuk membantu proses pemulihan Anda.',
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Terapi'),
  },
  {
    nama: 'Alat Kesehatan', tipe: 'Sewa & Jual', icon: '🩺',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/alat-medis.jpg',
    deskripsi: 'Persewaan dan penjualan alat kesehatan berkualitas seperti kursi roda, tempat tidur pasien, dan nebulizer.',
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Alat Kesehatan'),
  },
  {
    nama: 'Alat Medis', tipe: 'Peralatan Medis Lengkap', icon: '💉',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/medikal-evakuasi.jpg',
    deskripsi: 'Peralatan medis lengkap dan bergaransi untuk mendukung perawatan pasien di rumah maupun fasilitas kesehatan.',
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Alat Medis'),
  },
];

async function getData() {
  try {
    const [pRes, sRes] = await Promise.all([
      fetch(`${API}/cms/penunjang`, { next: { revalidate: 60 } }),
      fetch(`${API}/cms/settings`, { next: { revalidate: 60 } }),
    ]);
    const [p, s] = await Promise.all([pRes.json(), sRes.json()]);
    return { penunjang: p.data || [], settings: s.data || {} };
  } catch { return { penunjang: [], settings: {} }; }
}

export default async function PenunjangPage() {
  const { penunjang, settings: s } = await getData();
  const active = (penunjang || []).filter((p: any) => p.is_active !== false).sort((a: any, b: any) => (a.urutan||0)-(b.urutan||0));
  const data = active.length > 0 ? active : defaultPenunjang;

  let heroImages: string[] = [];
  try {
    const raw = s.penunjang_hero_images;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed) && parsed.length > 0) heroImages = parsed;
  } catch { heroImages = []; }
  if (heroImages.length === 0) heroImages = data.slice(0, 3).map((p: any) => p.gambar).filter(Boolean);

  return (
    <div className="mgm-page-bg" style={{ minHeight:'100vh', background:`linear-gradient(150deg, #ffffff 0%, #f3fbfa 35%, #e2f5f1 62%, #cceee5 100%)` }}>
      <Navbar active="/penunjang" overlay/>

      <section style={{ position:'relative', minHeight:'clamp(280px,40vh,400px)', overflow:'hidden' }}>
        <ImageFade images={heroImages} alt="Penunjang Kesehatan Mikala Global Medika" />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.75) 0%, rgba(4,35,43,0.35) 55%, rgba(4,35,43,0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'900px', margin:'0 auto', padding:'clamp(50px,9vw,80px) 20px', textAlign:'center' }}>
          <span style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', fontWeight:700, marginBottom:'16px' }}>Penunjang Kesehatan</span>
          <h1 style={{ fontSize:'clamp(24px,4.2vw,38px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Fasilitas Penunjang Siap Membantu Pemulihan Anda</h1>
          <p style={{ fontSize:'clamp(13px,1.8vw,16px)', color:'rgba(255,255,255,0.88)', margin:0 }}>Terapi, alat kesehatan, dan alat medis untuk mendukung kesehatan keluarga Anda</p>
        </div>
      </section>

      <section style={{ padding:'56px 20px 80px' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'20px' }}>
          {data.map((p: any, i: number) => {
            const slug = slugify(p.nama);
            return (
              <Link key={i} href={`/penunjang/${slug}`} style={{ textDecoration:'none' }}>
                <div style={{
                  display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  borderRadius:'24px', overflow:'hidden', minHeight:'220px',
                  boxShadow:'0 4px 24px rgba(0,0,0,0.08)', border:'1px solid rgba(14,146,179,0.1)',
                }}>
                  <div style={{ position:'relative', minHeight:'220px', order: i%2===0 ? 0 : 1 }}>
                    {p.gambar ? (
                      <img src={p.gambar} alt={p.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'64px' }}>{p.icon||'🩺'}</div>
                    )}
                  </div>
                  <div style={{
                    position:'relative', padding:'clamp(22px,4vw,36px)', display:'flex', flexDirection:'column', justifyContent:'center',
                    order: i%2===0 ? 1 : 0,
                    background:`linear-gradient(135deg, ${GREEN}14 0%, rgba(255,255,255,0.92) 55%)`,
                    backdropFilter:'blur(10px)',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                      <span style={{ fontSize:'26px' }}>{p.icon||'🩺'}</span>
                      <h3 style={{ fontSize:'clamp(17px,2.4vw,22px)', fontWeight:800, color:'#1a2e25', margin:0 }}>{p.nama}</h3>
                    </div>
                    {p.tipe && <span style={{ display:'inline-block', background:`${GREEN}15`, color:GREEN, borderRadius:'20px', padding:'4px 12px', fontSize:'11px', fontWeight:700, marginBottom:'10px', alignSelf:'flex-start' }}>{p.tipe}</span>}
                    <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.8, margin:'0 0 18px' }}>{(p.deskripsi||'').slice(0,140)}{(p.deskripsi||'').length>140?'...':''}</p>
                    <span style={{ color:GREEN, fontWeight:700, fontSize:'14px' }}>Selengkapnya →</span>
                  </div>
                </div>
              </Link>
            );
          })}

          <div style={{ marginTop:'28px', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, borderRadius:'24px', padding:'clamp(24px,5vw,48px)', textAlign:'center', color:'white' }}>
            <h2 style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:800, margin:'0 0 10px' }}>Butuh Konsultasi Lebih Lanjut?</h2>
            <p style={{ margin:'0 0 24px', opacity:0.9, fontSize:'clamp(13px,2vw,15px)' }}>Tim kami siap membantu 24 jam. Konsultasi gratis tanpa biaya tambahan.</p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <a href={WA} target="_blank" rel="noreferrer"
                style={{ background:'white', color:GREEN, padding:'13px 28px', borderRadius:'25px', fontWeight:700, textDecoration:'none', fontSize:'14px' }}>
                💬 WhatsApp Sekarang
              </a>
              <Link href="/kontak"
                style={{ background:'rgba(255,255,255,0.2)', color:'white', padding:'13px 28px', borderRadius:'25px', fontWeight:700, textDecoration:'none', fontSize:'14px', border:'2px solid rgba(255,255,255,0.4)' }}>
                📞 Lihat Kontak Lainnya
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
