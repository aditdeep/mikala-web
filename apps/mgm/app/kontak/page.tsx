'use client';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

export default function KontakPage() {
  const [form, setForm] = useState({ nama:'', phone:'', email:'', layanan:'', pesan:'' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Halo Mikala!\n\nNama: ${form.nama}\nTelepon: ${form.phone}\nEmail: ${form.email}\nLayanan: ${form.layanan}\nPesan: ${form.pesan}`);
    window.open(`https://wa.me/6281296998827?text=${msg}`, '_blank');
    setSent(true);
  };

  const inp = { width:'100%', padding:'11px 14px', borderRadius:'12px', border:'1px solid #e5e7eb', fontSize:'14px', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit', background:'white' };

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/kontak" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Hubungi Kami</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>Siap membantu Anda 24 jam sehari, 7 hari seminggu</p>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap:'40px', alignItems:'start' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, color:'#1a2e25', margin:'0 0 28px' }}>Informasi Kontak</h2>
            {[
              { icon:'📍', title:'Alamat', desc:'Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi' },
              { icon:'📞', title:'Telepon', desc:'0821-1448-8878' },
              { icon:'✉️', title:'Email', desc:'cs@mikalaglobalmedika.com' },
              { icon:'🕐', title:'Jam Operasional', desc:'Senin-Sabtu, 08.00-21.00 WIB\nStandby Admin 24 jam' },
            ].map(c => (
              <div key={c.title} style={{ display:'flex', gap:'14px', marginBottom:'20px', alignItems:'flex-start' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:`linear-gradient(135deg, ${GREEN}15, ${PINK}15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{c.icon}</div>
                <div>
                  <p style={{ fontWeight:700, color:'#1a2e25', margin:'0 0 3px', fontSize:'14px' }}>{c.title}</p>
                  <p style={{ color:'#6b7280', fontSize:'13px', margin:0, whiteSpace:'pre-line' }}>{c.desc}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop:'24px' }}>
              <p style={{ fontWeight:700, color:'#1a2e25', marginBottom:'12px', fontSize:'14px' }}>Ikuti Kami:</p>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                {[
                  { href:'https://www.facebook.com/mikalaglobalmdk/', label:'Facebook' },
                  { href:'https://www.instagram.com/mikalaglobalmedika/', label:'Instagram' },
                  { href:'https://www.tiktok.com/@mikalaglobalmedika_pt', label:'TikTok' },
                  { href:'https://www.youtube.com/@MikalaGlobalMedika', label:'YouTube' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    style={{ background:'white', border:`1px solid ${GREEN}20`, borderRadius:'10px', padding:'7px 12px', fontSize:'12px', fontWeight:600, color:'#374151', textDecoration:'none' }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderRadius:'24px', padding:'clamp(20px,4vw,36px)', boxShadow:'0 8px 30px rgba(0,0,0,0.08)', border:`1px solid ${GREEN}10` }}>
            <h3 style={{ fontSize:'clamp(18px,2.5vw,22px)', fontWeight:800, color:'#1a2e25', margin:'0 0 22px' }}>Kirim Pesan</h3>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:'56px', marginBottom:'14px' }}>✅</div>
                <h4 style={{ color:GREEN, fontWeight:700, fontSize:'18px', margin:'0 0 8px' }}>Terkirim!</h4>
                <p style={{ color:'#6b7280', margin:'0 0 20px' }}>Kami segera menghubungi via WhatsApp.</p>
                <button onClick={() => setSent(false)} style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'11px 24px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:600 }}>Kirim Lagi</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {[
                  {k:'nama',l:'Nama Lengkap *',t:'text',p:'Nama Anda'},
                  {k:'phone',l:'No. WhatsApp *',t:'tel',p:'08xxxxxxxxxx'},
                  {k:'email',l:'Email',t:'email',p:'email@contoh.com'},
                ].map(f => (
                  <div key={f.k}>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'5px' }}>{f.l}</label>
                    <input required={f.l.includes('*')} type={f.t} value={(form as any)[f.k]} onChange={e => setForm(p => ({...p,[f.k]:e.target.value}))} placeholder={f.p} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'5px' }}>Layanan</label>
                  <select value={form.layanan} onChange={e => setForm(p => ({...p,layanan:e.target.value}))} style={inp}>
                    <option value="">-- Pilih Layanan --</option>
                    {['Perawat Medis','Perawat Jiwa','Caregiver','Babysitter','Dokter Visit','Medikal Evakuasi','Fisioterapi','Persewaan Alat Medis','Lainnya'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'5px' }}>Pesan</label>
                  <textarea value={form.pesan} onChange={e => setForm(p => ({...p,pesan:e.target.value}))} placeholder="Ceritakan kebutuhan Anda..." style={{...inp, minHeight:'90px', resize:'vertical'}} />
                </div>
                <button type="submit" style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'13px', borderRadius:'12px', border:'none', fontSize:'15px', fontWeight:700, cursor:'pointer' }}>
                  💬 Kirim via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
