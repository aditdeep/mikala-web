import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak — Mikala Global Akademi',
  description: 'Hubungi Mikala Global Akademi untuk informasi program, pendaftaran, dan konsultasi karir ke Jepang.',
};

const WA = 'https://wa.me/6281296998827?text=Halo%20MGA%2C%20saya%20ingin%20informasi%20program%20Kaigo%20Jepang';

export default function KontakPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/kontak"/>

      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 60%, #0d2a4a 100%)', padding: 'clamp(100px,15vw,140px) 0 clamp(60px,10vw,100px)', textAlign: 'center' }}>
        <div className="container">
          <div className="tag tag-green" style={{ marginBottom: '16px' }}>Hubungi Kami</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif" }}>
            Siap Membantu Perjalanan<br/>
            <span style={{ color: 'var(--green2)' }}>Karir Anda</span>
          </h1>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '60px' }}>
            {/* Kontak info */}
            <div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text)', marginBottom: '28px', fontFamily: "'DM Serif Display', serif" }}>Informasi Kontak</h2>
              {[
                { icon: '📍', label: 'Alamat', val: 'Jl. Anyelir No. 1-2, Jatibening, Bekasi, Jawa Barat 17412' },
                { icon: '📞', label: 'Telepon / WhatsApp', val: '+62 821-1448-8878' },
                { icon: '✉️', label: 'Email', val: 'info@mikalaglobalakademi.co.id' },
                { icon: '🕐', label: 'Jam Operasional', val: 'Senin – Sabtu: 08.00 – 17.00 WIB' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '16px', background: 'var(--bg)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14px', marginBottom: '4px' }}>{c.label}</p>
                    <p style={{ color: 'var(--text2)', fontSize: '14px' }}>{c.val}</p>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '28px' }}>
                <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px', fontSize: '14px' }}>Ikuti Kami</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[['📸', 'Instagram', 'https://instagram.com/mikalaglobal'], ['👍', 'Facebook', 'https://facebook.com/mikalaglobal'], ['▶️', 'YouTube', 'https://youtube.com/@mikalaglobal']].map(([icon, label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--green3)', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>
                      {icon} {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA WhatsApp */}
            <div>
              <div style={{ background: 'linear-gradient(135deg, var(--green), var(--blue))', borderRadius: '28px', padding: 'clamp(28px,5vw,48px)', textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>💬</div>
                <h3 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, marginBottom: '12px', fontFamily: "'DM Serif Display', serif" }}>
                  Konsultasi Langsung via WhatsApp
                </h3>
                <p style={{ opacity: 0.9, lineHeight: 1.7, marginBottom: '28px', fontSize: '15px' }}>
                  Tim konsultan kami siap menjawab pertanyaan Anda seputar program, persyaratan, dan biaya. Respon cepat di jam kerja.
                </p>
                <a href={WA} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25d366', color: 'white', padding: '16px 36px', borderRadius: '50px', fontWeight: 700, fontSize: '16px', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}>
                  <span style={{ fontSize: '22px' }}>💬</span> Chat WhatsApp Sekarang
                </a>
                <p style={{ marginTop: '16px', opacity: 0.75, fontSize: '13px' }}>Atau hubungi: +62 821-1448-8878</p>
              </div>

              {/* Map placeholder */}
              <div style={{ marginTop: '20px', background: 'var(--bg)', borderRadius: '20px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '32px' }}>🗺️</span>
                <p style={{ color: 'var(--text3)', fontSize: '13px' }}>Jl. Anyelir No. 1-2, Jatibening, Bekasi</p>
                <a href="https://maps.google.com/?q=Jl+Anyelir+1+Jatibening+Bekasi" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--green)', fontWeight: 700, fontSize: '13px' }}>Buka di Google Maps →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
