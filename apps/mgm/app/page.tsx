import Link from 'next/link';
import Navbar from './(components)/Navbar';
import Footer from './(components)/Footer';
import HeroSlider from './(components)/HeroSlider';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

async function getData() {
  try {
    const [settingsRes, layananRes, penunjangRes, artikelRes, testimoniRes] = await Promise.all([
      fetch(`${API}/cms/settings`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/layanan`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/penunjang`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/artikel?per_page=6`, { next:{ revalidate: 60 } }),
      fetch(`${API}/cms/testimoni`, { next:{ revalidate: 60 } }),
    ]);
    const [s, l, pn, a, t] = await Promise.all([settingsRes.json(), layananRes.json(), penunjangRes.json(), artikelRes.json(), testimoniRes.json()]);
    return {
      settings: s.data || {},
      layanan: l.data || [],
      penunjang: pn.data || [],
      artikel: Array.isArray(a.data?.data) ? a.data.data : Array.isArray(a.data) ? a.data : [],
      testimoni: t.data || [],
    };
  } catch { return { settings:{}, layanan:[], penunjang:[], artikel:[], testimoni:[] }; }
}

export default async function HomePage() {
  const { settings, layanan, penunjang, artikel, testimoni } = await getData();

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
  const penunjangData = (penunjang || []).filter((p: any) => p.is_active !== false).sort((a: any, b: any) => (a.urutan||0)-(b.urutan||0));

  let profileImages: string[] = [];
  try {
    const raw = settings.profile_images;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) profileImages = parsed;
  } catch { profileImages = []; }
  const profileImage = profileImages[0] || 'https://res.cloudinary.com/djgtchmsx/image/upload/v1782829518/about-us_perur5.jpg';
  const profileText = settings.profile_text || 'Kami senantiasa mendengarkan keluhan Anda dan memberikan solusi kesehatan terbaik dengan penuh kasih.';

  let heroSlides: { image: string; title?: string; subtitle?: string }[] = [];
  try {
    const raw = settings.hero_slides;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) heroSlides = parsed;
  } catch { heroSlides = []; }
  const stats = [
    { value:(settings.stats_customer||'500')+'+', label:'Customer', icon:'👥' },
    { value:(settings.stats_nakes||'100')+'+', label:'Tenaga Kesehatan', icon:'👨‍⚕️' },
    { value:(settings.stats_mitra||'50')+'+', label:'Mitra', icon:'🤝' },
    { value:'24/7', label:'Standby', icon:'⏰' },
  ];

  const videoUrl = settings.video_url || '';
  const videoTitle = settings.video_title || 'Kenali Lebih Dekat Mikala Global Medika';
  const getYoutubeEmbed = (url: string) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      let id = '';
      if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
      else if (u.searchParams.get('v')) id = u.searchParams.get('v')!;
      else if (u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1];
      return id ? `https://www.youtube.com/embed/${id}` : '';
    } catch { return ''; }
  };
  const videoEmbed = getYoutubeEmbed(videoUrl);

  let alasanList: { icon?: string; judul: string; deskripsi?: string }[] = [];
  try {
    const raw = settings.alasan_list;
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

  let sertifikatImages: string[] = [];
  try {
    const raw = settings.sertifikat_images;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) sertifikatImages = parsed;
  } catch { sertifikatImages = []; }

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/" />

      {/* ═══ HERO ═══ */}
      <HeroSlider
        slides={heroSlides}
        fallbackTitle={settings.hero_title || 'Melayani Kebutuhan Kesehatan Anda'}
        fallbackSubtitle={settings.hero_subtitle || 'Penyedia layanan homecare terpercaya dengan tim medis profesional yang berkomitmen memberikan pelayanan terbaik untuk Anda dan keluarga.'}
      />

      {/* ═══ STATS (overlap card) ═══ */}
      <div style={{ position:'relative', zIndex:5, maxWidth:'1000px', margin:'-40px auto 0', padding:'0 20px' }} className="section-pad">
        <div style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderRadius:'24px', padding:'28px 20px', boxShadow:'0 20px 50px rgba(0,0,0,0.12)', border:'1px solid rgba(45,122,94,0.1)', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:'20px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign:'center', minWidth:'100px' }}>
              <div style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:900, color:'#1a2e25', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" style={{ display:'block' }} preserveAspectRatio="none">
        <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f0faf5" />
      </svg>

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

      {/* ═══ PENUNJANG KESEHATAN ═══ */}
      {penunjangData.length > 0 && (
        <section style={{ padding:'80px 20px', background:'white' }} className="section-pad">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'48px' }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Penunjang Kesehatan</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>Fasilitas Penunjang Siap Membantu</h2>
              <p style={{ color:'#6b7280', fontSize:'16px', maxWidth:'540px', margin:'0 auto' }}>Sarana dan prasarana pendukung layanan kesehatan Anda</p>
            </div>

            <div className="card-grid card-grid-mobile-scroll">
              {penunjangData.slice(0,6).map((p: any, i: number) => (
                <div key={p.id||i} style={{ background:'rgba(255,255,255,0.8)', backdropFilter:'blur(20px)', borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                  <div style={{ height:'160px', overflow:'hidden', position:'relative' }}>
                    {p.gambar ? (
                      <img src={p.gambar} alt={p.nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>🩺</div>
                    )}
                    {p.tipe && (
                      <span style={{ position:'absolute', top:'12px', left:'12px', background:'rgba(255,255,255,0.92)', color:GREEN, borderRadius:'20px', padding:'4px 12px', fontSize:'11px', fontWeight:700 }}>{p.tipe}</span>
                    )}
                  </div>
                  <div style={{ padding:'18px' }}>
                    <h3 style={{ fontSize:'16px', fontWeight:700, color:'#1a2e25', margin:'0 0 6px' }}>{p.nama}</h3>
                    {p.deskripsi && <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.6, margin:'0 0 14px' }}>{p.deskripsi}</p>}
                    <a href={p.wa_link||WA} target="_blank" rel="noreferrer" style={{ color:GREEN, fontSize:'13px', fontWeight:600, textDecoration:'none' }}>Konsultasi →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHY US ═══ */}
      <section style={{ padding:'80px 20px', background:'white' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center' }} className="two-col">
            <div>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px' }}>Mengapa Kami</span>
              <h2 style={{ fontSize:'clamp(24px,3.5vw,36px)', fontWeight:800, color:'#1a2e25', margin:'0 0 20px', lineHeight:1.2 }}>Pelayanan Terbaik untuk Anda & Keluarga</h2>
              <p style={{ color:'#6b7280', fontSize:'16px', lineHeight:1.8, marginBottom:'28px' }}>
                {profileText}
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
                <img src={profileImage} alt="Tim Mikala" style={{ width:'100%', height:'380px', objectFit:'cover' }} />
              </div>
              {profileImages.length > 1 && (
                <div style={{ display:'flex', gap:'10px', marginTop:'12px' }}>
                  {profileImages.slice(1, 4).map((img, i) => (
                    <div key={i} style={{ flex:1, height:'70px', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 15px rgba(0,0,0,0.1)' }}>
                      <img src={img} alt={`Mikala ${i+2}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  ))}
                </div>
              )}
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

      {/* ═══ VIDEO ═══ */}
      {videoEmbed && (
        <section style={{ padding:'80px 20px', background:'white' }} className="section-pad">
          <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Video Profil</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, color:'#1a2e25', margin:'0 0 32px' }}>{videoTitle}</h2>
            <div style={{ position:'relative', paddingBottom:'56.25%', height:0, borderRadius:'24px', overflow:'hidden', boxShadow:'0 20px 60px rgba(45,122,94,0.2)' }}>
              <iframe
                src={videoEmbed}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:0 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ═══ 6 ALASAN ═══ */}
      <section style={{ padding:'80px 20px', background:'#f0faf5' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Kenapa Pilih Kami</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>6 Alasan Memilih Mikala</h2>
            <p style={{ color:'#6b7280', fontSize:'16px', maxWidth:'540px', margin:'0 auto' }}>Komitmen kami untuk kesehatan Anda dan keluarga</p>
          </div>
          <div className="card-grid card-grid-mobile-scroll">
            {alasanData.slice(0,6).map((al, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderRadius:'20px', padding:'28px 22px', border:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', textAlign:'center' }}>
                <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:`linear-gradient(135deg, ${GREEN}15, ${PINK}15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', margin:'0 auto 16px' }}>{al.icon||'✅'}</div>
                <h3 style={{ fontSize:'15px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px' }}>{al.judul}</h3>
                {al.deskripsi && <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.6, margin:0 }}>{al.deskripsi}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERTIFIKAT ═══ */}
      {sertifikatImages.length > 0 && (
        <section style={{ padding:'80px 20px', background:'white' }} className="section-pad">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'40px' }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Legalitas & Sertifikasi</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, color:'#1a2e25', margin:0 }}>Sertifikat & Izin Resmi Kami</h2>
            </div>
            <div style={{ display:'flex', gap:'20px', overflowX:'auto', paddingBottom:'12px', scrollSnapType:'x mandatory' }}>
              {sertifikatImages.map((img, i) => (
                <div key={i} style={{ flex:'0 0 auto', width:'220px', scrollSnapAlign:'start', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderRadius:'16px', overflow:'hidden', border:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                  <img src={img} alt={`Sertifikat ${i+1}`} style={{ width:'100%', height:'280px', objectFit:'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
