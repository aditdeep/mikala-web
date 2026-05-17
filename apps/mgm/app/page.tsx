import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';

async function getSettings() {
  try {
    const res = await fetch(`${API}/cms/settings`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || {};
  } catch { return {}; }
}

async function getLayanan() {
  try {
    const res = await fetch(`${API}/cms/layanan`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getArtikel() {
  try {
    const res = await fetch(`${API}/cms/artikel?per_page=6`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const d = data.data;
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

async function getTestimoni() {
  try {
    const res = await fetch(`${API}/cms/testimoni`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [settings, layanan, artikel, testimoni] = await Promise.all([
    getSettings(), getLayanan(), getArtikel(), getTestimoni()
  ]);

  const stats = [
    { value: (settings.stats_customer || '500') + '+', label: 'Customer' },
    { value: (settings.stats_nakes || '100') + '+', label: 'Tenaga Kesehatan' },
    { value: (settings.stats_mitra || '50') + '+', label: 'Mitra' },
  ];

  const defaultTestimoni = [
    { nama:'Anna', komentar:'Semoga menjadikan layanan yang ramah dan bermanfaat bagi masyarakat luas.. aamiin🤲', rating:5, layanan:'Pelayanan Penunjang' },
    { nama:'Kartika', komentar:'Sangat puas, sesuai dengan harapan. Pertahankan pelayanan yang sudah sangat baik!', rating:5, layanan:'Pelayanan Penunjang' },
    { nama:'Andi', komentar:'Sangat bagus, bisa update terhadap kondisi kesehatan saya. Mudah-mudahan berkah ya, amiin.', rating:5, layanan:'Perawat Medis' },
    { nama:'John', komentar:'Program berjalan dengan baik dan timeline sesuai dengan yang direncanakan.', rating:5, layanan:'Perawat Jiwa' },
  ];
  const testimonialData = testimoni.length > 0 ? testimoni : defaultTestimoni;

  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>

      {/* NAVBAR */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 2px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'70px' }}>
          <Link href="/">
            <img src={LOGO} alt="Mikala Global Medika" style={{ height:'40px', objectFit:'contain' }} />
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:'32px' }}>
            {[
              { href:'/', label:'Beranda' },
              { href:'/tentang', label:'Tentang Kami' },
              { href:'/layanan', label:'Layanan' },
              { href:'/artikel', label:'Artikel' },
              { href:'/galeri', label:'Galeri' },
              { href:'/kontak', label:'Karir' },
            ].map(n => (
              <Link key={n.href} href={n.href} style={{ color:'#374151', fontSize:'14px', fontWeight:500, textDecoration:'none', transition:'color 0.2s' }}>
                {n.label}
              </Link>
            ))}
            <a href={WA} target="_blank" rel="noreferrer"
              style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'10px 20px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none', boxShadow:`0 4px 15px rgba(45,122,94,0.3)` }}>
              Konsultasi
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'90vh', display:'flex', alignItems:'center', overflow:'hidden', background:`linear-gradient(135deg, #0a2e1e 0%, #1a5c3a 40%, #2d7a5e 70%, #d63a7a 100%)` }}>
        {/* Animated bg orbs */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(214,58,122,0.15)', filter:'blur(80px)' }} />
          <div style={{ position:'absolute', bottom:'-50px', left:'-50px', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(45,122,94,0.2)', filter:'blur(60px)' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'600px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', filter:'blur(40px)' }} />
        </div>

        {/* Hero image */}
        {settings.hero_image && (
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'45%', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #0a2e1e, transparent)', zIndex:1 }} />
            <img src={settings.hero_image} alt="Homecare" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.4 }} />
          </div>
        )}

        <div style={{ position:'relative', zIndex:2, maxWidth:'1200px', margin:'0 auto', padding:'80px 24px' }}>
          <div style={{ maxWidth:'650px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', borderRadius:'25px', padding:'8px 16px', marginBottom:'24px', border:'1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} />
              <span style={{ color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:500 }}>Layanan Homecare 24 Jam Tersedia</span>
            </div>
            <h1 style={{ fontSize:'clamp(36px, 5vw, 60px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:'20px' }}>
              {settings.hero_title || 'Melayani Kebutuhan Kesehatan Anda'}
            </h1>
            <p style={{ fontSize:'18px', color:'rgba(255,255,255,0.8)', lineHeight:1.7, marginBottom:'40px', maxWidth:'550px' }}>
              {settings.hero_subtitle || 'Mikala Global Medika, penyedia layanan medis terpercaya yang berkomitmen untuk memberikan pelayanan Homecare terbaik secara profesional.'}
            </p>
            <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
              <a href={WA} target="_blank" rel="noreferrer"
                style={{ background:`linear-gradient(135deg, ${GREEN}, #3a9e78)`, color:'white', padding:'16px 32px', borderRadius:'30px', fontSize:'16px', fontWeight:700, textDecoration:'none', boxShadow:`0 8px 24px rgba(45,122,94,0.4)`, display:'flex', alignItems:'center', gap:'8px' }}>
                💬 Konsultasi Sekarang
              </a>
              <Link href="/layanan"
                style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', color:'white', padding:'16px 32px', borderRadius:'30px', fontSize:'16px', fontWeight:600, textDecoration:'none', border:'1px solid rgba(255,255,255,0.3)' }}>
                Lihat Layanan
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:'40px', marginTop:'60px', flexWrap:'wrap' }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize:'36px', fontWeight:900, color:'white', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.7)', marginTop:'4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section style={{ padding:'80px 24px', background:'white' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, borderRadius:'25px', padding:'8px 20px', marginBottom:'16px' }}>
              <span style={{ color:GREEN, fontSize:'13px', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px' }}>Layanan Kami</span>
            </div>
            <h2 style={{ fontSize:'40px', fontWeight:800, color:'#1a2e25', margin:'0 0 16px' }}>Langkah Tepat untuk Mengawal Kesehatan Anda</h2>
            <p style={{ fontSize:'16px', color:'#6b7280', maxWidth:'600px', margin:'0 auto', lineHeight:1.7 }}>
              Tim profesional berpengalaman untuk memberikan perawatan medis dan non-medis berkualitas tinggi
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'24px' }}>
            {(layanan.length > 0 ? layanan : [
              { nama:'Perawat Medis', deskripsi:'Menghadirkan perawat profesional untuk merawat dan menemani pasien di rumah maupun rumah sakit.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/1.jpg' },
              { nama:'Perawat Jiwa', deskripsi:'Melayani berbagai aspek dukungan dan perawatan bagi individu dengan masalah kesehatan mental.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/Perawatan-khusus.png' },
              { nama:'Caregiver/Perawat Lansia', deskripsi:'Mendampingi dan mengurus pasien atau orang tua yang tidak mandiri dalam aktivitas sehari-hari.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/rawat-jalan.jpg' },
              { nama:'Babysitter', deskripsi:'Tenaga terlatih dan berpengalaman dalam merawat anak, bayi, dan ibu pra/pasca melahirkan.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/babysitter_oke.jpg' },
              { nama:'Dokter Visit', deskripsi:'Menghadirkan dokter-dokter terbaik ke rumah Anda sesuai kebutuhan.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/periksa-berkala_new.jpg' },
              { nama:'Medikal Evakuasi', deskripsi:'Menyediakan ambulan dengan peralatan medis lengkap untuk kebutuhan evakuasi.', gambar:'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/08/Medikal-evakuasi.jpg' },
            ]).map((l: any, i: number) => (
              <div key={i} style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', transition:'transform 0.3s, box-shadow 0.3s', border:'1px solid rgba(45,122,94,0.08)' }}
>
                <div style={{ height:'200px', overflow:'hidden', position:'relative' }}>
                  {l.gambar ? (
                    <img src={l.gambar} alt={l.nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>🏥</div>
                  )}
                  <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(0,0,0,0.4), transparent)` }} />
                </div>
                <div style={{ padding:'20px' }}>
                  <h3 style={{ fontSize:'18px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px' }}>{l.nama}</h3>
                  <p style={{ fontSize:'14px', color:'#6b7280', lineHeight:1.6, margin:'0 0 16px' }}>{l.deskripsi}</p>
                  <a href={WA} target="_blank" rel="noreferrer"
                    style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:GREEN, fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                    Konsultasi Sekarang →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding:'80px 24px', background:`linear-gradient(135deg, ${GREEN}08, ${PINK}08)` }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center' }}>
            <div>
              <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, borderRadius:'25px', padding:'8px 20px', marginBottom:'16px' }}>
                <span style={{ color:GREEN, fontSize:'13px', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px' }}>Tentang Kami</span>
              </div>
              <h2 style={{ fontSize:'36px', fontWeight:800, color:'#1a2e25', margin:'0 0 20px', lineHeight:1.2 }}>Pelayanan Kami Terbaik buat Anda</h2>
              <p style={{ fontSize:'16px', color:'#6b7280', lineHeight:1.8, marginBottom:'32px' }}>
                Kami senantiasa mendengarkan segala keluhan Anda dan berusaha memberikan solusi terbaik untuk kesehatan Anda dan keluarga.
              </p>
              {[
                { icon:'🏆', title:'Tim Medis Berkualitas', desc:'Didukung tenaga profesional & berpengalaman' },
                { icon:'💻', title:'Teknologi Terkini', desc:'Sarana dan prasarana yang paling update' },
                { icon:'❤️', title:'Pelayanan Ramah', desc:'Mengutamakan kepuasan dan kenyamanan Anda' },
              ].map(f => (
                <div key={f.title} style={{ display:'flex', gap:'16px', marginBottom:'20px', alignItems:'flex-start' }}>
                  <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontWeight:700, color:'#1a2e25', margin:'0 0 4px', fontSize:'15px' }}>{f.title}</h4>
                    <p style={{ color:'#6b7280', fontSize:'14px', margin:0 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', gap:'12px', marginTop:'32px' }}>
                <a href={WA} target="_blank" rel="noreferrer"
                  style={{ background:`linear-gradient(135deg, ${GREEN}, #3a9e78)`, color:'white', padding:'14px 28px', borderRadius:'25px', fontSize:'15px', fontWeight:600, textDecoration:'none' }}>
                  Buat Janji
                </a>
                <Link href="/layanan"
                  style={{ background:'white', color:GREEN, padding:'14px 28px', borderRadius:'25px', fontSize:'15px', fontWeight:600, textDecoration:'none', border:`2px solid ${GREEN}` }}>
                  Cek Layanan
                </Link>
              </div>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{ borderRadius:'24px', overflow:'hidden', boxShadow:'0 20px 60px rgba(45,122,94,0.2)' }}>
                <img src="https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg" alt="Tim Mikala" style={{ width:'100%', height:'400px', objectFit:'cover' }} />
              </div>
              <div style={{ position:'absolute', bottom:'-20px', right:'-20px', background:'white', borderRadius:'16px', padding:'20px', boxShadow:'0 8px 30px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontSize:'32px' }}>⭐</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'20px', color:'#1a2e25' }}>4.9/5.0</div>
                  <div style={{ color:'#6b7280', fontSize:'12px' }}>Rating Pelanggan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section style={{ padding:'80px 24px', background:'white' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, borderRadius:'25px', padding:'8px 20px', marginBottom:'16px' }}>
              <span style={{ color:GREEN, fontSize:'13px', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px' }}>Testimoni</span>
            </div>
            <h2 style={{ fontSize:'40px', fontWeight:800, color:'#1a2e25', margin:0 }}>Our Happy Customers</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'24px' }}>
            {testimonialData.slice(0,4).map((t: any, i: number) => (
              <div key={i} style={{ background:`linear-gradient(135deg, ${GREEN}06, ${PINK}06)`, borderRadius:'20px', padding:'28px', border:`1px solid ${GREEN}15` }}>
                <div style={{ display:'flex', gap:'4px', marginBottom:'16px' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=(t.rating||5)?'#f59e0b':'#e5e7eb', fontSize:'18px' }}>★</span>)}
                </div>
                <p style={{ color:'#374151', lineHeight:1.7, fontSize:'14px', marginBottom:'20px', fontStyle:'italic' }}>"{t.komentar}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'16px' }}>
                    {t.nama?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, color:'#1a2e25', fontSize:'14px' }}>{t.nama}</div>
                    <div style={{ color:'#6b7280', fontSize:'12px' }}>{t.layanan || 'Pelanggan'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIKEL */}
      {artikel.length > 0 && (
        <section style={{ padding:'80px 24px', background:`linear-gradient(135deg, ${GREEN}06, ${PINK}06)` }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
              <div>
                <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, borderRadius:'25px', padding:'8px 20px', marginBottom:'12px' }}>
                  <span style={{ color:GREEN, fontSize:'13px', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px' }}>Blog & Artikel</span>
                </div>
                <h2 style={{ fontSize:'36px', fontWeight:800, color:'#1a2e25', margin:0 }}>Artikel Terbaru</h2>
              </div>
              <Link href="/artikel" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 24px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>
                Lihat Semua →
              </Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px' }}>
              {artikel.slice(0,3).map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', transition:'transform 0.3s', height:'100%' }}
    >
                    <div style={{ height:'200px', overflow:'hidden' }}>
                      {a.thumbnail ? (
                        <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      ) : (
                        <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>📰</div>
                      )}
                    </div>
                    <div style={{ padding:'20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                        <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'12px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{a.kategori || 'Artikel'}</span>
                        <span style={{ color:'#9ca3af', fontSize:'12px' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                      </div>
                      <h3 style={{ fontSize:'16px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px', lineHeight:1.4 }}>{a.judul}</h3>
                      <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.6, margin:0 }}>{a.excerpt?.slice(0,120)}...</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding:'80px 24px', background:`linear-gradient(135deg, ${GREEN} 0%, #1a5c3a 50%, ${PINK} 100%)`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0 }}>
          <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', filter:'blur(40px)' }} />
        </div>
        <div style={{ maxWidth:'700px', margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'40px', fontWeight:800, color:'white', margin:'0 0 20px' }}>Hubungi Kami Sekarang</h2>
          <p style={{ fontSize:'18px', color:'rgba(255,255,255,0.85)', marginBottom:'40px', lineHeight:1.7 }}>
            Kami siap menjawab pertanyaan dan membantu Anda mendapatkan perawatan terbaik untuk kesehatan Anda dan keluarga.
          </p>
          <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <a href={WA} target="_blank" rel="noreferrer"
              style={{ background:'white', color:GREEN, padding:'16px 32px', borderRadius:'30px', fontSize:'16px', fontWeight:700, textDecoration:'none', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' }}>
              💬 WhatsApp Sekarang
            </a>
            <Link href="/kontak"
              style={{ background:'rgba(255,255,255,0.15)', color:'white', padding:'16px 32px', borderRadius:'30px', fontSize:'16px', fontWeight:600, textDecoration:'none', border:'2px solid rgba(255,255,255,0.4)' }}>
              Lihat Kontak
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#0a1f14', color:'white', padding:'60px 24px 24px' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'40px', marginBottom:'40px' }}>
            <div>
              <img src={LOGO} alt="Mikala" style={{ height:'40px', marginBottom:'16px', filter:'brightness(0) invert(1)' }} />
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'14px', lineHeight:1.8, margin:'0 0 20px' }}>
                Penyedia layanan medis terpercaya yang mendedikasikan diri untuk meningkatkan kesehatan dan kesejahteraan masyarakat.
              </p>
              <div style={{ display:'flex', gap:'12px' }}>
                {[
                  { href:'https://www.facebook.com/mikalaglobalmdk/', icon:'📘' },
                  { href:'https://www.instagram.com/mikalaglobalmedika/', icon:'📸' },
                  { href:'https://www.tiktok.com/@mikalaglobalmedika_pt', icon:'🎵' },
                  { href:'https://www.youtube.com/@MikalaGlobalMedika', icon:'▶️' },
                ].map(s => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                    style={{ width:'38px', height:'38px', borderRadius:'10px', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', textDecoration:'none' }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight:700, fontSize:'15px', marginBottom:'16px', color:'white' }}>Layanan</h4>
              {['Perawat Medis','Perawat Jiwa','Caregiver','Babysitter','Dokter Visit','Medikal Evakuasi'].map(l => (
                <div key={l} style={{ marginBottom:'8px' }}>
                  <Link href="/layanan" style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', textDecoration:'none' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontWeight:700, fontSize:'15px', marginBottom:'16px', color:'white' }}>Navigasi</h4>
              {[{l:'Beranda',h:'/'},{l:'Tentang Kami',h:'/tentang'},{l:'Artikel',h:'/artikel'},{l:'Galeri',h:'/galeri'},{l:'Kontak',h:'/kontak'}].map(n => (
                <div key={n.l} style={{ marginBottom:'8px' }}>
                  <Link href={n.h} style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', textDecoration:'none' }}>{n.l}</Link>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontWeight:700, fontSize:'15px', marginBottom:'16px', color:'white' }}>Kontak</h4>
              {[
                { icon:'📍', text: settings.alamat || 'Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi' },
                { icon:'📞', text: settings.phone || '0821-1448-8878' },
                { icon:'✉️', text: settings.email_cs || 'cs@mikalaglobalmedika.com' },
                { icon:'🕐', text: 'Senin-Sabtu 08.00-21.00' },
              ].map(c => (
                <div key={c.icon} style={{ display:'flex', gap:'8px', marginBottom:'10px', color:'rgba(255,255,255,0.6)', fontSize:'13px', alignItems:'flex-start' }}>
                  <span style={{ flexShrink:0 }}>{c.icon}</span><span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', margin:0 }}>Copyright © 2026 mikalaglobalmedika.com. All Rights Reserved</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', margin:0, fontStyle:'italic' }}>With Love We Serve</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
