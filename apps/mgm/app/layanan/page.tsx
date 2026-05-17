import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

async function getLayanan() {
  try {
    const res = await fetch(`${API}/cms/layanan`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

const defaultLayanan = [
  { nama:'Perawat Medis', deskripsi:'Menghadirkan perawat profesional untuk merawat dan menemani pasien, baik di rumah maupun di rumah sakit dengan kemampuan melakukan tindakan medis dan non medis.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/1.jpg' },
  { nama:'Perawat Jiwa', deskripsi:'Perawat jiwa melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/Perawatan-khusus.png' },
  { nama:'Caregiver/Perawat Lansia', deskripsi:'Mendampingi dan mengurus pasien atau orang tua yang tidak mandiri dalam melakukan aktivitas sehari-hari.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/rawat-jalan.jpg' },
  { nama:'Babysitter', deskripsi:'Tenaga terlatih dan berpengalaman dalam merawat anak, bayi, dan ibu pra/pasca melahirkan.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/babysitter_oke.jpg' },
  { nama:'Dokter Visit', deskripsi:'Menghadirkan dokter-dokter terbaik ke rumah Anda sesuai kebutuhan.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/periksa-berkala_new.jpg' },
  { nama:'Medikal Evakuasi', deskripsi:'Menyediakan ambulan dengan peralatan medis lengkap dan memadai.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Medikal-evakuasi.jpg' },
  { nama:'Pelayanan Penunjang', deskripsi:'Fisioterapi, Hipnoterapi, Terapi wicara (speech therapist).', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Fisioterapi_ok.jpg' },
  { nama:'Persewaan Alat Medis', deskripsi:'Menyewakan dan menjual peralatan medis sesuai kebutuhan pasien.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Alat-Medis.jpg' },
  { nama:'Penjualan Obat-obatan', deskripsi:'Menjual obat sesuai kebutuhan pasien.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Apotik_ok.jpg' },
];

export default async function LayananPage() {
  const layanan = await getLayanan();
  const data = layanan.length > 0 ? layanan : defaultLayanan;

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/layanan" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Layanan Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>Solusi lengkap untuk perawatan kesehatan Anda dan keluarga</p>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
          {data.map((l: any, i: number) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap:'0', background:'rgba(255,255,255,0.9)', backdropFilter:'blur(10px)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}10` }}>
              <div style={{ height:'clamp(200px,35vw,280px)', overflow:'hidden', order: i%2===0 ? 0 : 1 }}>
                {l.gambar
                  ? <img src={l.gambar} alt={l.nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'60px' }}>🏥</div>
                }
              </div>
              <div style={{ padding:'clamp(20px,4vw,36px)', display:'flex', flexDirection:'column', justifyContent:'center', order: i%2===0 ? 1 : 0 }}>
                <h2 style={{ fontSize:'clamp(18px,2.5vw,26px)', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>{l.nama}</h2>
                <p style={{ fontSize:'clamp(13px,1.8vw,15px)', color:'#6b7280', lineHeight:1.8, margin:'0 0 20px' }}>{l.deskripsi}</p>
                <a href={l.wa_link||WA} target="_blank" rel="noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'11px 22px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', width:'fit-content' }}>
                  💬 Konsultasi Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
