import Link from 'next/link';

const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";

export default function TentangPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 2px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'70px' }}>
          <Link href="/"><img src={LOGO} alt="Mikala" style={{ height:'40px', objectFit:'contain' }} /></Link>
          <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
            {[{href:'/',l:'Beranda'},{href:'/tentang',l:'Tentang'},{href:'/layanan',l:'Layanan'},{href:'/artikel',l:'Artikel'},{href:'/galeri',l:'Galeri'},{href:'/kontak',l:'Kontak'}].map(n => (
              <Link key={n.href} href={n.href} style={{ color: n.href==='/tentang'?GREEN:'#374151', fontSize:'14px', fontWeight: n.href==='/tentang'?700:500, textDecoration:'none' }}>{n.l}</Link>
            ))}
            <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'10px 20px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>Konsultasi</a>
          </div>
        </div>
      </nav>

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'60px 24px', textAlign:'center' }}>
        <h1 style={{ fontSize:'42px', fontWeight:800, color:'white', margin:'0 0 12px' }}>Tentang Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', margin:0 }}>Mengenal lebih dekat Mikala Global Medika</p>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'60px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center', marginBottom:'80px' }}>
          <div>
            <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, borderRadius:'25px', padding:'8px 20px', marginBottom:'16px' }}>
              <span style={{ color:GREEN, fontSize:'13px', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px' }}>Siapa Kami</span>
            </div>
            <h2 style={{ fontSize:'36px', fontWeight:800, color:'#1a2e25', margin:'0 0 20px', lineHeight:1.2 }}>Mikala Global Medika</h2>
            <p style={{ fontSize:'16px', color:'#6b7280', lineHeight:1.8, marginBottom:'20px' }}>
              Kami adalah penyedia layanan medis terpercaya yang berkomitmen untuk memberikan pelayanan Homecare terbaik dan terpercaya secara profesional yang mengutamakan kepuasan pasien dan keluarga.
            </p>
            <p style={{ fontSize:'16px', color:'#6b7280', lineHeight:1.8, marginBottom:'32px' }}>
              Didukung oleh tim profesional yang berpengalaman dan terlatih untuk memberikan perawatan medis dan non medis yang berkualitas dan sepenuh hati dalam melayani dan merawat pasien.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px' }}>
              {[{v:'500+',l:'Customer'},{v:'100+',l:'Tenaga Kesehatan'},{v:'50+',l:'Mitra'}].map(s => (
                <div key={s.l} style={{ textAlign:'center', background:`linear-gradient(135deg, ${GREEN}08, ${PINK}08)`, borderRadius:'16px', padding:'20px', border:`1px solid ${GREEN}15` }}>
                  <div style={{ fontSize:'32px', fontWeight:900, color:GREEN }}>{s.v}</div>
                  <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'4px' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius:'24px', overflow:'hidden', boxShadow:'0 20px 60px rgba(45,122,94,0.15)' }}>
            <img src="https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg" alt="Tim Mikala" style={{ width:'100%', height:'400px', objectFit:'cover' }} />
          </div>
        </div>

        {/* Visi Misi */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'80px' }}>
          {[
            { icon:'🎯', title:'Visi', desc:'Menjadi penyedia layanan homecare terpercaya dan terbaik di Indonesia yang mengutamakan kualitas, profesionalisme, dan kepuasan pelanggan.' },
            { icon:'🚀', title:'Misi', desc:'Menyediakan tenaga kesehatan terlatih dan bersertifikat, memberikan pelayanan prima 24 jam, dan terus berinovasi untuk meningkatkan kualitas layanan homecare.' },
          ].map(v => (
            <div key={v.title} style={{ background:'white', borderRadius:'20px', padding:'32px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}10` }}>
              <div style={{ fontSize:'40px', marginBottom:'16px' }}>{v.icon}</div>
              <h3 style={{ fontSize:'22px', fontWeight:800, color:'#1a2e25', margin:'0 0 12px' }}>{v.title}</h3>
              <p style={{ color:'#6b7280', lineHeight:1.8, margin:0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <h2 style={{ fontSize:'36px', fontWeight:800, color:'#1a2e25' }}>Nilai-Nilai Kami</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px' }}>
          {[
            { icon:'❤️', title:'Pelayanan Sepenuh Hati', desc:'Kami melayani dengan tulus dan penuh kasih' },
            { icon:'🏆', title:'Profesionalisme', desc:'Tim terlatih dan bersertifikat di bidangnya' },
            { icon:'🔒', title:'Kepercayaan', desc:'Menjaga kepercayaan klien adalah prioritas utama' },
            { icon:'💡', title:'Inovasi', desc:'Terus berkembang mengikuti perkembangan medis' },
            { icon:'🤝', title:'Kerjasama', desc:'Bekerja sama dengan klien dan keluarga pasien' },
            { icon:'⭐', title:'Kualitas', desc:'Standar layanan tinggi di setiap aspek' },
          ].map(v => (
            <div key={v.title} style={{ background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', border:`1px solid ${GREEN}10`, textAlign:'center' }}>
              <div style={{ fontSize:'36px', marginBottom:'12px' }}>{v.icon}</div>
              <h4 style={{ fontWeight:700, color:'#1a2e25', margin:'0 0 8px', fontSize:'15px' }}>{v.title}</h4>
              <p style={{ color:'#6b7280', fontSize:'13px', margin:0 }}>{v.desc}</p>
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
