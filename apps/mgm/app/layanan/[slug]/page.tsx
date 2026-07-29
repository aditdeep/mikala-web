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

const defaultLayanan = [
  {
    nama: 'Perawat Medis', icon: '🏥',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-medis.jpg',
    deskripsi: 'Menghadirkan perawat profesional dan bersertifikat untuk merawat pasien di rumah maupun di rumah sakit.',
    deskripsi_panjang: 'Menghadirkan perawat profesional dan bersertifikat untuk merawat pasien di rumah maupun di rumah sakit. Mampu melakukan tindakan medis dan non-medis seperti injeksi, perawatan luka, pemberian infus, monitoring tanda vital, dan pendampingan pasien pasca operasi.\n\nTim perawat kami berpengalaman menangani berbagai kondisi, mulai dari perawatan pasca operasi, pasien kronis, hingga pendampingan lansia dengan kebutuhan medis khusus.',
    manfaat: ['Tindakan medis & non-medis', 'Monitoring kondisi 24 jam', 'Laporan perkembangan harian', 'Tersedia untuk rawat inap'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Perawat Medis'),
    tier_data: [
      { nama:'Junior', harga_bulanan:'Rp 3.000K - 4.000K', harga_harian:'Rp 250K - 300K', deskripsi:'Lulusan SMK Kesehatan / Keperawatan sederajat (fresh graduate), sertifikasi pelatihan keperawatan dasar, non-pengalaman.' },
      { nama:'Medium', harga_bulanan:'Rp 4.000K - 5.500K', harga_harian:'Rp 300K - 375K', deskripsi:'Lulusan Kesehatan / Keperawatan bersertifikat, berpengalaman 1-3 tahun menangani pasien homecare.' },
      { nama:'Senior', harga_bulanan:'Rp 5.500K - 7.000K', harga_harian:'Rp 375K - 450K', deskripsi:'Perawat berpengalaman 3+ tahun, terlatih penanganan intensive care & kondisi khusus.' },
    ],
  },
  {
    nama: 'Perawat Jiwa', icon: '🧠',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-jiwa.jpg',
    deskripsi: 'Perawat jiwa profesional terlatih melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental.',
    deskripsi_panjang: 'Perawat jiwa profesional terlatih melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental, mulai dari gangguan kecemasan, depresi, skizofrenia, hingga gangguan bipolar dengan pendekatan humanis dan evidence-based.\n\nKami berkoordinasi erat dengan psikiater yang menangani pasien untuk memastikan perawatan berjalan sesuai rencana terapi.',
    manfaat: ['Pendampingan 24 jam', 'Terlatih tangani gangguan mental', 'Koordinasi dengan psikiater', 'Pendekatan humanis & aman'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Perawat Jiwa'),
    tier_data: [
      { nama:'Junior', harga_bulanan:'Rp 3.000K - 4.000K', harga_harian:'Rp 250K - 300K', deskripsi:'Lulusan Keperawatan sederajat (fresh graduate), sertifikasi pelatihan dasar kesehatan jiwa, non-pengalaman.' },
      { nama:'Medium', harga_bulanan:'Rp 4.000K - 5.500K', harga_harian:'Rp 300K - 375K', deskripsi:'Berpengalaman 1-3 tahun menangani pasien dengan gangguan kecemasan, depresi, hingga skizofrenia ringan.' },
      { nama:'Senior', harga_bulanan:'Rp 5.500K - 7.000K', harga_harian:'Rp 375K - 450K', deskripsi:'Berpengalaman 3+ tahun, terlatih koordinasi dengan psikiater untuk kasus kompleks / intensif.' },
    ],
  },
  {
    nama: 'Caregiver / Perawat Lansia', subjudul: 'Perawat Pendamping', icon: '👴',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/caregiver.jpg',
    deskripsi: 'Mendampingi dan mengurus orang tua atau pasien lansia yang membutuhkan bantuan dalam aktivitas sehari-hari.',
    deskripsi_panjang: 'Mendampingi dan mengurus orang tua atau pasien lansia yang membutuhkan bantuan dalam aktivitas sehari-hari. Caregiver terlatih kami membantu mandi, makan, mobilisasi, hingga aktivitas sosial untuk meningkatkan kualitas hidup lansia.',
    manfaat: ['Bantu aktivitas harian', 'Terapi fisik ringan', 'Pendampingan sosial', 'Laporan kondisi ke keluarga'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Caregiver'),
    tier_data: [
      { nama:'Junior', harga_bulanan:'Rp 3.000K - 4.000K', harga_harian:'Rp 250K - 300K', deskripsi:'Lulusan SMK Kesehatan / Keperawatan sederajat (fresh graduate), sertifikasi pelatihan keperawatan dasar, non-pengalaman.' },
      { nama:'Medium', harga_bulanan:'Rp 4.000K - 5.500K', harga_harian:'Rp 300K - 375K', deskripsi:'Berpengalaman 1-3 tahun mendampingi lansia, terlatih bantu aktivitas harian & mobilisasi.' },
      { nama:'Senior', harga_bulanan:'Rp 5.500K - 7.000K', harga_harian:'Rp 375K - 450K', deskripsi:'Berpengalaman 3+ tahun, terlatih menangani lansia dengan kondisi khusus / ketergantungan tinggi.' },
    ],
  },
  {
    nama: 'Babysitter', icon: '👶',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/babysitter.jpg',
    deskripsi: 'Tenaga perawat bayi dan anak terlatih, berpengalaman menangani bayi newborn hingga anak usia sekolah.',
    deskripsi_panjang: 'Tenaga perawat bayi dan anak terlatih, berpengalaman menangani bayi newborn hingga anak usia sekolah. Tersedia layanan khusus untuk ibu pra/pasca melahirkan termasuk perawatan tali pusar, memandikan bayi, dan edukasi pengasuhan.',
    manfaat: ['Spesialis bayi newborn', 'Perawatan ibu nifas', 'Edukasi ASI & MPASI', 'Live-in atau harian'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Babysitter'),
    tier_data: [
      { nama:'Junior', harga_bulanan:'Rp 3.000K - 4.000K', harga_harian:'Rp 250K - 300K', deskripsi:'Fresh graduate, sertifikasi pelatihan dasar perawatan bayi & anak, non-pengalaman.' },
      { nama:'Medium', harga_bulanan:'Rp 4.000K - 5.500K', harga_harian:'Rp 300K - 375K', deskripsi:'Berpengalaman 1-3 tahun mengasuh anak, terlatih dasar perawatan newborn care.' },
      { nama:'Senior / Newborn Care', harga_bulanan:'Rp 5.500K - 7.000K', harga_harian:'Rp 375K - 450K', deskripsi:'Berpengalaman 3+ tahun, spesialis newborn care & perawatan ibu nifas.' },
    ],
  },
  {
    nama: 'Terapi', icon: '💆',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/penunjang.jpg',
    deskripsi: 'Layanan fisioterapi, terapi wicara, dan terapi lainnya langsung di rumah, dengan pilihan paket sesuai kebutuhan.',
    deskripsi_panjang: 'Layanan fisioterapi, terapi wicara, dan terapi lainnya langsung di rumah Anda. Membantu pemulihan pasca stroke, cedera, gangguan bicara pada anak, serta meningkatkan kualitas hidup melalui terapi non-farmakologi.\n\nTersedia pilihan paket Terapi A, B, dan C sesuai jenis dan intensitas kebutuhan terapi Anda.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Terapis bersertifikat', 'Program pemulihan terstruktur'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Terapi'),
    tier_data: [
      { nama:'Terapi A', harga_harian:'Rp 150K - 200K / sesi', deskripsi:'Terapi ringan / pemeliharaan, cocok untuk perawatan rutin dan pencegahan.' },
      { nama:'Terapi B', harga_harian:'Rp 200K - 275K / sesi', deskripsi:'Terapi menengah, untuk pemulihan pasca cedera atau kondisi yang membutuhkan penanganan lebih intensif.' },
      { nama:'Terapi C', harga_harian:'Rp 275K - 350K / sesi', deskripsi:'Terapi intensif, untuk kasus kompleks seperti pemulihan pasca stroke atau gangguan bicara berat.' },
    ],
  },
  {
    nama: 'Dokter Visit', icon: '👨‍⚕️',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/dokter-visit.jpg',
    deskripsi: 'Menghadirkan dokter umum maupun spesialis terbaik langsung ke rumah Anda.',
    deskripsi_panjang: 'Menghadirkan dokter umum maupun spesialis terbaik langsung ke rumah Anda. Cocok untuk pemeriksaan rutin, konsultasi medis, penanganan penyakit ringan-sedang, hingga medical check-up di rumah tanpa perlu antri di klinik atau RS.',
    manfaat: ['Dokter umum & spesialis', 'Tersedia 7 hari seminggu', 'Resep & surat keterangan', 'Pemeriksaan lab di rumah'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Dokter Visit'),
  },
  {
    nama: 'Medikal Evakuasi', icon: '🚑',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/medikal-evakuasi.jpg',
    deskripsi: 'Menyediakan ambulan medis dengan peralatan lengkap dan tenaga medis terlatih untuk evakuasi dan transportasi pasien.',
    deskripsi_panjang: 'Menyediakan ambulan medis dengan peralatan lengkap dan tenaga medis terlatih untuk evakuasi dan transportasi pasien. Beroperasi 24 jam untuk kondisi darurat maupun non-darurat, dengan jangkauan Jabodetabek dan sekitarnya.',
    manfaat: ['Armada ambulan lengkap', 'Tenaga medis terlatih', 'Operasional 24 jam', 'Jangkauan Jabodetabek'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Medikal Evakuasi'),
  },
  {
    nama: 'Pelayanan Penunjang', icon: '💆',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/penunjang.jpg',
    deskripsi: 'Layanan fisioterapi, hipnoterapi, dan terapi wicara (speech therapist) langsung di rumah.',
    deskripsi_panjang: 'Layanan fisioterapi, hipnoterapi, dan terapi wicara (speech therapist) langsung di rumah. Membantu pemulihan pasca stroke, cedera, gangguan bicara pada anak, serta meningkatkan kualitas hidup melalui terapi non-farmakologi.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Hipnoterapi & relaksasi', 'Program pemulihan terstruktur'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi layanan Penunjang Kesehatan'),
  },
  {
    nama: 'Persewaan & Penjualan Alat Medis', icon: '🩺',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/alat-medis.jpg',
    deskripsi: 'Menyewakan dan menjual peralatan medis berkualitas sesuai kebutuhan pasien.',
    deskripsi_panjang: 'Menyewakan dan menjual peralatan medis berkualitas sesuai kebutuhan pasien, termasuk kursi roda, tempat tidur pasien, nebulizer, oksigen concentrator, hospital bed, dan peralatan medis lainnya dengan harga terjangkau.',
    manfaat: ['Sewa & beli alat medis', 'Produk berkualitas & bergaransi', 'Antar ke rumah', 'Konsultasi kebutuhan gratis'],
    wa_link: 'https://wa.me/6282114488878?text=' + encodeURIComponent('Halo Mikala, saya ingin konsultasi Persewaan Alat Medis'),
  },
];

async function getLayanan() {
  try {
    const res = await fetch(`${API}/cms/layanan`, { next: { revalidate: 60 } });
    const data = await res.json();
    const items = data.data || [];
    return items.length > 0 ? items : defaultLayanan;
  } catch { return defaultLayanan; }
}

function parseManfaat(raw: any): string[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch { return Array.isArray(raw) ? raw : []; }
}

type Tier = { nama: string; harga_bulanan?: string; harga_harian?: string; deskripsi?: string; gambar?: string };
function parseTiers(raw: any): Tier[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed.filter((t: any) => t && t.nama) : [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getLayanan();
  const item = data.find((l: any) => slugify(l.nama) === params.slug);
  if (!item) return { title: 'Layanan – Mikala Global Medika' };
  return {
    title: item.meta_title || `${item.nama} – Mikala Global Medika`,
    description: item.meta_description || item.deskripsi,
  };
}

export default async function LayananDetailPage({ params }: { params: { slug: string } }) {
  const data = await getLayanan();
  const item = data.find((l: any) => slugify(l.nama) === params.slug);
  if (!item) notFound();

  const manfaat = parseManfaat(item.manfaat);
  const tiers = parseTiers(item.tier_data);
  const paragraphs = (item.deskripsi_panjang || item.deskripsi || '').split('\n').filter((p: string) => p.trim());
  const waLink = item.wa_link || `${WA}?text=${encodeURIComponent(`Halo Mikala, saya ingin konsultasi layanan ${item.nama}`)}`;
  const related = data.filter((l: any) => slugify(l.nama) !== params.slug).slice(0, 3);

  return (
    <div className="mgm-page-bg" style={{ minHeight:'100vh', background:`linear-gradient(150deg, #ffffff 0%, #f3fbfa 35%, #e2f5f1 62%, #cceee5 100%)` }}>
      <Navbar active="/layanan" overlay/>

      {/* Hero */}
      <section style={{ position:'relative', minHeight:'clamp(260px,38vh,380px)', overflow:'hidden' }}>
        {item.gambar ? (
          <img src={item.gambar} alt={item.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})` }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.85) 0%, rgba(4,35,43,0.45) 55%, rgba(4,35,43,0.2) 100%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'900px', margin:'0 auto', padding:'clamp(50px,9vw,80px) 20px' }}>
          <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginBottom:'14px' }}>
            <Link href="/layanan" style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none' }}>Layanan</Link> / <span style={{ color:'white' }}>{item.nama}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <span style={{ fontSize:'36px' }}>{item.icon||'🏥'}</span>
            <h1 style={{ fontSize:'clamp(24px,4.5vw,40px)', fontWeight:800, color:'white', margin:0 }}>{item.nama}</h1>
          </div>
        </div>
      </section>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'clamp(32px,6vw,56px) 20px' }}>
        <div style={{ background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', border:`1px solid ${GREEN}12`, borderRadius:'24px', padding:'clamp(24px,4vw,40px)', boxShadow:'0 8px 30px rgba(0,0,0,0.2)', marginBottom:'28px' }}>
          {paragraphs.map((p: string, i: number) => (
            <p key={i} style={{ color:'#374151', lineHeight:1.9, fontSize:'15px', margin: i===paragraphs.length-1 ? 0 : '0 0 18px' }}>{p}</p>
          ))}
        </div>

        {manfaat.length > 0 && (
          <div style={{ marginBottom:'28px' }}>
            <h2 style={{ fontSize:'18px', fontWeight:800, color:'#1a2e25', margin:'0 0 16px' }}>Manfaat Layanan</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap:'12px' }}>
              {manfaat.map((m, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', background:`linear-gradient(135deg, ${GREEN}10, rgba(255,255,255,0.92))`, border:`1px solid ${GREEN}15`, borderRadius:'14px', padding:'14px 16px', boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
                  <span style={{ color:GREEN, fontWeight:800, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:'13px', color:'#374151', lineHeight:1.6 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tiers.length > 0 && (
          <div style={{ marginBottom:'28px' }}>
            <h2 style={{ fontSize:'18px', fontWeight:800, color:'#1a2e25', margin:'0 0 16px' }}>Pilihan Paket</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
              {tiers.map((t, i) => {
                const tierWa = `${WA}?text=${encodeURIComponent(`Halo, Saya berminat untuk mengkonsultasikan layanan ${item.nama} ${t.nama} untuk kebutuhan saya.`)}`;
                return (
                  <div key={i} style={{
                    display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap:'0',
                    borderRadius:'20px', overflow:'hidden', boxShadow:'0 6px 24px rgba(0,0,0,0.08)', border:`1px solid ${GREEN}12`,
                  }}>
                    <div style={{ position:'relative', minHeight:'110px' }}>
                      {t.gambar ? (
                        <img src={t.gambar} alt={`${item.nama} ${t.nama}`} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                      ) : (
                        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}18, ${PINK}12)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <span style={{ fontSize:'40px' }}>{item.icon || '🏥'}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.95)', padding:'clamp(18px,3vw,26px)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap', marginBottom:'6px' }}>
                        <h3 style={{ fontSize:'clamp(17px,2.4vw,22px)', fontWeight:800, color:'#1a2e25', margin:0, textTransform:'uppercase' }}>{t.nama}</h3>
                        <span style={{ color:GREEN, fontWeight:700, fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Price Rate</span>
                      </div>
                      {(t.harga_bulanan || t.harga_harian) && (
                        <p style={{ fontSize:'13px', color:'#374151', fontWeight:700, margin:'0 0 8px', lineHeight:1.7 }}>
                          {t.harga_bulanan && <>{t.harga_bulanan}<br/></>}
                          {t.harga_harian && <>{t.harga_harian}</>}
                        </p>
                      )}
                      {t.deskripsi && <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.7, margin:'0 0 14px' }}>{t.deskripsi}</p>}
                      <a href={tierWa} target="_blank" rel="noreferrer" style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'9px 22px', borderRadius:'20px', fontWeight:700, fontSize:'13px', textDecoration:'none' }}>
                        Konsultasi
                      </a>
                    </div>
                  </div>
                );
              })}
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
            <h2 style={{ fontSize:'18px', fontWeight:800, color:'#1a2e25', margin:'0 0 16px' }}>Layanan Lainnya</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap:'16px' }}>
              {related.map((r: any, i: number) => (
                <Link key={i} href={`/layanan/${slugify(r.nama)}`} style={{ textDecoration:'none' }}>
                  <div style={{ position:'relative', height:'150px', borderRadius:'16px', overflow:'hidden', border:`1px solid ${GREEN}12`, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
                    {r.gambar ? (
                      <img src={r.gambar} alt={r.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>{r.icon||'🏥'}</div>
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
