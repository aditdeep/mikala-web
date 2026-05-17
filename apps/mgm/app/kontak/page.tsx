'use client';
import Link from 'next/link';
import { useState } from 'react';

const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const WA = "https://wa.me/6281296998827";

export default function KontakPage() {
  const [form, setForm] = useState({ nama:'', phone:'', email:'', layanan:'', pesan:'' });
  const [sent, setSent] = useState(false);
  const inp = { width:'100%', padding:'12px 16px', borderRadius:'12px', border:'1px solid #e5e7eb', fontSize:'14px', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Halo Mikala!\n\nNama: ${form.nama}\nTelepon: ${form.phone}\nEmail: ${form.email}\nLayanan: ${form.layanan}\nPesan: ${form.pesan}`);
    window.open(`https://wa.me/6281296998827?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(45,122,94,0.1)', boxShadow:'0 2px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'70px' }}>
          <Link href="/"><img src={LOGO} alt="Mikala" style={{ height:'40px', objectFit:'contain' }} /></Link>
          <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
            {[{href:'/',l:'Beranda'},{href:'/tentang',l:'Tentang'},{href:'/layanan',l:'Layanan'},{href:'/artikel',l:'Artikel'},{href:'/galeri',l:'Galeri'},{href:'/kontak',l:'Kontak'}].map(n => (
              <Link key={n.href} href={n.href} style={{ color: n.href==='/kontak'?GREEN:'#374151', fontSize:'14px', fontWeight: n.href==='/kontak'?700:500, textDecoration:'none' }}>{n.l}</Link>
            ))}
            <a href={WA} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'10px 20px', borderRadius:'25px', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>Konsultasi</a>
          </div>
        </div>
      </nav>

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'60px 24px', textAlign:'center' }}>
        <h1 style={{ fontSize:'42px', fontWeight:800, color:'white', margin:'0 0 12px' }}>Hubungi Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', margin:0 }}>Kami siap membantu Anda 24 jam sehari, 7 hari seminggu</p>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'60px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'48px', alignItems:'start' }}>
          <div>
            <h2 style={{ fontSize:'28px', fontWeight:800, color:'#1a2e25', margin:'0 0 32px' }}>Informasi Kontak</h2>
            {[
              { icon:'📍', title:'Alamat', desc:'Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi' },
              { icon:'📞', title:'Telepon', desc:'0821-1448-8878' },
              { icon:'✉️', title:'Email', desc:'cs@mikalaglobalmedika.com' },
              { icon:'🕐', title:'Jam Operasional', desc:'Senin-Sabtu, 08.00-21.00 WIB\nStandby Admin 24 jam' },
            ].map(c => (
              <div key={c.title} style={{ display:'flex', gap:'16px', marginBottom:'24px', alignItems:'flex-start' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:`linear-gradient(135deg, ${GREEN}15, ${PINK}15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>{c.icon}</div>
                <div>
                  <p style={{ fontWeight:700, color:'#1a2e25', margin:'0 0 4px', fontSize:'15px' }}>{c.title}</p>
                  <p style={{ color:'#6b7280', fontSize:'14px', margin:0, whiteSpace:'pre-line' }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:'white', borderRadius:'24px', padding:'40px', boxShadow:'0 8px 30px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize:'22px', fontWeight:800, color:'#1a2e25', margin:'0 0 24px' }}>Kirim Pesan</h3>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:'60px', marginBottom:'16px' }}>✅</div>
                <h4 style={{ color:GREEN, fontWeight:700, fontSize:'18px' }}>Terkirim via WhatsApp!</h4>
                <button onClick={() => setSent(false)} style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 24px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:600, marginTop:'16px' }}>Kirim Lagi</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {[{k:'nama',l:'Nama Lengkap *',t:'text',p:'Nama Anda'},{k:'phone',l:'No. WhatsApp *',t:'tel',p:'08xx'},{k:'email',l:'Email',t:'email',p:'email@contoh.com'}].map(f => (
                  <div key={f.k}>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>{f.l}</label>
                    <input required={f.l.includes('*')} type={f.t} value={(form as any)[f.k]} onChange={e => setForm(p => ({...p,[f.k]:e.target.value}))} placeholder={f.p} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>Layanan</label>
                  <select value={form.layanan} onChange={e => setForm(p => ({...p,layanan:e.target.value}))} style={inp}>
                    <option value="">-- Pilih Layanan --</option>
                    {['Perawat Medis','Perawat Jiwa','Caregiver','Babysitter','Dokter Visit','Medikal Evakuasi','Lainnya'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>Pesan</label>
                  <textarea value={form.pesan} onChange={e => setForm(p => ({...p,pesan:e.target.value}))} placeholder="Ceritakan kebutuhan Anda..." style={{...inp, minHeight:'100px', resize:'vertical'}} />
                </div>
                <button type="submit" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'14px', borderRadius:'12px', border:'none', fontSize:'15px', fontWeight:700, cursor:'pointer' }}>
                  💬 Kirim via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <footer style={{ background:'#0a1f14', color:'rgba(255,255,255,0.5)', padding:'24px', textAlign:'center', fontSize:'13px' }}>
        <p style={{ margin:0 }}>Copyright © 2026 mikalaglobalmedika.com. All Rights Reserved</p>
      </footer>
    </div>
  );
}
