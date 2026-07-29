import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import ImageFade from '../(components)/ImageFade';
import ScrollFade from '../(components)/ScrollFade';
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
const WA    = 'https://wa.me/6282114488878';

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
    subjudul: 'Perawat Homecare • Perawat Intensive Care',
    icon: '🏥',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-medis.jpg',
    deskripsi: 'Menghadirkan perawat profesional dan bersertifikat untuk merawat pasien di rumah maupun di rumah sakit. Mampu melakukan tindakan medis dan non-medis seperti injeksi, perawatan luka, pemberian infus, monitoring tanda vital, dan pendampingan pasien pasca operasi.',
    manfaat: ['Tindakan medis & non-medis', 'Monitoring kondisi 24 jam', 'Laporan perkembangan harian', 'Tersedia untuk rawat inap'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Perawat Medis'),
  },
  {
    nama: 'Perawat Jiwa',
    subjudul: 'Perawat Pendamping • Perawat Psikiatri',
    icon: '🧠',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-jiwa.jpg',
    deskripsi: 'Perawat jiwa profesional terlatih melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental, mulai dari gangguan kecemasan, depresi, skizofrenia, hingga gangguan bipolar dengan pendekatan humanis dan evidence-based.',
    manfaat: ['Pendampingan 24 jam', 'Terlatih tangani gangguan mental', 'Koordinasi dengan psikiater', 'Pendekatan humanis & aman'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Perawat Jiwa'),
  },
  {
    nama: 'Caregiver / Perawat Lansia',
    subjudul: 'Perawat Pendamping • Perawat Lansia',
    icon: '👴',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/caregiver.jpg',
    deskripsi: 'Mendampingi dan mengurus orang tua atau pasien lansia yang membutuhkan bantuan dalam aktivitas sehari-hari. Caregiver terlatih kami membantu mandi, makan, mobilisasi, hingga aktivitas sosial untuk meningkatkan kualitas hidup lansia.',
    manfaat: ['Bantu aktivitas harian', 'Terapi fisik ringan', 'Pendampingan sosial', 'Laporan kondisi ke keluarga'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Caregiver'),
  },
  {
    nama: 'Babysitter',
    subjudul: 'Newborn Care • Nanny',
    icon: '👶',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/babysitter.jpg',
    deskripsi: 'Tenaga perawat bayi dan anak terlatih, berpengalaman menangani bayi newborn hingga anak usia sekolah. Tersedia layanan khusus untuk ibu pra/pasca melahirkan termasuk perawatan tali pusar, memandikan bayi, dan edukasi pengasuhan.',
    manfaat: ['Spesialis bayi newborn', 'Perawatan ibu nifas', 'Edukasi ASI & MPASI', 'Live-in atau harian'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Babysitter'),
  },
  {
    nama: 'Terapi',
    subjudul: 'Terapi A • Terapi B • Terapi C',
    icon: '💆',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/penunjang.jpg',
    deskripsi: 'Layanan fisioterapi, terapi wicara, dan terapi lainnya langsung di rumah, dengan pilihan paket sesuai kebutuhan.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Terapis bersertifikat', 'Program pemulihan terstruktur'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Terapi'),
  },
  {
    nama: 'Dokter Visit',
    subjudul: 'Dokter Umum • Dokter Spesialis',
    icon: '👨‍⚕️',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/dokter-visit.jpg',
    deskripsi: 'Menghadirkan dokter umum maupun spesialis terbaik langsung ke rumah Anda. Cocok untuk pemeriksaan rutin, konsultasi medis, penanganan penyakit ringan-sedang, hingga medical check-up di rumah tanpa perlu antri di klinik atau RS.',
    manfaat: ['Dokter umum & spesialis', 'Tersedia 7 hari seminggu', 'Resep & surat keterangan', 'Pemeriksaan lab di rumah'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Dokter Visit'),
  },
  {
    nama: 'Medikal Evakuasi',
    subjudul: 'Ambulan Darurat • Transportasi Pasien',
    icon: '🚑',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/medikal-evakuasi.jpg',
    deskripsi: 'Menyediakan ambulan medis dengan peralatan lengkap dan tenaga medis terlatih untuk evakuasi dan transportasi pasien. Beroperasi 24 jam untuk kondisi darurat maupun non-darurat, dengan jangkauan Jabodetabek dan sekitarnya.',
    manfaat: ['Armada ambulan lengkap', 'Tenaga medis terlatih', 'Operasional 24 jam', 'Jangkauan Jabodetabek'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Medikal Evakuasi'),
  },
  {
    nama: 'Pelayanan Penunjang',
    subjudul: 'Fisioterapi • Hipnoterapi • Terapi Wicara',
    icon: '💆',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/penunjang.jpg',
    deskripsi: 'Layanan fisioterapi, hipnoterapi, dan terapi wicara (speech therapist) langsung di rumah. Membantu pemulihan pasca stroke, cedera, gangguan bicara pada anak, serta meningkatkan kualitas hidup melalui terapi non-farmakologi.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Hipnoterapi & relaksasi', 'Program pemulihan terstruktur'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Penunjang Kesehatan'),
  },
  {
    nama: 'Persewaan & Penjualan Alat Medis',
    subjudul: 'Sewa Alat • Jual Alat Kesehatan',
    icon: '🩺',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/alat-medis.jpg',
    deskripsi: 'Menyewakan dan menjual peralatan medis berkualitas sesuai kebutuhan pasien, termasuk kursi roda, tempat tidur pasien, nebulizer, oksigen concentrator, hospital bed, dan peralatan medis lainnya dengan harga terjangkau.',
    manfaat: ['Sewa & beli alat medis', 'Produk berkualitas & bergaransi', 'Antar ke rumah', 'Konsultasi kebutuhan gratis'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Persewaan Alat Medis'),
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
    <div className="mgm-page-bg" style={{ minHeight:'100vh', background:`linear-gradient(150deg, #ffffff 0%, #f3fbfa 35%, #e2f5f1 62%, #cceee5 100%)` }}>
      <Navbar active="/layanan" overlay/>

      {/* ═══ HERO ═══ */}
      <section style={{ position:'relative', minHeight:'clamp(360px,55vh,560px)', overflow:'hidden' }}>
        <ImageFade images={heroImages} alt="Layanan Mikala Global Medika" />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.75) 0%, rgba(4,35,43,0.35) 55%, rgba(4,35,43,0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'1200px', margin:'0 auto', padding:'clamp(60px,10vw,110px) 20px', textAlign:'center' }}>
          <span style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', fontWeight:700, marginBottom:'16px' }}>Layanan Kami</span>
          <h1 style={{ fontSize:'clamp(26px,4.5vw,42px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Solusi Lengkap Perawatan Kesehatan Anda</h1>
          <p style={{ fontSize:'clamp(13px,1.8vw,16px)', color:'rgba(255,255,255,0.88)', margin:'0 0 20px', maxWidth:'640px', marginLeft:'auto', marginRight:'auto' }}>Tersedia 24 jam untuk Anda dan keluarga di Bekasi dan sekitarnya</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            {['✅ Tenaga Tersertifikasi','⏰ Tersedia 24 Jam','📍 Jabodetabek & Sekitarnya'].map(t => (
              <span key={t} style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.25)', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6 ALASAN ═══ */}
      <section style={{ padding:'clamp(48px,8vw,80px) 20px', background:'transparent' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <ScrollFade>
            <h2 style={{ textAlign:'center', fontSize:'clamp(20px,3vw,28px)', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>6 Alasan Memilih Layanan Kami</h2>
            <p style={{ textAlign:'center', color:'#6b7280', fontSize:'15px', maxWidth:'560px', margin:'0 auto 36px' }}>Komitmen kami untuk kesehatan Anda dan keluarga</p>
          </ScrollFade>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'24px' }} className="card-grid card-grid-mobile-scroll">
            {alasanData.slice(0,6).map((al: any, i) => (
              <ScrollFade key={i} delay={i*80}>
                <div style={{ background:`linear-gradient(180deg, ${GREEN}20 0%, rgba(255,255,255,0.9) 55%)`, backdropFilter:'blur(20px)', borderRadius:'20px', padding: al.gambar ? '0 26px 28px' : '34px 26px', border:'1px solid rgba(14,146,179,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', textAlign:'center', overflow:'hidden' }}>
                  {al.gambar ? (
                    <div style={{ position:'relative', margin:'0 -26px 20px', height:'170px' }}>
                      <img src={al.gambar} alt={al.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      <div style={{ position:'absolute', bottom:'-22px', left:'50%', transform:'translateX(-50%)', width:'52px', height:'52px', borderRadius:'16px', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', boxShadow:'0 6px 16px rgba(0,0,0,0.15)' }}>{al.icon||'✅'}</div>
                    </div>
                  ) : (
                    <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:`linear-gradient(135deg, ${GREEN}15, ${PINK}15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', margin:'0 auto 18px' }}>{al.icon||'✅'}</div>
                  )}
                  <h3 style={{ fontSize: al.gambar ? '19px' : '18px', fontWeight:800, color:'#1a2e25', margin: al.gambar ? '14px 0 10px' : '0 0 10px' }}>{al.judul}</h3>
                  {al.deskripsi && <p style={{ fontSize:'14.5px', color:'#6b7280', lineHeight:1.7, margin:0 }}>{al.deskripsi}</p>}
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APA YANG ANDA BUTUHKAN ═══ */}
      <section style={{ padding:'20px 20px 80px' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <ScrollFade>
            <h2 style={{ textAlign:'center', fontSize:'clamp(20px,3.2vw,30px)', fontWeight:800, color:'#1a2e25', margin:'0 0 36px' }}>Apa yang Anda Butuhkan?</h2>
          </ScrollFade>

          <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
            {data.map((l: any, i: number) => {
              const slug = slugify(l.nama);
              return (
                <ScrollFade key={i} delay={(i%3)*90}>
                  <Link href={`/layanan/${slug}`} style={{ textDecoration:'none' }}>
                    <div className="layanan-card layanan-card-right" style={{ position:'relative', minHeight:'380px', borderRadius:'28px', overflow:'hidden', boxShadow:'0 10px 34px rgba(0,0,0,0.16)' }}>
                      {l.gambar ? (
                        <img src={l.gambar} alt={l.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                      ) : (
                        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})` }} />
                      )}
                      {/* Wrap miring hijau tosca + glass */}
                      <div className="layanan-glass" style={{
                        position:'absolute', inset:0,
                        background:`linear-gradient(135deg, rgba(10,60,72,0.86) 0%, ${GREEN}c2 100%)`,
                        backdropFilter:'blur(14px)',
                        WebkitBackdropFilter:'blur(14px)',
                      }}>
                        <div className="layanan-glass-content" style={{ height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                          <div className="layanan-glass-row" style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
                            <span style={{ width:'50px', height:'50px', borderRadius:'14px', background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0 }}>{l.icon||'🏥'}</span>
                            <h3 style={{ fontSize:'clamp(19px,2.6vw,26px)', fontWeight:800, color:'white', margin:0, textShadow:'0 2px 10px rgba(0,0,0,0.25)' }}>{l.nama}</h3>
                          </div>
                          {l.subjudul && <p style={{ fontSize:'clamp(12.5px,1.5vw,14px)', color:'rgba(255,255,255,0.92)', fontWeight:700, margin:'0 0 12px', letterSpacing:'0.3px', textShadow:'0 1px 6px rgba(0,0,0,0.25)' }}>{l.subjudul}</p>}
                          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.9)', lineHeight:1.8, margin:'0 0 18px', textShadow:'0 1px 6px rgba(0,0,0,0.2)' }}>{(l.deskripsi||'').slice(0,170)}{(l.deskripsi||'').length>170?'...':''}</p>
                          <span style={{ color:'white', fontWeight:700, fontSize:'14px', textShadow:'0 1px 6px rgba(0,0,0,0.2)' }}>Selengkapnya →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollFade>
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

      <style>{`
        .layanan-card-right .layanan-glass { clip-path: polygon(100% 0, 58% 0, 50% 100%, 100% 100%); }
        .layanan-card-right .layanan-glass-content { max-width: min(42%, 380px); padding: clamp(24px,4vw,40px); margin-left: auto; text-align: left; align-items: flex-start; }
        @media (max-width: 700px) {
          .layanan-card { min-height: 340px; }
          .layanan-card-right .layanan-glass {
            clip-path: polygon(0 46%, 100% 38%, 100% 100%, 0 100%);
          }
          .layanan-card-right .layanan-glass-content {
            max-width: 100% !important; margin: 0 !important; text-align: left !important; align-items: flex-start !important;
            padding: 20px 22px clamp(24px,6vw,32px) !important; justify-content: flex-end !important;
          }
        }
      `}</style>
    </div>
  );
}
