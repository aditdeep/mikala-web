import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import ImageFade from '../(components)/ImageFade';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK = '#9c488b';
const WA = "https://wa.me/6281296998827";

async function getData() {
  try {
    const [settingsRes, galeriRes] = await Promise.all([
      fetch(`${API}/cms/settings`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/galeri`, { next:{ revalidate: 300 } }),
    ]);
    const [s, g] = await Promise.all([settingsRes.json(), galeriRes.json()]);
    return { settings: s.data || {}, galeri: g.data || [] };
  } catch { return { settings:{}, galeri:[] }; }
}

function parseJson(raw: any, fallback: any) {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch { return fallback; }
}

export default async function PerusahaanPage() {
  const { settings: s, galeri } = await getData();

  const heroImages: string[] = parseJson(s.prsh_hero_images, [
    'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/tim-perawat-medis.jpg',
    'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/homecare-mgm.jpg',
    'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/caregiver.jpg',
  ]);
  const heroTitle = s.prsh_hero_title || 'Layanan Kesehatan di Rumah yang Komprehensif untuk Anda dan Keluarga';
  const heroText = s.prsh_hero_text || 'PT. Mikala Global Medika memberikan layanan kesehatan terbaik bagi masyarakat, khususnya bagi mereka yang membutuhkan perawatan lanjutan setelah melakukan perawatan di rumah sakit. Kami melayani dan merawat anda dengan cinta dan kasih selayaknya kami merawat keluarga sendiri.';

  const direkturNama = s.prsh_direktur_nama || 'Direktur Utama';
  const direkturJabatan = s.prsh_direktur_jabatan || 'PT. Mikala Global Medika';
  const direkturFoto = s.prsh_direktur_foto || 'https://res.cloudinary.com/djgtchmsx/image/upload/v1782829518/about-us_perur5.jpg';
  const direkturSambutan = s.prsh_direktur_sambutan || 'Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa, karena atas rahmat dan karunia-Nya, PT. Mikala Global Medika dapat terus berkembang menjadi perusahaan penyedia layanan tenaga kesehatan bagi masyarakat...';

  const visi = s.prsh_visi || 'Menjadi penyedia layanan kesehatan terkemuka di Indonesia, yang memberikan pelayanan yang prima, profesional dan berdedikasi, serta merawat dengan cinta dan kasih.';

  const misiList: string[] = parseJson(s.prsh_misi_list, [
    'Menyalurkan tenaga kesehatan untuk bisa bekerja dan berkarya di mana saja.',
    'Memberikan kesempatan kepada tenaga kerja untuk berkarir di bidang layanan kesehatan yang terlatih dan profesional.',
    'Memberikan pelayanan kesehatan yang mengutamakan kesejahteraan fisik, emosional, dan psikososial pasien dengan memberikan dukungan yang holistik dan berkelanjutan, memastikan mereka merasa dihargai dan diperhatikan dalam setiap tahap perawatan.',
  ]);

  const legalitasImages: string[] = parseJson(s.prsh_legalitas_images, []);
  const legalitasSk = s.prsh_legalitas_sk || 'AHU00015761.AH.01.01. TAHUN 2022';
  const legalitasNib = s.prsh_legalitas_nib || '2008240079968';
  const legalitasIzin = s.prsh_legalitas_izin || '2008240799680001';

  const galeriFasilitas = (galeri || []).filter((g: any) => g.kategori === 'Fasilitas');

  const checklist: string[] = parseJson(s.prsh_checklist_list, [
    'Gratis konsultasi untuk mendapatkan layanan tepat',
    'Tenaga terlatih oleh profesional berpengalaman',
    'Memiliki Akademi Pelatihan terakreditasi sendiri',
    'Garansi ganti perawat jika kurang berkenan',
    'Biaya Admin sekali seumur hidup',
    'Layanan homecare yang banyak pilihannya',
  ]);

  const mgaText = s.prsh_mga_text || 'Mikala Global Akademi (MGA) adalah Lembaga Pelatihan Kerja resmi yang fokus mempersiapkan tenaga kesehatan untuk berkarir...';
  const mgaImages: string[] = parseJson(s.prsh_mga_images, []);
  const mgaUrl = s.prsh_mga_url || WA;
  const lokerText = s.prsh_loker_text || 'Minat bergabung? Stop Pengangguran!';
  const lokerImage = s.prsh_loker_image || '';
  const lokerUrl = s.prsh_loker_url || WA;

  return (
    <div style={{ minHeight:'100vh', background:'#eef8fa' }}>
      <Navbar active="/perusahaan" />

      {/* ═══ HERO ═══ */}
      <section style={{ position:'relative', minHeight:'clamp(360px,55vh,560px)', overflow:'hidden' }}>
        <ImageFade images={heroImages} alt="Mikala Global Medika" />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(4,35,43,0.82) 0%, rgba(4,35,43,0.55) 45%, rgba(4,35,43,0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'1200px', margin:'0 auto', padding:'clamp(60px,10vw,110px) 20px', height:'100%' }}>
          <span style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', fontWeight:700, marginBottom:'18px' }}>Tentang Kami</span>
          <h1 style={{ fontSize:'clamp(26px,4.5vw,44px)', fontWeight:800, color:'white', lineHeight:1.25, maxWidth:'620px', margin:'0 0 20px' }}>{heroTitle}</h1>
          <p style={{ fontSize:'clamp(13px,1.6vw,16px)', color:'rgba(255,255,255,0.88)', lineHeight:1.8, maxWidth:'560px', margin:0 }}>{heroText}</p>
        </div>
      </section>

      {/* ═══ PRA-KATA DIREKTUR ═══ */}
      <section style={{ padding:'clamp(48px,8vw,80px) 20px', background:'white' }} className="section-pad">
        <div style={{ maxWidth:'900px', margin:'0 auto', background:'rgba(14,146,179,0.05)', border:`1px solid ${GREEN}15`, borderRadius:'28px', padding:'clamp(24px,4vw,40px)', display:'grid', gridTemplateColumns:'auto 1fr', gap:'28px', alignItems:'flex-start' }} className="prakata-grid">
          <img src={direkturFoto} alt={direkturNama} style={{ width:'110px', height:'110px', borderRadius:'50%', objectFit:'cover', border:`3px solid ${GREEN}30`, flexShrink:0 }} />
          <div>
            <h2 style={{ fontSize:'clamp(18px,2.4vw,24px)', fontWeight:800, color:'#1a2e25', margin:'0 0 4px' }}>Pra-Kata {direkturNama}</h2>
            <p style={{ fontSize:'13px', color:GREEN, fontWeight:600, margin:'0 0 14px' }}>{direkturJabatan}</p>
            <p style={{ color:'#6b7280', lineHeight:1.8, fontSize:'14px', margin:'0 0 14px' }}>{direkturSambutan}</p>
            <Link href="/perusahaan/prakata" style={{ color:GREEN, fontWeight:700, fontSize:'14px', textDecoration:'none' }}>Baca Selengkapnya →</Link>
          </div>
        </div>
      </section>

      {/* ═══ VISI MISI ═══ */}
      <section style={{ padding:'0 20px clamp(48px,8vw,80px)', background:'white' }} className="section-pad">
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ background:`linear-gradient(135deg, ${PINK}, #7a3570)`, borderRadius:'24px', padding:'clamp(28px,4vw,40px)', textAlign:'center', boxShadow:`0 20px 50px ${PINK}30`, marginBottom:'28px' }}>
            <h2 style={{ color:'white', fontSize:'clamp(18px,2.4vw,24px)', fontWeight:800, margin:'0 0 14px', letterSpacing:'1px' }}>VISI</h2>
            <p style={{ color:'rgba(255,255,255,0.92)', lineHeight:1.8, fontSize:'clamp(13px,1.6vw,15px)', maxWidth:'640px', margin:'0 auto' }}>{visi}</p>
          </div>

          <h2 style={{ textAlign:'center', fontSize:'clamp(18px,2.4vw,24px)', fontWeight:800, color:'#1a2e25', margin:'0 0 20px' }}>MISI</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
            {misiList.map((m, i) => (
              <div key={i} className="misi-arrow" style={{
                background: `linear-gradient(135deg, ${GREEN}, #0a6d85)`,
                color:'white', padding:'18px clamp(20px,4vw,36px) 18px clamp(28px,5vw,44px)', fontSize:'13px', lineHeight:1.7,
                clipPath:'polygon(0 0, 96% 0, 100% 50%, 96% 100%, 0 100%, 4% 50%)',
                marginLeft: i===0 ? 0 : '-2%', opacity: 1 - i*0.06,
              }}>
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LEGALITAS ═══ */}
      <section style={{ padding:'clamp(48px,8vw,80px) 20px', background:'#eef8fa' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(18px,2.4vw,24px)', fontWeight:800, color:'#1a2e25', margin:'0 0 28px' }}>Legalitas Perusahaan</h2>

          {legalitasImages.length > 0 && (
            <div style={{ display:'flex', gap:'20px', overflowX:'auto', paddingBottom:'12px', marginBottom:'24px', scrollSnapType:'x mandatory' }}>
              {legalitasImages.map((img, i) => (
                <div key={i} style={{ flex:'0 0 auto', width:'220px', scrollSnapAlign:'start', background:'white', borderRadius:'16px', overflow:'hidden', border:`1px solid ${GREEN}15`, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                  <img src={img} alt={`Legalitas ${i+1}`} style={{ width:'100%', height:'280px', objectFit:'cover' }} />
                </div>
              ))}
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,220px), 1fr))', gap:'16px' }}>
            {[
              { l:'SK. KEMENKUMHAM', v:legalitasSk },
              { l:'NIB', v:legalitasNib },
              { l:'IZIN LPPRT', v:legalitasIzin },
            ].map(c => (
              <div key={c.l} style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, borderRadius:'16px', padding:'18px 20px', color:'white', textAlign:'center' }}>
                <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1px', marginBottom:'6px', opacity:0.9 }}>{c.l}</div>
                <div style={{ fontSize:'13px', fontWeight:700 }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALERI FASILITAS ═══ */}
      {galeriFasilitas.length > 0 && (
        <section style={{ padding:'clamp(40px,7vw,60px) 0', background:'white', overflow:'hidden' }}>
          <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, textAlign:'center', padding:'14px 20px', marginBottom:'28px' }}>
            <h2 style={{ color:'white', fontSize:'clamp(16px,2.2vw,20px)', fontWeight:800, margin:0, letterSpacing:'1px' }}>GALERI FASILITAS DAN KEGIATAN</h2>
          </div>
          <div className="marquee-track">
            <div className="marquee-content">
              {[...galeriFasilitas, ...galeriFasilitas].map((g: any, i: number) => (
                <div key={i} style={{ flex:'0 0 auto', width:'240px', height:'170px', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }}>
                  <img src={g.url||g.thumbnail} alt={g.judul||'Fasilitas'} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ADA APA DENGAN MGM ═══ */}
      <section style={{ padding:'clamp(48px,8vw,80px) 20px', background:`linear-gradient(135deg, ${PINK}, #6a3a63)` }} className="section-pad">
        <div style={{ maxWidth:'1000px', margin:'0 auto', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'40px', alignItems:'center' }} className="two-col">
          <div>
            <h2 style={{ color:'white', fontSize:'clamp(20px,3vw,28px)', fontWeight:800, lineHeight:1.3, margin:'0 0 24px' }}>Ada Apa dengan<br/>Mikala Global Medika?</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {checklist.map((c, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                  <span style={{ color:'#9effc7', fontSize:'16px', flexShrink:0, marginTop:'1px' }}>✓</span>
                  <span style={{ color:'rgba(255,255,255,0.92)', fontSize:'14px', lineHeight:1.6 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius:'20px', overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,0.25)' }} className="hide-mobile">
            <img src={direkturFoto} alt="Mikala" style={{ width:'100%', height:'340px', objectFit:'cover' }} />
          </div>
        </div>
      </section>

      {/* ═══ MGA + LOKER ═══ */}
      <section style={{ padding:'clamp(48px,8vw,80px) 20px', background:'#eef8fa' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'20px' }}>
          <div style={{ background:'white', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}10`, display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:'0' }} className="two-col">
            {mgaImages[0] && <img src={mgaImages[0]} alt="Mikala Global Akademi" style={{ width:'100%', height:'100%', minHeight:'220px', objectFit:'cover' }} className="hide-mobile" />}
            <div style={{ padding:'clamp(24px,4vw,36px)' }}>
              <span style={{ display:'inline-block', background:`${GREEN}15`, color:GREEN, borderRadius:'20px', padding:'5px 14px', fontSize:'11px', fontWeight:700, marginBottom:'12px' }}>Akademi Pelatihan</span>
              <h3 style={{ fontSize:'clamp(18px,2.4vw,24px)', fontWeight:800, color:'#1a2e25', margin:'0 0 12px', lineHeight:1.3 }}>Memiliki Lembaga Pelatihan yang Mandiri dan Terakreditasi: Mikala Global Akademi</h3>
              <p style={{ color:'#6b7280', fontSize:'13px', lineHeight:1.8, margin:'0 0 16px' }}>{mgaText}</p>
              <a href={mgaUrl} target="_blank" rel="noreferrer" style={{ color:GREEN, fontWeight:700, fontSize:'14px', textDecoration:'none' }}>Baca Selengkapnya →</a>
            </div>
          </div>

          <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, borderRadius:'24px', padding:'clamp(24px,4vw,32px)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'20px', flexWrap:'wrap' }}>
            <div>
              <p style={{ color:'white', fontWeight:800, fontSize:'clamp(16px,2.2vw,20px)', margin:0 }}>{lokerText}</p>
            </div>
            <a href={lokerUrl} target="_blank" rel="noreferrer" style={{ background:'white', color:GREEN, padding:'13px 30px', borderRadius:'25px', fontSize:'14px', fontWeight:700, textDecoration:'none', flexShrink:0 }}>Klik Daftar</a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .marquee-content { display:flex; gap:16px; width:max-content; animation: mgm-marquee 30s linear infinite; }
        @keyframes mgm-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 768px) {
          .prakata-grid { grid-template-columns: 1fr !important; text-align: center; }
          .prakata-grid img { margin: 0 auto; }
          .misi-arrow { clip-path: none !important; border-radius: 14px; margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
