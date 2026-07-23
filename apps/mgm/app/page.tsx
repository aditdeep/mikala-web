import Link from 'next/link';
import Navbar from './(components)/Navbar';
import Footer from './(components)/Footer';
import HeroSlider from './(components)/HeroSlider';
import VideoSection from './(components)/VideoSection';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK = '#9c488b';
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
  const getYoutubeId = (url: string) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      let id = '';
      if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
      else if (u.searchParams.get('v')) id = u.searchParams.get('v')!;
      else if (u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1];
      return id;
    } catch { return ''; }
  };
  const videoId = getYoutubeId(videoUrl);

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
    <div className="mgm-page-bg" style={{ minHeight:'100vh', background:`linear-gradient(135deg, #041e26 0%, #0e6a85 30%, #4a3d75 55%, #7a3574 78%, ${PINK} 100%)` }}>
      <Navbar active="/" />

      {/* ═══ HERO ═══ */}
      <HeroSlider
        slides={heroSlides}
        fallbackTitle={settings.hero_title || 'Melayani Kebutuhan Kesehatan Anda'}
        fallbackSubtitle={settings.hero_subtitle || 'Penyedia layanan homecare terpercaya dengan tim medis profesional yang berkomitmen memberikan pelayanan terbaik untuk Anda dan keluarga.'}
      />

      {/* ═══ STATS (overlap card) ═══ */}
      <div style={{ position:'relative', zIndex:5, maxWidth:'1000px', margin:'-40px auto 0', padding:'0 20px' }} className="section-pad">
        <div style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderRadius:'24px', padding:'28px 20px', boxShadow:'0 20px 50px rgba(0,0,0,0.12)', border:'1px solid rgba(14,146,179,0.1)', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:'20px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign:'center', minWidth:'100px' }}>
              <div style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:900, color:'#1a2e25', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ LAYANAN ═══ */}
      <section style={{ padding:'96px 20px 80px', background:'transparent' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Layanan Kami</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Langkah Tepat Mengawal Kesehatan</h2>
            <p style={{ color:'rgba(255,255,255,0.78)', fontSize:'16px', maxWidth:'540px', margin:'0 auto' }}>Tim profesional berpengalaman siap memberikan perawatan terbaik</p>
          </div>

          {/* Desktop grid / Mobile horizontal scroll */}
          <div className="card-grid card-grid-mobile-scroll">
            {layananData.slice(0,6).map((l: any, i: number) => (
              <div key={i} style={{ position:'relative', height:'320px', borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(14,146,179,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                {l.gambar ? (
                  <img src={l.gambar} alt={l.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>{l.icon||'🏥'}</div>
                )}
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(4,35,43,0.92) 0%, ${GREEN}66 45%, rgba(4,35,43,0.05) 85%)` }} />
                <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'20px' }}>
                  <h3 style={{ fontSize:'17px', fontWeight:800, color:'white', margin:'0 0 6px' }}>{l.nama}</h3>
                  <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.85)', lineHeight:1.6, margin:'0 0 14px' }}>{l.deskripsi}</p>
                  <a href={l.wa_link||WA} target="_blank" rel="noreferrer" style={{ color:'white', fontSize:'13px', fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'4px' }}>Konsultasi →</a>
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
        <section style={{ padding:'80px 20px', background:'transparent' }} className="section-pad">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'48px' }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Penunjang Kesehatan</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Fasilitas Penunjang Siap Membantu</h2>
              <p style={{ color:'rgba(255,255,255,0.78)', fontSize:'16px', maxWidth:'540px', margin:'0 auto' }}>Sarana dan prasarana pendukung layanan kesehatan Anda</p>
            </div>

            <div className="card-grid card-grid-mobile-scroll">
              {penunjangData.slice(0,6).map((p: any, i: number) => (
                <div key={p.id||i} style={{ position:'relative', height:'300px', borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(14,146,179,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                  {p.gambar ? (
                    <img src={p.gambar} alt={p.nama} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>🩺</div>
                  )}
                  <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(4,35,43,0.92) 0%, ${GREEN}66 45%, rgba(4,35,43,0.05) 85%)` }} />
                  {p.tipe && (
                    <span style={{ position:'absolute', top:'12px', left:'12px', background:'rgba(255,255,255,0.92)', color:GREEN, borderRadius:'20px', padding:'4px 12px', fontSize:'11px', fontWeight:700 }}>{p.tipe}</span>
                  )}
                  <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'18px' }}>
                    <h3 style={{ fontSize:'16px', fontWeight:800, color:'white', margin:'0 0 6px' }}>{p.nama}</h3>
                    {p.deskripsi && <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.85)', lineHeight:1.6, margin:'0 0 14px' }}>{p.deskripsi}</p>}
                    <a href={p.wa_link||WA} target="_blank" rel="noreferrer" style={{ color:'white', fontSize:'13px', fontWeight:700, textDecoration:'none' }}>Konsultasi →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHY US ═══ */}
      <section style={{ padding:'80px 20px', background:'transparent' }} className="section-pad">
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center', background:'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'32px', padding:'clamp(24px,4vw,48px)', boxShadow:'0 20px 50px rgba(0,0,0,0.25)' }} className="two-col">
            <div>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px' }}>Mengapa Kami</span>
              <h2 style={{ fontSize:'clamp(24px,3.5vw,36px)', fontWeight:800, color:'white', margin:'0 0 20px', lineHeight:1.2 }}>Pelayanan Terbaik untuk Anda & Keluarga</h2>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'16px', lineHeight:1.8, marginBottom:'28px' }}>
                {profileText}
              </p>
              {[
                { icon:'🏆', t:'Tim Medis Berkualitas', d:'Tenaga profesional berpengalaman & bersertifikat' },
                { icon:'💻', t:'Teknologi Terkini', d:'Sarana prasarana paling up-to-date' },
                { icon:'❤️', t:'Pelayanan Ramah 24/7', d:'Standby admin 24 jam untuk kebutuhan Anda' },
              ].map(f => (
                <div key={f.t} style={{ display:'flex', gap:'14px', marginBottom:'18px', alignItems:'flex-start' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontWeight:700, color:'white', margin:'0 0 3px', fontSize:'15px' }}>{f.t}</h4>
                    <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px', margin:0 }}>{f.d}</p>
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', gap:'12px', marginTop:'28px', flexWrap:'wrap' }}>
                <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'13px 26px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>Buat Janji</a>
                <Link href="/layanan" style={{ background:'white', color:GREEN, padding:'13px 26px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', border:`2px solid white` }}>Cek Layanan</Link>
              </div>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{ borderRadius:'24px', overflow:'hidden', boxShadow:'0 20px 60px rgba(14,146,179,0.2)' }}>
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
      <section style={{ padding:'80px 0', background:'transparent', overflow:'hidden' }} className="section-pad">
        <div style={{ textAlign:'center', marginBottom:'48px', padding:'0 20px' }}>
          <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Testimoni</span>
          <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, color:'white', margin:0 }}>Kata Mereka tentang Kami</h2>
        </div>
        <div className="testi-marquee-track">
          <div className="testi-marquee-content">
            {[...testimoniData, ...testimoniData].map((t: any, i: number) => (
              <div key={i} style={{ width:'300px', flex:'0 0 auto', background:`linear-gradient(180deg, ${GREEN}14 0%, rgba(255,255,255,0.92) 45%)`, backdropFilter:'blur(20px)', borderRadius:'20px', padding:'24px', border:`1px solid ${GREEN}15`, boxShadow:'0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', gap:'3px', marginBottom:'14px' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=(t.rating||5)?'#f59e0b':'#e5e7eb', fontSize:'16px' }}>★</span>)}
                </div>
                <p style={{ color:'#374151', lineHeight:1.7, fontSize:'14px', marginBottom:'18px', fontStyle:'italic' }}>"{t.komentar}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  {t.foto ? (
                    <img src={t.foto} alt={t.nama} style={{ width:'42px', height:'42px', borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${GREEN}30` }} />
                  ) : (
                    <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'15px', flexShrink:0 }}>
                      {t.nama?.[0]?.toUpperCase()||'U'}
                    </div>
                  )}
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
      {videoId && <VideoSection videoId={videoId} title={videoTitle} />}

      {/* ═══ 6 ALASAN ═══ */}
      <section style={{ padding:'80px 20px', background:'transparent' }} className="section-pad">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Kenapa Pilih Kami</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>6 Alasan Memilih Mikala</h2>
            <p style={{ color:'rgba(255,255,255,0.78)', fontSize:'16px', maxWidth:'540px', margin:'0 auto' }}>Komitmen kami untuk kesehatan Anda dan keluarga</p>
          </div>
          <div className="card-grid card-grid-mobile-scroll">
            {alasanData.slice(0,6).map((al, i) => (
              <div key={i} style={{ background:`linear-gradient(180deg, ${GREEN}20 0%, rgba(255,255,255,0.9) 55%)`, backdropFilter:'blur(20px)', borderRadius:'20px', padding:'28px 22px', border:'1px solid rgba(14,146,179,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', textAlign:'center' }}>
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
        <section style={{ padding:'80px 20px', background:'transparent' }} className="section-pad">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'40px' }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Legalitas & Sertifikasi</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, color:'white', margin:0 }}>Sertifikat & Izin Resmi Kami</h2>
            </div>
            <div style={{ display:'flex', gap:'20px', overflowX:'auto', paddingBottom:'12px', scrollSnapType:'x mandatory' }}>
              {sertifikatImages.map((img, i) => (
                <div key={i} style={{ flex:'0 0 auto', width:'220px', scrollSnapAlign:'start', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderRadius:'16px', overflow:'hidden', border:'1px solid rgba(14,146,179,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                  <img src={img} alt={`Sertifikat ${i+1}`} style={{ width:'100%', height:'280px', objectFit:'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ARTIKEL ═══ */}
      {artikel.length > 0 && (
        <section style={{ padding:'80px 20px', background:'transparent' }} className="section-pad">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
              <div>
                <span style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, color:GREEN, borderRadius:'30px', padding:'6px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>Artikel Terbaru</span>
                <h2 style={{ fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'white', margin:0 }}>Tips & Info Kesehatan</h2>
              </div>
              <Link href="/artikel" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'10px 22px', borderRadius:'20px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                Lihat Semua →
              </Link>
            </div>

            {/* ── DESKTOP: list kiri + featured besar kanan ── */}
            <div className="artikel-split hide-mobile" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', alignItems:'stretch', background:'rgba(255,255,255,0.9)', backdropFilter:'blur(14px)', borderRadius:'28px', border:'1px solid rgba(14,146,179,0.1)', padding:'24px', boxShadow:'0 8px 30px rgba(0,0,0,0.2)' }}>
              {/* List */}
              <div style={{ display:'flex', flexDirection:'column' }}>
                {artikel.slice(1,4).map((a: any, i: number) => (
                  <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                    <div style={{ display:'flex', gap:'16px', alignItems:'center', padding:'16px 8px', borderBottom: i < 2 ? '1px solid rgba(14,146,179,0.12)' : 'none' }}>
                      <div style={{ width:'90px', height:'70px', flexShrink:0, borderRadius:'14px', overflow:'hidden' }}>
                        {a.thumbnail ? <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>📰</div>}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:'flex', gap:'8px', marginBottom:'4px', alignItems:'center' }}>
                          <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'10px', padding:'2px 8px', fontSize:'10px', fontWeight:700, textTransform:'uppercase' }}>{a.kategori||'Artikel'}</span>
                          <span style={{ color:'#9ca3af', fontSize:'11px' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short'}) : ''}</span>
                        </div>
                        <h3 style={{ fontSize:'14px', fontWeight:700, color:'#1a2e25', margin:0, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{a.judul}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Featured */}
              {artikel[0] && (
                <Link href={`/artikel/${artikel[0].slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ position:'relative', borderRadius:'22px', overflow:'hidden', height:'100%', minHeight:'380px' }}>
                    {artikel[0].thumbnail ? <img src={artikel[0].thumbnail} alt={artikel[0].judul} style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} /> : <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}, ${PINK})` }} />}
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,35,43,0.88) 0%, rgba(4,35,43,0.25) 55%, rgba(4,35,43,0.05) 100%)' }} />
                    <span style={{ position:'absolute', top:'18px', left:'18px', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)', color:'white', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', fontWeight:700 }}>{artikel[0].kategori||'Artikel'}</span>
                    <div style={{ position:'absolute', bottom:'24px', left:'24px', right:'24px' }}>
                      <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'12px' }}>{artikel[0].created_at ? new Date(artikel[0].created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : ''}</span>
                      <h3 style={{ fontSize:'22px', fontWeight:800, color:'white', margin:'6px 0 0', lineHeight:1.3 }}>{artikel[0].judul}</h3>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* ── MOBILE: list dengan thumbnail kiri ── */}
            <div className="hide-desktop" style={{ flexDirection:'column', gap:'0', background:'rgba(255,255,255,0.9)', backdropFilter:'blur(14px)', borderRadius:'20px', padding:'8px 16px', boxShadow:'0 8px 30px rgba(0,0,0,0.2)' }}>
              {artikel.slice(0,4).map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ display:'flex', gap:'14px', alignItems:'center', padding:'14px 4px', borderBottom: i < Math.min(artikel.length,4)-1 ? '1px solid rgba(14,146,179,0.12)' : 'none' }}>
                    <div style={{ width:'88px', height:'88px', flexShrink:0, borderRadius:'16px', overflow:'hidden' }}>
                      {a.thumbnail ? <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px' }}>📰</div>}
                    </div>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ display:'flex', gap:'8px', marginBottom:'4px', alignItems:'center' }}>
                        <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'10px', padding:'2px 8px', fontSize:'10px', fontWeight:700, textTransform:'uppercase' }}>{a.kategori||'Artikel'}</span>
                        <span style={{ color:'#9ca3af', fontSize:'11px' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short'}) : ''}</span>
                      </div>
                      <h3 style={{ fontSize:'14px', fontWeight:700, color:'#1a2e25', margin:0, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{a.judul}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section style={{ padding:'80px 20px', background:`linear-gradient(135deg, ${GREEN} 0%, #3a3a6b 50%, ${PINK} 100%)`, position:'relative', overflow:'hidden', textAlign:'center' }} className="section-pad">
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

      <style>{`
        .testi-marquee-content { display:flex; gap:20px; width:max-content; animation: mgm-testi-marquee 38s linear infinite; }
        .testi-marquee-track:hover .testi-marquee-content { animation-play-state: paused; }
        @keyframes mgm-testi-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
