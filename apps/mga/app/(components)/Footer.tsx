import Link from 'next/link';

const LOGO = 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo-mga-web_digdlz.png';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.8)', padding: 'clamp(48px,8vw,80px) 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Brand */}
          <div>
            <img src={LOGO} alt="MGA" style={{ height: '36px', marginBottom: '16px', filter: 'brightness(0) invert(1)' }}/>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Lembaga Pelatihan Kerja resmi mempersiapkan tenaga perawat profesional untuk berkarir di Jepang.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['instagram', 'facebook', 'youtube', 'tiktok'].map(s => (
                <a key={s} href={`https://${s}.com/mikalaglobal`} target="_blank" rel="noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transition: 'background 0.2s' }}>
                  {s === 'instagram' ? '📸' : s === 'facebook' ? '👍' : s === 'youtube' ? '▶️' : '🎵'}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '14px' }}>Navigasi</p>
            {[['Beranda', '/'], ['Tentang Kami', '/tentang'], ['Program', '/program'], ['Galeri', '/galeri'], ['Artikel', '/artikel'], ['Kontak', '/kontak']].map(([l, h]) => (
              <Link key={h} href={h} style={{ display: 'block', padding: '5px 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}>{l}</Link>
            ))}
          </div>

          {/* Program */}
          <div>
            <p style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '14px' }}>Program</p>
            {['Program Kaigo Jepang', 'Pelatihan Bahasa Jepang', 'Sertifikasi Kompetensi', 'Penempatan Kerja', 'Alumni Network'].map(p => (
              <Link key={p} href="/program" style={{ display: 'block', padding: '5px 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{p}</Link>
            ))}
          </div>

          {/* Kontak */}
          <div>
            <p style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '14px' }}>Kontak</p>
            {[
              ['📍', 'Jl. Anyelir No. 1-2, Jatibening, Bekasi'],
              ['📞', '+62 821-1448-8878'],
              ['✉️', 'info@mikalaglobalakademi.co.id'],
              ['🕐', 'Senin–Sabtu: 08.00–17.00 WIB'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>© 2026 Mikala Global Akademi. Seluruh hak dilindungi.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Kebijakan Privasi', 'Syarat & Ketentuan'].map(t => (
              <a key={t} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
