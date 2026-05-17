import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";

async function getLayanan() {
  try {
    const res = await fetch(`${API}/cms/layanan`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function LayananPage() {
  const layanan = await getLayanan();
  const defaultLayanan = [
    { nama:'Perawat Medis', deskripsi:'Menghadirkan perawat profesional untuk merawat dan menemani pasien, baik di rumah maupun di rumah sakit.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/1.jpg' },
    { nama:'Perawat Jiwa', deskripsi:'Melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/Perawatan-khusus.png' },
    { nama:'Caregiver/Perawat Lansia', deskripsi:'Mendampingi dan mengurus pasien atau orang tua yang tidak mandiri dalam aktivitas sehari-hari.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/rawat-jalan.jpg' },
    { nama:'Babysitter', deskripsi:'Tenaga terlatih dan berpengalaman dalam merawat anak, bayi, dan ibu pra/pasca melahirkan.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/babysitter_oke.jpg' },
    { nama:'Dokter Visit', deskripsi:'Menghadirkan dokter-dokter terbaik ke rumah Anda sesuai kebutuhan.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/periksa-berkala_new.jpg' },
    { nama:'Medikal Evakuasi', deskripsi:'Menyediakan ambulan dengan peralatan medis lengkap dan memadai.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Medikal-evakuasi.jpg' },
    { nama:'Pelayanan Penunjang', deskripsi:'Fisioterapi, Hipnoterapi, Speech Therapist.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Fisioterapi_ok.jpg' },
    { nama:'Persewaan Alat Medis', deskripsi:'Menyewakan dan menjual peralatan medis sesuai kebutuhan pasien.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Alat-Medis.jpg' },
    { nama:'Penjualan Obat-obatan', deskripsi:'Menjual obat sesuai kebutuhan pasien.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Apotik_ok.jpg' },
  ];
  const data = layanan.length > 0 ? layanan : defaultLayanan;

  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 2px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'70px' }}>
          <Link href="/"><img src={LOGO} alt="Mikala" style={{ height:'40px', objectFit:'contain' }} /></Link>
          <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
            {[{href:'/',l:'Beranda'},{href:'/tentang',l:'Tentang'},{href:'/layanan',l:'Layanan'},{href:'/artikel',l:'Artikel'},{href:'/galeri',l:'Galeri'},{href:'/kontak',l:'Kontak'}].map(n => (
              <Link key={n.href} href={n.href} style={{ color: n.href==='/layanan'?GREEN:'#374151', fontSize:'14px', fontWeight: n.href==='/layanan'?700:500, textDecoration:'none' }}>{n.l}</Link>
            ))}
            <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'10px 20px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>Konsultasi</a>
          </div>
        </div>
      </nav>

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'60px 24px', textAlign:'center' }}>
        <h1 style={{ fontSize:'42px', fontWeight:800, color:'white', margin:'0 0 12px' }}>Layanan Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', margin:0 }}>Solusi lengkap untuk perawatan kesehatan Anda dan keluarga</p>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'60px 24px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
          {data.map((l: any, i: number) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns: i%2===0?'400px 1fr':'1fr 400px', gap:'0', alignItems:'stretch', background:'white', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
              {i%2===0 ? (
                <>
                  <div style={{ height:'280px', overflow:'hidden' }}>
                    {l.gambar ? <img src={l.gambar} alt={l.nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'60px' }}>🏥</div>}
                  </div>
                  <div style={{ padding:'40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <h2 style={{ fontSize:'26px', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>{l.nama}</h2>
                    <p style={{ fontSize:'15px', color:'#6b7280', lineHeight:1.8, margin:'0 0 24px' }}>{l.deskripsi}</p>
                    <a href={l.wa_link || WA} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 24px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', width:'fit-content' }}>
                      💬 Konsultasi Sekarang
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ padding:'40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <h2 style={{ fontSize:'26px', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>{l.nama}</h2>
                    <p style={{ fontSize:'15px', color:'#6b7280', lineHeight:1.8, margin:'0 0 24px' }}>{l.deskripsi}</p>
                    <a href={l.wa_link || WA} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 24px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', width:'fit-content' }}>
                      💬 Konsultasi Sekarang
                    </a>
                  </div>
                  <div style={{ height:'280px', overflow:'hidden' }}>
                    {l.gambar ? <img src={l.gambar} alt={l.nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'60px' }}>🏥</div>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background:'#0a1f14', color:'rgba(255,255,255,0.5)', padding:'24px', textAlign:'center', fontSize:'13px' }}>
        <p style={{ margin:0 }}>Copyright © 2026 mikalaglobalmedika.com. All Rights Reserved</p>
      </footer>
    </div>
  );
}
