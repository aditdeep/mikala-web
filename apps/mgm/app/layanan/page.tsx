import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import ImageFade from '../(components)/ImageFade';
import { slugify } from '@/lib/slug';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layanan Homecare – Mikala Global Medika',
  description: 'Layanan homecare lengkap: perawat medis, caregiver, babysitter, dokter visit, perawat jiwa, medikal evakuasi di Bekasi dan sekitarnya.',
  openGraph: { title: 'Layanan – Mikala Global Medika', description: 'Layanan homecare profesional 24 jam', url: 'https://mikalaglobalmedika.com/layanan' },
};

const API   = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK  = '#9c488b';
const WA    = 'https://wa.me/6281296998827';

async function getData() {
  try {
    const [layananRes, settingsRes] = await Promise.all([
      fetch(`${API}/cms/layanan`, { next: { revalidate: 60 } }),
      fetch(`${API}/cms/settings`, { next: { revalidate: 60 } }),
    ]);
    const [l, s] = await Promise.all([layananRes.json(), settingsRes.json()]);
    return { layanan: l.data || [], settings: s.data || {} };
  } catch { return { layanan: [], settings: {} }; }
}

// Default layanan dengan gambar Cloudinary + deskripsi lengkap
const defaultLayanan = [
  {
    nama: 'Perawat Medis',
    icon: '🏥',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-medis.jpg',
    deskripsi: 'Menghadirkan perawat profesional dan bersertifikat untuk merawat pasien di rumah maupun di rumah sakit. Mampu melakukan tindakan medis dan non-medis seperti injeksi, perawatan luka, pemberian infus, monitoring tanda vital, dan pendampingan pasien pasca operasi.',
    manfaat: ['Tindakan medis & non-medis', 'Monitoring kondisi 24 jam', 'Laporan perkembangan harian', 'Tersedia untuk rawat inap'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Perawat Medis'),
  },
  {
    nama: 'Perawat Jiwa',
    icon: '🧠',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-jiwa.jpg',
    deskripsi: 'Perawat jiwa profesional terlatih melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental, mulai dari gangguan kecemasan, depresi, skizofrenia, hingga gangguan bipolar dengan pendekatan humanis dan evidence-based.',
    manfaat: ['Pendampingan 24 jam', 'Terlatih tangani gangguan mental', 'Koordinasi dengan psikiater', 'Pendekatan humanis & aman'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Perawat Jiwa'),
  },
  {
    nama: 'Caregiver / Perawat Lansia',
    icon: '👴',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/caregiver.jpg',
    deskripsi: 'Mendampingi dan mengurus orang tua atau pasien lansia yang membutuhkan bantuan dalam aktivitas sehari-hari. Caregiver terlatih kami membantu mandi, makan, mobilisasi, hingga aktivitas sosial untuk meningkatkan kualitas hidup lansia.',
    manfaat: ['Bantu aktivitas harian', 'Terapi fisik ringan', 'Pendampingan sosial', 'Laporan kondisi ke keluarga'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Caregiver'),
  },
  {
    nama: 'Babysitter',
    icon: '👶',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/babysitter.jpg',
    deskripsi: 'Tenaga perawat bayi dan anak terlatih, berpengalaman menangani bayi newborn hingga anak usia sekolah. Tersedia layanan khusus untuk ibu pra/pasca melahirkan termasuk perawatan tali pusar, memandikan bayi, dan edukasi pengasuhan.',
    manfaat: ['Spesialis bayi newborn', 'Perawatan ibu nifas', 'Edukasi ASI & MPASI', 'Live-in atau harian'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Babysitter'),
  },
  {
    nama: 'Dokter Visit',
    icon: '👨‍⚕️',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/dokter-visit.jpg',
    deskripsi: 'Menghadirkan dokter umum maupun spesialis terbaik langsung ke rumah Anda. Cocok untuk pemeriksaan rutin, konsultasi medis, penanganan penyakit ringan-sedang, hingga medical check-up di rumah tanpa perlu antri di klinik atau RS.',
    manfaat: ['Dokter umum & spesialis', 'Tersedia 7 hari seminggu', 'Resep & surat keterangan', 'Pemeriksaan lab di rumah'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Dokter Visit'),
  },
  {
    nama: 'Medikal Evakuasi',
    icon: '🚑',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/medikal-evakuasi.jpg',
    deskripsi: 'Menyediakan ambulan medis dengan peralatan lengkap dan tenaga medis terlatih untuk evakuasi dan transportasi pasien. Beroperasi 24 jam untuk kondisi darurat maupun non-darurat, dengan jangkauan Jabodetabek dan sekitarnya.',
    manfaat: ['Armada ambulan lengkap', 'Tenaga medis terlatih', 'Operasional 24 jam', 'Jangkauan Jabodetabek'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Medikal Evakuasi'),
  },
  {
    nama: 'Pelayanan Penunjang',
    icon: '💆',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/penunjang.jpg',
    deskripsi: 'Layanan fisioterapi, hipnoterapi, dan terapi wicara (speech therapist) langsung di rumah. Membantu pemulihan pasca stroke, cedera, gangguan bicara pada anak, serta meningkatkan kualitas hidup melalui terapi non-farmakologi.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Hipnoterapi & relaksasi', 'Program pemulihan terstruktur'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Penunjang Kesehatan'),
  },
  {
    nama: 'Persewaan & Penjualan Alat Medis',
    icon: '🩺',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/alat-medis.jpg',
    deskripsi: 'Menyewakan dan menjual peralatan medis berkualitas sesuai kebutuhan pasien, termasuk kursi roda, tempat tidur pasien, nebulizer, oksigen concentrator, hospital bed, dan peralatan medis lainnya dengan harga terjangkau.',
    manfaat: ['Sewa & beli alat medis', 'Produk berkualitas & bergaransi', 'Antar ke rumah', 'Konsultasi kebutuhan gratis'],
    wa_link: 'https://wa.me/6281296998827?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Persewaan Alat Medis'),
  },
];

export default async function LayananPage() {
  const { layanan, settings: s } = await getData();
  const data = layanan.length > 0 ? layanan : defaultLayanan;

  let heroImages: string[] = [];
  try {
    const raw = s.layanan_hero_images;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed) && parsed.length > 0) heroImages = parsed;
  } catch { heroImages = []; }
  if (heroImages.length === 0) heroImages = data.slice(0, 3).map((l: any) => l.gambar).filter(Boolean);

  let alasanList: { icon?: string; judul: string; deskripsi?: string }[] = [];
  try {
    const raw = s.alasan_list;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) alasanList = parsed;
  } catch { alasanList = []; }
  const defaultAlasan = [
    { icon:'🏥', judul:'Tenaga Profesional', deskripsi:'Perawat & tenaga medis bersertifikat' },
    { icon:'⏰', judul:'Standby 24/7', deskripsi:'Siap melayani kapan saja Anda butuhkan' },
    { icon:'💰', judul:'Harga Transparan', deskripsi:'Tanpa biaya tersembunyi' },
    { icon:'🏆', judul:'Berpengalaman', deskripsi:'Dipercaya ratusan keluarga' },
    { icon:'📍', judul:'Jangkauan Luas', deskripsi:'Melayani Bekasi & sekitarnya' },
    { icon:'❤️', judul:'Pelayanan Ramah', deskripsi:'Sepenuh hati untuk Anda & keluarga' },
  ];
  const alasanData = alasanList.length > 0 ? alasanList : defaultAlasan;

  return (
    <div className="mgm-page-bg" style={{ minHeight:'100vh', background:`linear-gradient(135deg, #fbf0fa 0%, #f3edf8 30%, #eaf2f8 60%, #e6f6fb 100%)` }}>
      <Navbar active="/layanan"/>

      {/* ═══ HERO ═══ */}
      <section style={{ position:'relative', minHeight:'clamp(320px,45vh,460px)', overflow:'hidden' }}>
        <ImageFade images={heroImages} alt="Layanan Mikala Global Medika" />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.75) 0%, rgba(4,35,43,0.35) 55%, rgba(4,35,43,0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'900px', margin:'0 auto', padding:'clamp(50px,9vw,90px) 20px', textAlign:'center' }}>
          <span style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', fontWeight:700, marginBottom:'16px' }}>Layanan Kami</span>
          <h1 style={{ fontSize:'clamp(26px,4.5vw,42px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Solusi Lengkap Perawatan Kesehatan Anda</h1>
          <p style={{ fontSize:'clamp(13px,1.8vw,16px)', color:'rgba(255,255,255,0.88)', margin:'0 0 20px' }}>Tersedia 24 jam untuk Anda dan keluarga di Bekasi dan sekitarnya</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            {['✅ Tenaga Tersertifikasi','⏰ Tersedia 24 Jam','📍 Jabodetabek & Sekitarnya'].map(t => (
              <span key={t} style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.25)', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6 ALASAN (strip ringkas) ═══ */}
      <section style={{ padding:'40px 20px', background:'transparent' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(16px,2.4vw,20px)', fontWeight:800, color:'#1a2e25', margin:'0 0 20px' }}>6 Alasan Memilih Layanan Kami</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'12px' }}>
            {alasanData.slice(0,6).map((al, i) => (
              <div key={i} style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, borderRadius:'16px', padding:'16px 14px', textAlign:'center', boxShadow:`0 8px 20px ${GREEN}25` }}>
                <div style={{ fontSize:'20px', marginBottom:'6px' }}>{al.icon||'✅'}</div>
                <p style={{ color:'white', fontSize:'12px', fontWeight:600, lineHeight:1.5, margin:0 }}>{al.judul}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APA YANG ANDA BUTUHKAN ═══ */}
      <section style={{ padding:'20px 20px 80px' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(20px,3.2vw,30px)', fontWeight:800, color:'#1a2e25', margin:'0 0 36px' }}>Apa yang Anda Butuhkan?</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            {data.map((l: any, i: number) => {
              const slug = slugify(l.nama);
              return (
                <Link key={i} href={`/layanan/${slug}`} style={{ textDecoration:'none' }}>
                  <div style={{
                    display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    borderRadius:'24px', overflow:'hidden', minHeight:'220px',
                    boxShadow:'0 4px 24px rgba(0,0,0,0.08)', border:'1px solid rgba(14,146,179,0.1)',
                  }}>
                    {/* Gambar full */}
                    <div style={{ position:'relative', minHeight:'220px', order: i%2===0 ? 0 : 1 }}>
                      {l.gambar ? (
                        <img src={l.gambar} alt={l.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                      ) : (
                        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'64px' }}>{l.icon||'🏥'}</div>
                      )}
                    </div>
                    {/* Konten dengan gradasi MGM */}
                    <div style={{
                      position:'relative', padding:'clamp(22px,4vw,36px)', display:'flex', flexDirection:'column', justifyContent:'center',
                      order: i%2===0 ? 1 : 0,
                      background:`linear-gradient(135deg, ${GREEN}14 0%, rgba(255,255,255,0.92) 55%)`,
                      backdropFilter:'blur(10px)',
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                        <span style={{ fontSize:'26px' }}>{l.icon||'🏥'}</span>
                        <h3 style={{ fontSize:'clamp(17px,2.4vw,22px)', fontWeight:800, color:'#1a2e25', margin:0 }}>{l.nama}</h3>
                      </div>
                      <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.8, margin:'0 0 18px' }}>{(l.deskripsi||'').slice(0,140)}{(l.deskripsi||'').length>140?'...':''}</p>
                      <span style={{ color:GREEN, fontWeight:700, fontSize:'14px' }}>Selengkapnya →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA bawah */}
          <div style={{ marginTop:'48px', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, borderRadius:'24px', padding:'clamp(24px,5vw,48px)', textAlign:'center', color:'white' }}>
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
