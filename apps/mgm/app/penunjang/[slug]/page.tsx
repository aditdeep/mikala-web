import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../(components)/Navbar';
import Footer from '../../(components)/Footer';
import { slugify } from '@/lib/slug';
import type { Metadata } from 'next';

const API   = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK  = '#9c488b';
const WA    = 'https://wa.me/6282114488878';

const defaultPenunjang = [
  {
    nama: 'Terapi', tipe: 'Fisioterapi & Terapi Wicara', icon: '🧘',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/fisioterapi.jpg',
    deskripsi: 'Fisioterapi, hipnoterapi, dan terapi wicara langsung di rumah untuk membantu proses pemulihan Anda.',
    deskripsi_panjang: 'Fisioterapi, hipnoterapi, dan terapi wicara (speech therapist) langsung di rumah. Membantu pemulihan pasca stroke, cedera, gangguan bicara pada anak, serta meningkatkan kualitas hidup melalui terapi non-farmakologi.\n\nTerapis kami berpengalaman menangani berbagai kondisi dengan pendekatan yang personal dan terstruktur sesuai kebutuhan pasien.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Hipnoterapi & relaksasi', 'Program pemulihan terstruktur'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Terapi'),
  },
  {
    nama: 'Alat Kesehatan', tipe: 'Sewa & Jual', icon: '🩺',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/alat-medis.jpg',
    deskripsi: 'Persewaan dan penjualan alat kesehatan berkualitas seperti kursi roda, tempat tidur pasien, dan nebulizer.',
    deskripsi_panjang: 'Menyewakan dan menjual peralatan kesehatan berkualitas sesuai kebutuhan pasien, termasuk kursi roda, tempat tidur pasien, nebulizer, oksigen concentrator, hospital bed, dan peralatan lainnya dengan harga terjangkau.',
    manfaat: ['Sewa & beli alat kesehatan', 'Produk berkualitas & bergaransi', 'Antar ke rumah', 'Konsultasi kebutuhan gratis'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Alat Kesehatan'),
  },
  {
    nama: 'Alat Medis', tipe: 'Peralatan Medis Lengkap', icon: '💉',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/medikal-evakuasi.jpg',
    deskripsi: 'Peralatan medis lengkap dan bergaransi untuk mendukung perawatan pasien di rumah maupun fasilitas kesehatan.',
    deskripsi_panjang: 'Menyediakan peralatan medis lengkap dan bergaransi untuk mendukung perawatan pasien di rumah maupun fasilitas kesehatan, mulai dari alat monitoring hingga peralatan penunjang tindakan medis.',
    manfaat: ['Peralatan lengkap & bergaransi', 'Konsultasi kebutuhan gratis', 'Pengantaran cepat', 'Layanan purna jual'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Alat Medis'),
  },
];

async function getPenunjang() {
  try {
    const res = await fetch(`${API}/cms/penunjang`, { next: { revalidate: 60 } });
    const data = await res.json();
    const items = (data.data || []).filter((p: any) => p.is_active !== false);
    return items.length > 0 ? items : defaultPenunjang;
  } catch { return defaultPenunjang; }
}

function parseManfaat(raw: any): string[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch { return Array.isArray(raw) ? raw : []; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPenunjang();
  const item = data.find((p: any) => slugify(p.nama) === params.slug);
  if (!item) return { title: 'Penunjang Kesehatan – Mikala Global Medika' };
  return {
    title: item.meta_title || `${item.nama} – Mikala Global Medika`,
    description: item.meta_description || item.deskripsi,
  };
}

export default async function PenunjangDetailPage({ params }: { params: { slug: string } }) {
  const data = await getPenunjang();
  const item = data.find((p: any) => slugify(p.nama) === params.slug);
  if (!item) notFound();

  const manfaat = parseManfaat(item.manfaat);
  const paragraphs = (item.deskripsi_panjang || item.deskripsi || '').split('\n').filter((p: string) => p.trim());
  const waLink = item.wa_link || `${WA}?text=${encodeURIComponent(`Halo Mikala, saya ingin konsultasi ${item.nama}`)}`;
  const related = data.filter((p: any) => slugify(p.nama) !== params.slug).slice(0, 3);

  return (
    <div className="mgm-page-bg" style={{ minHeight:'100vh', background:`linear-gradient(150deg, #ffffff 0%, #f3fbfa 35%, #e2f5f1 62%, #cceee5 100%)` }}>
      <Navbar active="/penunjang" overlay/>

      <section style={{ position:'relative', minHeight:'clamp(240px,36vh,360px)', overflow:'hidden' }}>
        {item.gambar ? (
          <img src={item.gambar} alt={item.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})` }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.85) 0%, rgba(4,35,43,0.45) 55%, rgba(4,35,43,0.2) 100%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'900px', margin:'0 auto', padding:'clamp(50px,9vw,80px) 20px' }}>
          <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginBottom:'14px' }}>
            <Link href="/penunjang" style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none' }}>Penunjang Kesehatan</Link> / <span style={{ color:'white' }}>{item.nama}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <span style={{ fontSize:'36px' }}>{item.icon||'🩺'}</span>
            <h1 style={{ fontSize:'clamp(24px,4.5vw,40px)', fontWeight:800, color:'white', margin:0 }}>{item.nama}</h1>
          </div>
        </div>
      </section>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'clamp(32px,6vw,56px) 20px' }}>
        <div style={{ background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', border:`1px solid ${GREEN}12`, borderRadius:'24px', padding:'clamp(24px,4vw,40px)', boxShadow:'0 8px 30px rgba(0,0,0,0.08)', marginBottom:'28px' }}>
          {paragraphs.map((p: string, i: number) => (
            <p key={i} style={{ color:'#374151', lineHeight:1.9, fontSize:'15px', margin: i===paragraphs.length-1 ? 0 : '0 0 18px' }}>{p}</p>
          ))}
        </div>

        {manfaat.length > 0 && (
          <div style={{ marginBottom:'28px' }}>
            <h2 style={{ fontSize:'18px', fontWeight:800, color:'#1a2e25', margin:'0 0 16px' }}>Manfaat</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap:'12px' }}>
              {manfaat.map((m, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', background:`linear-gradient(135deg, ${GREEN}10, rgba(255,255,255,0.92))`, border:`1px solid ${GREEN}15`, borderRadius:'14px', padding:'14px 16px' }}>
                  <span style={{ color:GREEN, fontWeight:800, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:'13px', color:'#374151', lineHeight:1.6 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, borderRadius:'20px', padding:'clamp(22px,4vw,32px)', textAlign:'center', color:'white', marginBottom:'40px' }}>
          <h3 style={{ fontSize:'clamp(17px,2.4vw,22px)', fontWeight:800, margin:'0 0 8px' }}>Tertarik dengan layanan ini?</h3>
          <p style={{ margin:'0 0 20px', opacity:0.9, fontSize:'13px' }}>Konsultasi gratis dengan tim kami sekarang</p>
          <a href={waLink} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'white', color:GREEN, padding:'13px 28px', borderRadius:'25px', fontWeight:700, textDecoration:'none', fontSize:'14px' }}>
            💬 Konsultasi Sekarang
          </a>
        </div>

        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize:'18px', fontWeight:800, color:'#1a2e25', margin:'0 0 16px' }}>Penunjang Lainnya</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap:'16px' }}>
              {related.map((r: any, i: number) => (
                <Link key={i} href={`/penunjang/${slugify(r.nama)}`} style={{ textDecoration:'none' }}>
                  <div style={{ position:'relative', height:'150px', borderRadius:'16px', overflow:'hidden', border:`1px solid ${GREEN}12`, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
                    {r.gambar ? (
                      <img src={r.gambar} alt={r.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>{r.icon||'🩺'}</div>
                    )}
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.85), transparent)' }} />
                    <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'12px' }}>
                      <span style={{ color:'white', fontWeight:700, fontSize:'13px' }}>{r.nama}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
}
