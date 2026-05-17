import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

export default function TentangPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/tentang" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Tentang Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>Mengenal lebih dekat Mikala Global Medika</p>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        {/* About */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap:'40px', alignItems:'center', marginBottom:'64px' }}>
          <div>
            <span style={{ display:'inline-block', background:`${GREEN}15`, color:GREEN, borderRadius:'25px', padding:'5px 16px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'14px' }}>Siapa Kami</span>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'#1a2e25', margin:'0 0 16px', lineHeight:1.2 }}>Mikala Global Medika</h2>
            <p style={{ fontSize:'clamp(14px,2vw,16px)', color:'#6b7280', lineHeight:1.8, marginBottom:'16px' }}>
              Kami adalah penyedia layanan medis terpercaya yang berkomitmen untuk memberikan pelayanan Homecare terbaik secara profesional, mengutamakan kepuasan pasien dan keluarga.
            </p>
            <p style={{ fontSize:'clamp(14px,2vw,16px)', color:'#6b7280', lineHeight:1.8, marginBottom:'28px' }}>
              Didukung tim profesional berpengalaman dan terlatih untuk memberikan perawatan medis dan non-medis berkualitas dengan sepenuh hati.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'14px' }}>
              {[{v:'500+',l:'Customer'},{v:'100+',l:'Tenaga Kesehatan'},{v:'50+',l:'Mitra'}].map(s => (
                <div key={s.l} style={{ textAlign:'center', background:`linear-gradient(135deg, ${GREEN}10, ${PINK}10)`, borderRadius:'14px', padding:'16px 8px', border:`1px solid ${GREEN}15` }}>
                  <div style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:900, color:GREEN }}>{s.v}</div>
                  <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'3px' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius:'20px', overflow:'hidden', boxShadow:'0 16px 50px rgba(45,122,94,0.15)' }}>
            <img src="https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg" alt="Tim Mikala" style={{ width:'100%', height:'clamp(250px,40vw,380px)', objectFit:'cover' }} />
          </div>
        </div>

        {/* Visi Misi */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap:'20px', marginBottom:'64px' }}>
          {[
            { icon:'🎯', title:'Visi', desc:'Menjadi penyedia layanan homecare terpercaya dan terbaik di Indonesia yang mengutamakan kualitas, profesionalisme, dan kepuasan pelanggan.' },
            { icon:'🚀', title:'Misi', desc:'Menyediakan tenaga kesehatan terlatih, memberikan pelayanan prima 24 jam, dan terus berinovasi untuk meningkatkan kualitas layanan homecare.' },
          ].map(v => (
            <div key={v.title} style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(10px)', borderRadius:'20px', padding:'28px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}10` }}>
              <div style={{ fontSize:'36px', marginBottom:'14px' }}>{v.icon}</div>
              <h3 style={{ fontSize:'20px', fontWeight:800, color:'#1a2e25', margin:'0 0 10px' }}>{v.title}</h3>
              <p style={{ color:'#6b7280', lineHeight:1.8, margin:0, fontSize:'14px' }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <h2 style={{ fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'#1a2e25' }}>Nilai-Nilai Kami</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap:'16px' }}>
          {[
            { icon:'❤️', title:'Sepenuh Hati', desc:'Melayani dengan tulus dan kasih' },
            { icon:'🏆', title:'Profesionalisme', desc:'Terlatih dan bersertifikat' },
            { icon:'🔒', title:'Kepercayaan', desc:'Prioritas utama kami' },
            { icon:'💡', title:'Inovasi', desc:'Terus berkembang' },
            { icon:'🤝', title:'Kerjasama', desc:'Bersama klien & keluarga' },
            { icon:'⭐', title:'Kualitas', desc:'Standar layanan tinggi' },
          ].map(v => (
            <div key={v.title} style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(10px)', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', border:`1px solid ${GREEN}10`, textAlign:'center' }}>
              <div style={{ fontSize:'32px', marginBottom:'10px' }}>{v.icon}</div>
              <h4 style={{ fontWeight:700, color:'#1a2e25', margin:'0 0 6px', fontSize:'14px' }}>{v.title}</h4>
              <p style={{ color:'#6b7280', fontSize:'12px', margin:0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:'48px' }}>
          <a href={WA} target="_blank" rel="noreferrer"
            style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'14px 32px', borderRadius:'25px', fontSize:'15px', fontWeight:700, textDecoration:'none', display:'inline-block' }}>
            💬 Hubungi Kami
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
