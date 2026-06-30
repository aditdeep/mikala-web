import Link from 'next/link';
import Navbar from './(components)/Navbar';
import Footer from './(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

async function getData() {
  try {
    const [settingsRes, layananRes, artikelRes, testimoniRes] = await Promise.all([
      fetch(`${API}/cms/settings`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/layanan`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/artikel?per_page=6`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/testimoni`, { next:{ revalidate: 60 } }),
    ]);
    const [s, l, a, t] = await Promise.all([settingsRes.json(), layananRes.json(), artikelRes.json(), testimoniRes.json()]);
    return {
      settings: s.data || {},
      layanan: l.data || [],
      artikel: Array.isArray(a.data?.data) ? a.data.data : Array.isArray(a.data) ? a.data : [],
      testimoni: t.data || [],
    };
  } catch { return { settings:{}, layanan:[], artikel:[], testimoni:[] }; }
}

export default async function HomePage() {
  const { settings, layanan, artikel, testimoni } = await getData();

  const defaultLayanan = [
    { nama:'Perawat Medis', deskripsi:'Perawat profesional di rumah & RS', gambar:'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/tim-perawat-medis.jpg', icon:'🏥' },
    { nama:'Perawat Jiwa', deskripsi:'Dukungan kesehatan mental profesional', gambar:'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/homecare-mgm.jpg', icon:'🧠' },
    { nama:'Caregiver', deskripsi:'Pendamping lansia & pasien kronik', gambar:'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/caregiver.jpg', icon:'👴' },
    { nama:'Babysitter', deskripsi:'Perawat bayi & anak terlatih', gambar:'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/babysitter.jpg', icon:'👶' },
    { nama:'Dokter Visit', deskripsi:'Dokter terbaik ke rumah Anda', gambar:'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/fisioterapi.jpg', icon:'👨‍⚕️' },
    { nama:'Medikal Evakuasi', deskripsi:'Ambulan dengan peralatan lengkap', gambar:'https://res.cloudinary.com/djgtchmsx/image/upload/mikala/galeri/medikal-evakuasi.jpg', icon:'🚑' },
  ];

  const defaultTestimoni = [
    { nama:'Anna', komentar:'Layanan ramah dan bermanfaat bagi masyarakat luas. Semoga terus berkembang!', rating:5, layanan:'Pelayanan Penunjang' },
    { nama:'Kartika', komentar:'Sangat puas, sesuai harapan. Pertahankan pelayanan yang sudah sangat baik!', rating:5, layanan:'Perawat Medis' },
    { nama:'Andi', komentar:'Sangat bagus, bisa update kondisi kesehatan saya. Mudah-mudahan berkah ya!', rating:5, layanan:'Caregiver' },
    { nama:'John', komentar:'Program berjalan baik dan timeline sesuai yang direncanakan. Recommended!', rating:5, layanan:'Perawat Jiwa' },
  ];

  const layananData = layanan.length > 0 ? layanan : defaultLayanan;
  const testimoniData = testimoni.length > 0 ? testimoni : defaultTestimoni;
  const stats = [
    { value:(settings.stats_customer||'500')+'+', label:'Customer', icon:'👥' },
    { value:(settings.stats_nakes||'100')+'+', label:'Tenaga Kesehatan', icon:'👨‍⚕️' },
    { value:(settings.stats_mitra||'50')+'+', label:'Mitra', icon:'🤝' },
    { value:'24/7', label:'Standby', icon:'⏰' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/" />

      {/* ═══ HERO ═══ */}
      <section style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center', overflow:'hidden', background:`linear-gradient(135deg, #062914 0%, #0d4a2a 35%, #1a6b45 65%, #8b1a4a 100%)` }}>
        {/* Orbs */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'600px', height:'600px', borderRadius:'50%', background:'rgba(214,58,122,0.12)', filter:'blur(80px)' }} />
          <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(45,122,94,0.15)', filter:'blur(60px)' }} />
          <div style={{ position:'absolute', top:'40%', left:'40%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', filter:'blur(40px)' }} />
        </div>

        {/* Hero image overlay */}
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'50%', overflow:'hidden' }} className="hide-mobile">
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #062914 0%, rgba(6,41,20,0.85) 30%, rgba(6,41,20,0.4) 70%, transparent 100%)', zIndex:1 }} />
          <img src={settings.hero_image||'https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png'} alt="Homecare" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.55 }} />
        </div>

        <div style={{ position:'relative', zIndex:2, maxWidth:'1200px', margin:'0 auto', padding:'80px 20px' }} className="section-pad">
          <div style={{ maxWidth:'620px' }}>
            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', borderRadius:'30px', padding:'8px 18px', marginBottom:'28px', border:'1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 10px #4ade80', flexShrink:0 }} />
              <span style={{ color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:500 }}>Layanan Homecare 24 Jam Tersedia</span>
            </div>

            <h1 style={{ fontSize:'clamp(32px,5vw,58px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:'20px', letterSpacing:'-0.5px' }} className="hero-text">
              {settings.hero_title || 'Melayani Kebutuhan\nKesehatan Anda'}
            </h1>

            <p style={{ fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,0.75)', lineHeight:1.7, marginBottom:'36px', maxWidth:'520px' }}>
              {settings.hero_subtitle || 'Penyedia layanan homecare terpercaya dengan tim medis profesional yang berkomitmen memberikan pelayanan terbaik untuk Anda dan keluarga.'}
            </p>

            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <a href={WA} target="_blank" rel="noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`linear-gradient(135deg, ${GREEN}, #3a9e78)`, color:'white', padding:'14px 28px', borderRadius:'30px', fontSize:'15px', fontWeight:700, textDecoration:'none', boxShadow:`0 8px 24px rgba(45,122,94,0.4)` }}>
                💬 Konsultasi Gratis
              </a>
              <Link href="/layanan"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.12)', backdropFilter:'blur(10px)', color:'white', padding:'14px 28px', borderRadius:'30px', fontSize:'15px', fontWeight:600, textDecoration:'none', border:'1px solid rgba(255,255,255,0.25)' }}>
                Lihat Layanan →
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:'28px', marginTop:'52px', flexWrap:'wrap' }}>
              {stats.map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'30px', fontWeight:900, color:'white', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 60" style={{ position:'absolute', bottom:0, left:0, right:0, display:'block' }} preserveAspectRatio="none">
          <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f0faf5" />
        </svg>
      </section>

      {/* ═══ LAYANAN ═══ */}
      <section style={{ padding:'80px 20px', background:'#f0faf5' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Layanan Kami</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>Langkah Tepat Mengawal Kesehatan</h2>
            <p style={{ color:'#6b7280', fontSize:'16px', maxWidth:'540px', margin:'0 auto' }}>Tim profesional berpengalaman siap memberikan perawatan terbaik</p>
          </div>

          {/* Desktop grid / Mobile horizontal scroll */}
          <div className="card-grid card-grid-mobile-scroll">
            {layananData.slice(0,6).map((l: any, i: number) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.8)', backdropFilter:'blur(20px)', borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ height:'180px', overflow:'hidden', position:'relative' }}>
                  {l.gambar ? (
                    <img src={l.gambar} alt={l.nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>{l.icon||'🏥'}</div>
                  )}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
                </div>
                <div style={{ padding:'18px' }}>
                  <h3 style={{ fontSize:'16px', fontWeight:700, color:'#1a2e25', margin:'0 0 6px' }}>{l.nama}</h3>
                  <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.6, margin:'0 0 14px' }}>{l.deskripsi}</p>
                  <a href={l.wa_link||WA} target="_blank" rel="noreferrer" style={{ color:GREEN, fontSize:'13px', fontWeight:600, textDecoration:'none' }}>Konsultasi →</a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:'32px' }}>
            <Link href="/layanan" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 28px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>
              Lihat Semua Layanan →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section style={{ padding:'80px 20px', background:'white' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center' }} className="two-col">
            <div>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px' }}>Mengapa Kami</span>
              <h2 style={{ fontSize:'clamp(24px,3.5vw,36px)', fontWeight:800, color:'#1a2e25', margin:'0 0 20px', lineHeight:1.2 }}>Pelayanan Terbaik untuk Anda & Keluarga</h2>
              <p style={{ color:'#6b7280', fontSize:'16px', lineHeight:1.8, marginBottom:'28px' }}>
                Kami senantiasa mendengarkan keluhan Anda dan memberikan solusi kesehatan terbaik dengan penuh kasih.
              </p>
              {[
                { icon:'🏆', t:'Tim Medis Berkualitas', d:'Tenaga profesional berpengalaman & bersertifikat' },
                { icon:'💻', t:'Teknologi Terkini', d:'Sarana prasarana paling up-to-date' },
                { icon:'❤️', t:'Pelayanan Ramah 24/7', d:'Standby admin 24 jam untuk kebutuhan Anda' },
              ].map(f => (
                <div key={f.t} style={{ display:'flex', gap:'14px', marginBottom:'18px', alignItems:'flex-start' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:`linear-gradient(135deg, ${GREEN}15, ${PINK}15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontWeight:700, color:'#1a2e25', margin:'0 0 3px', fontSize:'15px' }}>{f.t}</h4>
                    <p style={{ color:'#6b7280', fontSize:'13px', margin:0 }}>{f.d}</p>
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', gap:'12px', marginTop:'28px', flexWrap:'wrap' }}>
                <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, #3a9e78)`, color:'white', padding:'13px 26px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>Buat Janji</a>
                <Link href="/layanan" style={{ background:'white', color:GREEN, padding:'13px 26px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', border:`2px solid ${GREEN}` }}>Cek Layanan</Link>
              </div>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{ borderRadius:'24px', overflow:'hidden', boxShadow:'0 20px 60px rgba(45,122,94,0.2)' }}>
                <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png" alt="Tim Mikala" style={{ width:'100%', height:'380px', objectFit:'cover' }} />
              </div>
              <div style={{ position:'absolute', bottom:'-16px', right:'-16px', background:'white', borderRadius:'16px', padding:'16px 20px', boxShadow:'0 8px 30px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ fontSize:'28px' }}>⭐</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'18px', color:'#1a2e25' }}>4.9/5.0</div>
                  <div style={{ color:'#6b7280', fontSize:'11px' }}>Rating Pelanggan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONI ═══ */}
      <section style={{ padding:'80px 20px', background:'#f0faf5' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Testimoni</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, color:'#1a2e25', margin:0 }}>Kata Mereka tentang Kami</h2>
          </div>
          <div className="card-grid card-grid-mobile-scroll">
            {testimoniData.slice(0,4).map((t: any, i: number) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderRadius:'20px', padding:'24px', border:`1px solid ${GREEN}15`, boxShadow:'0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', gap:'3px', marginBottom:'14px' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=(t.rating||5)?'#f59e0b':'#e5e7eb', fontSize:'16px' }}>★</span>)}
                </div>
                <p style={{ color:'#374151', lineHeight:1.7, fontSize:'14px', marginBottom:'18px', fontStyle:'italic' }}>"{t.komentar}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'15px', flexShrink:0 }}>
                    {t.nama?.[0]?.toUpperCase()||'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, color:'#1a2e25', fontSize:'14px' }}>{t.nama}</div>
                    <div style={{ color:'#9ca3af', fontSize:'12px' }}>{t.layanan||'Pelanggan'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARTIKEL ═══ */}
      {artikel.length > 0 && (
        <section style={{ padding:'80px 20px', background:'white' }} className="section-pad">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
              <div>
                <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>Artikel Terbaru</span>
                <h2 style={{ fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'#1a2e25', margin:0 }}>Tips & Info Kesehatan</h2>
              </div>
              <Link href="/artikel" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'10px 22px', borderRadius:'20px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                Lihat Semua →
              </Link>
            </div>
            <div className="card-grid card-grid-mobile-scroll">
              {artikel.slice(0,3).map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'rgba(255,255,255,0.9)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid rgba(45,122,94,0.08)' }}>
                    <div style={{ height:'190px', overflow:'hidden' }}>
                      {a.thumbnail ? <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>📰</div>}
                    </div>
                    <div style={{ padding:'18px' }}>
                      <div style={{ display:'flex', gap:'8px', marginBottom:'8px', alignItems:'center' }}>
                        <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'10px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>{a.kategori||'Artikel'}</span>
                        <span style={{ color:'#9ca3af', fontSize:'11px' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short'}) : ''}</span>
                      </div>
                      <h3 style={{ fontSize:'15px', fontWeight:700, color:'#1a2e25', margin:'0 0 6px', lineHeight:1.4 }}>{a.judul}</h3>
                      <p style={{ fontSize:'12px', color:'#6b7280', margin:0, lineHeight:1.5 }}>{(a.excerpt||'').slice(0,90)}...</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section style={{ padding:'80px 20px', background:`linear-gradient(135deg, ${GREEN} 0%, #1a5c3a 50%, ${PINK} 100%)`, position:'relative', overflow:'hidden', textAlign:'center' }} className="section-pad">
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-30%', right:'-10%', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', filter:'blur(40px)' }} />
        </div>
        <div style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'white', margin:'0 0 16px' }}>Siap Membantu Anda 24 Jam</h2>
          <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.82)', marginBottom:'36px', lineHeight:1.7 }}>
            Konsultasi gratis dengan tim kami sekarang. Dapatkan solusi terbaik untuk kesehatan Anda.
          </p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <a href={WA} target="_blank" rel="noreferrer"
              style={{ background:'white', color:GREEN, padding:'14px 30px', borderRadius:'30px', fontSize:'15px', fontWeight:700, textDecoration:'none', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' }}>
              💬 WhatsApp Sekarang
            </a>
            <Link href="/kontak" style={{ background:'rgba(255,255,255,0.15)', color:'white', padding:'14px 30px', borderRadius:'30px', fontSize:'15px', fontWeight:600, textDecoration:'none', border:'2px solid rgba(255,255,255,0.3)' }}>
              Lihat Kontak
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
