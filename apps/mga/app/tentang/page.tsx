import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami — Mikala Global Akademi',
  description: 'LPK Mikala Global Akademi berpengalaman lebih dari 10 tahun mempersiapkan tenaga perawat Indonesia untuk bekerja di Jepang.',
};

const MITRA_DAFTAR = 'https://mitra.mikalaglobalmedika.com/auth/register';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';

// Isi bawaan -- dipakai selama kolom terkait di CMS Web MGA > Tentang Kami masih kosong.
const DEFAULT: Record<string, string> = {
  tentang_hero_judul1: 'Membangun Tenaga Perawat',
  tentang_hero_judul2: 'Berstandar Internasional',
  tentang_hero_sub: 'Sejak 2014, Mikala Global Akademi telah menjadi jembatan antara tenaga perawat Indonesia dengan peluang karir di Jepang',
  tentang_gambar: 'https://www.mikalaglobalmedika.com/wp-content/uploads/2024/09/home-imag-MGM.jpg',
  tentang_judul: 'LPK Terpercaya untuk Tenaga Kesehatan Indonesia',
  tentang_isi: 'Mikala Global Akademi (MGA) adalah Lembaga Pelatihan Kerja resmi yang fokus mempersiapkan tenaga kesehatan Indonesia untuk berkarir di Jepang melalui jalur EPA (Economic Partnership Agreement) dan SSW (Specified Skilled Worker).\n\nDengan pengalaman lebih dari 10 tahun, kami telah membantu lebih dari 500 alumni memulai karir impian mereka di fasilitas kesehatan Jepang, dari nursing home di Tokyo hingga klinik di Osaka.',
  tentang_statistik: '2014 | Tahun Berdiri\n500+ | Alumni di Jepang\n50+ | Mitra Fasilitas\n98% | Tingkat Kelulusan',
  tentang_nilai: '🎯 | Profesional | Standar kurikulum internasional sesuai regulasi Jepang\n🤝 | Integritas | Transparan dalam proses seleksi dan penempatan kerja\n💡 | Inovatif | Metode pembelajaran modern dan berbasis teknologi\n❤️ | Peduli | Mendampingi peserta dari pelatihan hingga adaptasi di Jepang',
  tentang_tim: 'dr. Rina Susanti, M.Kes | Direktur Utama | 👩‍⚕️\nBambang Prasetyo, S.Kep | Kepala Program | 👨‍🎓\nYuki Tanaka | Konsultan Jepang | 👩‍💼\nSiti Nurhaliza, M.Pd | Manajer Pelatihan | 👩‍🏫',
};

async function getKonten() {
  let d: Record<string, string> = {};
  try {
    const res = await fetch(`${API}/mga/settings`, { next: { revalidate: 60 } });
    d = (await res.json())?.data || {};
  } catch {}
  const v = (k: string) => (String(d[k] ?? '').trim() || DEFAULT[k]);
  // 1 baris = 1 item, kolom dipisah "|"
  const baris = (k: string) => v(k).split('\n').map(l => l.split('|').map(x => x.trim())).filter(c => c[0]);
  return {
    v,
    paragraf: v('tentang_isi').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean),
    statistik: baris('tentang_statistik'),
    nilai: baris('tentang_nilai'),
    tim: baris('tentang_tim'),
  };
}

export default async function TentangPage() {
  const { v, paragraf, statistik, nilai, tim } = await getKonten();
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/tentang"/>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 60%, #018BA2 100%)', padding: 'clamp(100px,15vw,140px) 0 clamp(60px,10vw,100px)', textAlign: 'center' }}>
        <div className="container">
          <div className="tag tag-green" style={{ marginBottom: '16px' }}>Tentang Kami</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif", marginBottom: '20px' }}>
            {v('tentang_hero_judul1')}<br/>
            <span style={{ color: 'var(--green2)' }}>{v('tentang_hero_judul2')}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(14px,2vw,17px)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            {v('tentang_hero_sub')}
          </p>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '60px' }}>
            <div>
              <img src={v('tentang_gambar')} alt="Tim MGA" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '24px' }}/>
            </div>
            <div>
              <div className="tag tag-green" style={{ marginBottom: '16px' }}>Siapa Kami</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", marginBottom: '20px' }}>
                {v('tentang_judul')}
              </h2>
              {paragraf.map((p, i) => (
                <p key={i} style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: i === paragraf.length - 1 ? '28px' : '16px', fontSize: '15px' }}>{p}</p>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                {statistik.map(([n, l]) => (
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
            {nilai.map(([icon, title, desc], i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '40px', marginBottom: '14px' }}>{icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{desc}</p>
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
            {tim.map(([nama, jabatan, foto], i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--green3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', overflow: 'hidden' }}>
                  {/^https?:\/\//.test(foto || '') ? <img src={foto} alt={nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : (foto || '👤')}
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{nama}</h3>
                <p style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>{jabatan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
