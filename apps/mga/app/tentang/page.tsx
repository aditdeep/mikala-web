import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami — Mikala Global Akademi',
  description: 'LPK Mikala Global Akademi berpengalaman lebih dari 10 tahun mempersiapkan tenaga perawat Indonesia untuk bekerja di Jepang.',
};

const MITRA_DAFTAR = 'https://mikala-web-mitra.vercel.app/auth/register';

const VALUES = [
  { icon: '🎯', title: 'Profesional', desc: 'Standar kurikulum internasional sesuai regulasi Jepang' },
  { icon: '🤝', title: 'Integritas',  desc: 'Transparan dalam proses seleksi dan penempatan kerja' },
  { icon: '💡', title: 'Inovatif',   desc: 'Metode pembelajaran modern dan berbasis teknologi' },
  { icon: '❤️', title: 'Peduli',     desc: 'Mendampingi peserta dari pelatihan hingga adaptasi di Jepang' },
];

const TEAM = [
  { nama: 'dr. Rina Susanti, M.Kes', jabatan: 'Direktur Utama',      foto: '👩‍⚕️' },
  { nama: 'Bambang Prasetyo, S.Kep', jabatan: 'Kepala Program',      foto: '👨‍🎓' },
  { nama: 'Yuki Tanaka',              jabatan: 'Konsultan Jepang',    foto: '👩‍💼' },
  { nama: 'Siti Nurhaliza, M.Pd',    jabatan: 'Manajer Pelatihan',   foto: '👩‍🏫' },
];

export default function TentangPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/tentang"/>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 60%, #0d2a4a 100%)', padding: 'clamp(100px,15vw,140px) 0 clamp(60px,10vw,100px)', textAlign: 'center' }}>
        <div className="container">
          <div className="tag tag-green" style={{ marginBottom: '16px' }}>Tentang Kami</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif", marginBottom: '20px' }}>
            Membangun Tenaga Perawat<br/>
            <span style={{ color: 'var(--green2)' }}>Berstandar Internasional</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(14px,2vw,17px)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            Sejak 2014, Mikala Global Akademi telah menjadi jembatan antara tenaga perawat Indonesia dengan peluang karir di Jepang
          </p>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '60px' }}>
            <div>
              <img src="https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg" alt="Tim MGA" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '24px' }}/>
            </div>
            <div>
              <div className="tag tag-green" style={{ marginBottom: '16px' }}>Siapa Kami</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", marginBottom: '20px' }}>
                LPK Terpercaya untuk<br/>Tenaga Kesehatan Indonesia
              </h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' }}>
                Mikala Global Akademi (MGA) adalah Lembaga Pelatihan Kerja resmi yang fokus mempersiapkan tenaga kesehatan Indonesia untuk berkarir di Jepang melalui jalur EPA (Economic Partnership Agreement) dan SSW (Specified Skilled Worker).
              </p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px', fontSize: '15px' }}>
                Dengan pengalaman lebih dari 10 tahun, kami telah membantu lebih dari 500 alumni memulai karir impian mereka di fasilitas kesehatan Jepang, dari nursing home di Tokyo hingga klinik di Osaka.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                {[['2014', 'Tahun Berdiri'], ['500+', 'Alumni di Jepang'], ['50+', 'Mitra Fasilitas'], ['98%', 'Tingkat Kelulusan']].map(([n, l]) => (
                  <div key={l} style={{ padding: '16px', background: 'var(--green3)', borderRadius: '14px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--green)' }}>{n}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{l}</div>
                  </div>
                ))}
              </div>
              <a href={MITRA_DAFTAR} className="btn-primary" target="_blank" rel="noreferrer">🚀 Bergabung Sekarang</a>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="tag tag-blue" style={{ marginBottom: '12px' }}>Nilai Kami</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>Landasan yang Kami Pegang</h2>
          </div>
          <div className="grid-4">
            {VALUES.map((v, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '40px', marginBottom: '14px' }}>{v.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{v.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="tag tag-green" style={{ marginBottom: '12px' }}>Tim Kami</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>Dipimpin oleh Para Ahli</h2>
          </div>
          <div className="grid-4">
            {TEAM.map((t, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--green3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>{t.foto}</div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{t.nama}</h3>
                <p style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>{t.jabatan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
