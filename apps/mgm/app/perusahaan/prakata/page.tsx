import Link from 'next/link';
import Navbar from '../../(components)/Navbar';
import Footer from '../../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK = '#9c488b';

async function getSettings() {
  try {
    const res = await fetch(`${API}/cms/settings`, { next:{ revalidate: 60 } });
    const data = await res.json();
    return data.data || {};
  } catch { return {}; }
}

export default async function PrakataPage() {
  const s = await getSettings();

  const direkturNama = s.prsh_direktur_nama || 'Direktur Utama';
  const direkturJabatan = s.prsh_direktur_jabatan || 'PT. Mikala Global Medika';
  const direkturFoto = s.prsh_direktur_foto || 'https://res.cloudinary.com/djgtchmsx/image/upload/v1782829518/about-us_perur5.jpg';
  const sambutanLengkap = s.prsh_direktur_sambutan_lengkap || s.prsh_direktur_sambutan || 'Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa, karena atas rahmat dan karunia-Nya, PT. Mikala Global Medika dapat terus berkembang menjadi perusahaan penyedia layanan tenaga kesehatan bagi masyarakat.\n\nSeiring dengan meningkatnya kebutuhan layanan kesehatan dan pendampingan pasien secara personal di rumah, kami hadir dengan komitmen untuk memberikan pelayanan terbaik, profesional, dan penuh cinta kasih bagi seluruh keluarga yang kami layani.';

  const paragraphs = sambutanLengkap.split('\n').filter((p: string) => p.trim());

  return (
    <div style={{ minHeight:'100vh', background:'#eef8fa' }}>
      <Navbar active="/perusahaan" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(24px,4.5vw,38px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Pra-Kata Direktur Utama</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>Sambutan dari pimpinan Mikala Global Medika</p>
      </div>

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'clamp(40px,7vw,64px) 20px' }}>
        <Link href="/perusahaan" style={{ color:GREEN, fontSize:'13px', fontWeight:600, textDecoration:'none', display:'inline-block', marginBottom:'28px' }}>← Kembali ke Perusahaan</Link>

        <div style={{ display:'flex', alignItems:'center', gap:'18px', marginBottom:'32px' }}>
          <img src={direkturFoto} alt={direkturNama} style={{ width:'86px', height:'86px', borderRadius:'50%', objectFit:'cover', border:`3px solid ${GREEN}30` }} />
          <div>
            <h2 style={{ fontSize:'19px', fontWeight:800, color:'#1a2e25', margin:'0 0 3px' }}>{direkturNama}</h2>
            <p style={{ fontSize:'13px', color:GREEN, fontWeight:600, margin:0 }}>{direkturJabatan}</p>
          </div>
        </div>

        <div style={{ background:'white', borderRadius:'20px', padding:'clamp(24px,4vw,40px)', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}10` }}>
          {paragraphs.map((p: string, i: number) => (
            <p key={i} style={{ color:'#374151', lineHeight:1.9, fontSize:'15px', margin: i===paragraphs.length-1 ? 0 : '0 0 20px' }}>{p}</p>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
