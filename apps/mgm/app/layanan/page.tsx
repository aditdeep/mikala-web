import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layanan Homecare – Mikala Global Medika',
  description: 'Layanan homecare lengkap: perawat medis, caregiver, babysitter, dokter visit, perawat jiwa, medikal evakuasi di Bekasi dan sekitarnya.',
  openGraph: { title: 'Layanan – Mikala Global Medika', description: 'Layanan homecare profesional 24 jam', url: 'https://mikalaglobalmedika.com/layanan' },
};

const API   = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK  = '#d63a7a';
const WA    = 'https://wa.me/6281296998827';

async function getLayanan() {
  try {
    const res  = await fetch(`${API}/cms/layanan`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

// Default layanan dengan gambar Cloudinary + deskripsi lengkap
const defaultLayanan = [
  {
    nama: 'Perawat Medis',
    icon: '🏥',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-medis.jpg',
    deskripsi: 'Menghadirkan perawat profesional dan bersertifikat untuk merawat pasien di rumah maupun di rumah sakit. Mampu melakukan tindakan medis dan non-medis seperti injeksi, perawatan luka, pemberian infus, monitoring tanda vital, dan pendampingan pasien pasca operasi.',
    manfaat: ['Tindakan medis & non-medis', 'Monitoring kondisi 24 jam', 'Laporan perkembangan harian', 'Tersedia untuk rawat inap'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Perawat Medis',
  },
  {
    nama: 'Perawat Jiwa',
    icon: '🧠',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/perawat-jiwa.jpg',
    deskripsi: 'Perawat jiwa profesional terlatih melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental, mulai dari gangguan kecemasan, depresi, skizofrenia, hingga gangguan bipolar dengan pendekatan humanis dan evidence-based.',
    manfaat: ['Pendampingan 24 jam', 'Terlatih tangani gangguan mental', 'Koordinasi dengan psikiater', 'Pendekatan humanis & aman'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Perawat Jiwa',
  },
  {
    nama: 'Caregiver / Perawat Lansia',
    icon: '👴',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/caregiver.jpg',
    deskripsi: 'Mendampingi dan mengurus orang tua atau pasien lansia yang membutuhkan bantuan dalam aktivitas sehari-hari. Caregiver terlatih kami membantu mandi, makan, mobilisasi, hingga aktivitas sosial untuk meningkatkan kualitas hidup lansia.',
    manfaat: ['Bantu aktivitas harian', 'Terapi fisik ringan', 'Pendampingan sosial', 'Laporan kondisi ke keluarga'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Caregiver',
  },
  {
    nama: 'Babysitter',
    icon: '👶',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/babysitter.jpg',
    deskripsi: 'Tenaga perawat bayi dan anak terlatih, berpengalaman menangani bayi newborn hingga anak usia sekolah. Tersedia layanan khusus untuk ibu pra/pasca melahirkan termasuk perawatan tali pusar, memandikan bayi, dan edukasi pengasuhan.',
    manfaat: ['Spesialis bayi newborn', 'Perawatan ibu nifas', 'Edukasi ASI & MPASI', 'Live-in atau harian'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Babysitter',
  },
  {
    nama: 'Dokter Visit',
    icon: '👨‍⚕️',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/dokter-visit.jpg',
    deskripsi: 'Menghadirkan dokter umum maupun spesialis terbaik langsung ke rumah Anda. Cocok untuk pemeriksaan rutin, konsultasi medis, penanganan penyakit ringan-sedang, hingga medical check-up di rumah tanpa perlu antri di klinik atau RS.',
    manfaat: ['Dokter umum & spesialis', 'Tersedia 7 hari seminggu', 'Resep & surat keterangan', 'Pemeriksaan lab di rumah'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Dokter Visit',
  },
  {
    nama: 'Medikal Evakuasi',
    icon: '🚑',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/medikal-evakuasi.jpg',
    deskripsi: 'Menyediakan ambulan medis dengan peralatan lengkap dan tenaga medis terlatih untuk evakuasi dan transportasi pasien. Beroperasi 24 jam untuk kondisi darurat maupun non-darurat, dengan jangkauan Jabodetabek dan sekitarnya.',
    manfaat: ['Armada ambulan lengkap', 'Tenaga medis terlatih', 'Operasional 24 jam', 'Jangkauan Jabodetabek'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Medikal Evakuasi',
  },
  {
    nama: 'Pelayanan Penunjang',
    icon: '💆',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/penunjang.jpg',
    deskripsi: 'Layanan fisioterapi, hipnoterapi, dan terapi wicara (speech therapist) langsung di rumah. Membantu pemulihan pasca stroke, cedera, gangguan bicara pada anak, serta meningkatkan kualitas hidup melalui terapi non-farmakologi.',
    manfaat: ['Fisioterapi di rumah', 'Terapi wicara anak', 'Hipnoterapi & relaksasi', 'Program pemulihan terstruktur'],
    wa_text: 'Halo Mikala, saya ingin konsultasi layanan Penunjang Kesehatan',
  },
  {
    nama: 'Persewaan & Penjualan Alat Medis',
    icon: '🩺',
    gambar: 'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/layanan/alat-medis.jpg',
    deskripsi: 'Menyewakan dan menjual peralatan medis berkualitas sesuai kebutuhan pasien, termasuk kursi roda, tempat tidur pasien, nebulizer, oksigen concentrator, hospital bed, dan peralatan medis lainnya dengan harga terjangkau.',
    manfaat: ['Sewa & beli alat medis', 'Produk berkualitas & bergaransi', 'Antar ke rumah', 'Konsultasi kebutuhan gratis'],
    wa_text: 'Halo Mikala, saya ingin konsultasi Persewaan Alat Medis',
  },
];

export default async function LayananPage() {
  const layanan = await getLayanan();
  const data    = layanan.length > 0 ? layanan : defaultLayanan;

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/layanan"/>

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Layanan Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:'0 0 20px' }}>
          Solusi lengkap perawatan kesehatan Anda dan keluarga, tersedia 24 jam
        </p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
          {['✅ Tenaga Tersertifikasi','⏰ Tersedia 24 Jam','📍 Jabodetabek & Sekitarnya'].map(t => (
            <span key={t} style={{ background:'rgba(255,255,255,0.2)', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Layanan list */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>
          {data.map((l: any, i: number) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              background:'white', borderRadius:'24px', overflow:'hidden',
              boxShadow:'0 4px 24px rgba(0,0,0,0.07)', border:`1px solid rgba(45,122,94,0.08)`,
            }}>
              {/* Gambar */}
              <div style={{ minHeight:'240px', overflow:'hidden', order: i%2===0 ? 0 : 1, position:'relative' }}>
                {l.gambar ? (
                  <img src={l.gambar} alt={l.nama} style={{ width:'100%', height:'100%', objectFit:'cover', minHeight:'240px' }} />
                ) : (
                  <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}15, ${PINK}15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'80px' }}>
                    {l.icon||'🏥'}
                  </div>
                )}
              </div>

              {/* Konten */}
              <div style={{ padding:'clamp(20px,4vw,36px)', display:'flex', flexDirection:'column', justifyContent:'center', order: i%2===0 ? 1 : 0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                  <span style={{ fontSize:'28px' }}>{l.icon||'🏥'}</span>
                  <h2 style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:800, color:'#1a2e25', margin:0 }}>{l.nama}</h2>
                </div>
                <p style={{ fontSize:'clamp(13px,1.8vw,15px)', color:'#6b7280', lineHeight:1.8, margin:'0 0 16px' }}>{l.deskripsi}</p>

                {/* Manfaat */}
                {(l.manfaat||[]).length > 0 && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginBottom:'20px' }}>
                    {(l.manfaat||[]).map((m: string, j: number) => (
                      <div key={j} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'#374151' }}>
                        <span style={{ color:GREEN, fontWeight:700, flexShrink:0 }}>✓</span>
                        {m}
                      </div>
                    ))}
                  </div>
                )}

                <a href={`https://wa.me/6281296998827?text=${encodeURIComponent(l.wa_text||'Halo Mikala, saya ingin konsultasi')}`}
                  target="_blank" rel="noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`linear-gradient(135deg, ${GREEN}, #3a9e78)`, color:'white', padding:'12px 24px', borderRadius:'25px', fontSize:'14px', fontWeight:700, textDecoration:'none', width:'fit-content', boxShadow:`0 4px 15px ${GREEN}40` }}>
                  💬 Konsultasi Sekarang
                </a>
              </div>
            </div>
          ))}
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
            <a href="/kontak"
              style={{ background:'rgba(255,255,255,0.2)', color:'white', padding:'13px 28px', borderRadius:'25px', fontWeight:700, textDecoration:'none', fontSize:'14px', border:'2px solid rgba(255,255,255,0.4)' }}>
              📞 Lihat Kontak Lainnya
            </a>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
