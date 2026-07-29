'use client';
import { useState } from 'react';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import ScrollFade from '../(components)/ScrollFade';

const GREEN = '#0e92b3';
const PINK = '#9c488b';
const WA = "https://wa.me/6282114488878";

const FAQ = [
  { q: 'Mikala Global Medika layanan kesehatan yang bergerak dibidang apa?', a: 'Perusahaan yang menyediakan layanan kesehatan di rumah.' },
  { q: 'Berlokasi dimana dan melayani wilayah mana saja?', a: 'Berlokasi di Bekasi, Jawa Barat. Dan dapat melayani seluruh Indonesia.' },
  { q: 'Apakah bisa mendapatkan layanan harian atau bisa bulanan?', a: 'Semua jenis layanan kami bisa Anda dapatkan sesuai kebutuhan, harian atau bulanan.' },
  { q: 'Homecare Mikala Global Medika lebih mahal atau murah?', a: 'Harga termurah di kelasnya, dengan kualitas dan layanan homecare terbaik di kelasnya.' },
  { q: 'Kapan saya dapat menghubungi saat membutuhkan layanan ini?', a: "Tersedia selama 24 jam! Hari kerja setiap pukul 09.00 - 17.00 WIB, dari Senin - Jum'at." },
  { q: 'Bagaimana caranya saya dapat mengetahui layanan yang tepat untuk saya?', a: 'Dapat menghubungi kami di semua kanal yang tersedia: media sosial, WhatsApp, dsb.' },
];

const NARAHUBUNG = [
  { label: 'Customer Care', msg: 'Halo Mikala, saya ingin menghubungi Customer Care.' },
  { label: 'Rekrutmen', msg: 'Halo Mikala, saya ingin bertanya seputar Rekrutmen / Karir.' },
  { label: 'Kerja Sama', msg: 'Halo Mikala, saya ingin menjajaki peluang Kerja Sama.' },
];

export default function KontakPage() {
  const [form, setForm] = useState({ nama:'', phone:'', email:'', pesan:'' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Halo Mikala!\n\nNama: ${form.nama}\nNo. WhatsApp: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ''}${form.pesan ? `\nPesan: ${form.pesan}` : ''}`);
    window.open(`${WA}?text=${msg}`, '_blank');
    setSent(true);
  };

  const inp = { width:'100%', padding:'12px 14px', borderRadius:'12px', border:'1px solid #e5e7eb', fontSize:'14px', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit', background:'white' };

  return (
    <div style={{ minHeight:'100vh', background:'#eef8fa' }}>
      <Navbar active="/kontak" />

      {/* ═══ HERO + FORM ═══ */}
      <div style={{ background:`linear-gradient(160deg, ${PINK} 0%, ${GREEN} 100%)`, padding:'clamp(36px,7vw,60px) 20px clamp(48px,8vw,80px)' }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(28px,5vw,44px)' }}>
          <span style={{ display:'inline-block', background:'rgba(255,255,255,0.16)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', fontWeight:700, marginBottom:'16px' }}>Hubungi Kami</span>
          <h1 style={{ fontSize:'clamp(24px,4.5vw,38px)', fontWeight:800, color:'white', margin:0 }}>Kami Siap Membantu Anda</h1>
        </div>

        <ScrollFade>
          <div style={{ maxWidth:'480px', margin:'0 auto', background:'white', borderRadius:'32px 32px 32px 6px', padding:'clamp(24px,4.5vw,40px)', boxShadow:'0 20px 50px rgba(0,0,0,0.22)' }}>
            <h3 style={{ fontSize:'clamp(19px,2.6vw,24px)', fontWeight:800, color:'#1a2e25', margin:'0 0 22px', textAlign:'center', letterSpacing:'0.5px' }}>KIRIM PESAN</h3>
            {sent ? (
              <div style={{ textAlign:'center', padding:'30px 0' }}>
                <div style={{ fontSize:'56px', marginBottom:'14px' }}>✅</div>
                <h4 style={{ color:GREEN, fontWeight:700, fontSize:'18px', margin:'0 0 8px' }}>Terkirim!</h4>
                <p style={{ color:'#6b7280', margin:'0 0 20px' }}>Kami segera menghubungi Anda via WhatsApp.</p>
                <button onClick={() => setSent(false)} style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'11px 24px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:600 }}>Kirim Lagi</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'#374151', marginBottom:'5px' }}>Nama Lengkap :*</label>
                  <input required value={form.nama} onChange={e => setForm(p => ({...p,nama:e.target.value}))} placeholder="Nama Lengkap Anda" style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'#374151', marginBottom:'5px' }}>Nomor Whatsapp :*</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm(p => ({...p,phone:e.target.value}))} placeholder="62xxxxxxxxxx" style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'#374151', marginBottom:'5px' }}>Email :</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({...p,email:e.target.value}))} placeholder="xxxx@email.com" style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'#374151', marginBottom:'5px' }}>Pesan Anda : (opsional)</label>
                  <textarea maxLength={1000} value={form.pesan} onChange={e => setForm(p => ({...p,pesan:e.target.value}))} placeholder="Ceritakan kebutuhan Anda! (maks. 1000 kata)" style={{...inp, minHeight:'90px', resize:'vertical'}} />
                </div>
                <button type="submit" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'13px', borderRadius:'12px', border:'none', fontSize:'15px', fontWeight:700, cursor:'pointer', marginTop:'4px' }}>
                  Kirim
                </button>
              </form>
            )}
          </div>
        </ScrollFade>
      </div>

      {/* ═══ NARAHUBUNG ═══ */}
      <div style={{ padding:'clamp(36px,6vw,56px) 20px', textAlign:'center' }}>
        <ScrollFade>
          <h2 style={{ fontSize:'clamp(19px,2.6vw,24px)', fontWeight:800, color:'#1a2e25', margin:'0 0 22px' }}>Narahubung</h2>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            {NARAHUBUNG.map(n => (
              <a key={n.label} href={`${WA}?text=${encodeURIComponent(n.msg)}`} target="_blank" rel="noreferrer"
                style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'13px 26px', borderRadius:'14px', fontWeight:700, fontSize:'14px', textDecoration:'none', boxShadow:`0 6px 18px ${GREEN}30` }}>
                {n.label}
              </a>
            ))}
          </div>
        </ScrollFade>
      </div>

      {/* ═══ FAQ ═══ */}
      <div style={{ padding:'0 20px clamp(48px,8vw,80px)' }} className="section-pad">
        <div style={{ maxWidth:'800px', margin:'0 auto', background:`linear-gradient(135deg, ${PINK}, #7a3570)`, borderRadius:'28px', padding:'clamp(28px,4.5vw,44px)', boxShadow:`0 20px 50px ${PINK}30` }}>
          <ScrollFade>
            <h2 style={{ textAlign:'center', color:'white', fontSize:'clamp(19px,2.8vw,24px)', fontWeight:800, margin:'0 0 4px', letterSpacing:'1px' }}>FAQ</h2>
            <p style={{ textAlign:'center', color:'rgba(255,255,255,0.8)', fontSize:'13px', margin:'0 0 26px', fontStyle:'italic' }}>Frequently Asked Questions</p>
          </ScrollFade>
          <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            {FAQ.map((f, i) => (
              <ScrollFade key={i} delay={i*80}>
                <div>
                  <p style={{ color:'white', fontWeight:700, fontSize:'14.5px', margin:'0 0 5px', lineHeight:1.5 }}>{i+1}. {f.q}</p>
                  <p style={{ color:'rgba(255,255,255,0.82)', fontSize:'13.5px', margin:0, lineHeight:1.7, paddingLeft:'18px' }}>{f.a}</p>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
