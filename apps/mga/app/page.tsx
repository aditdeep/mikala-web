import Navbar from './(components)/Navbar';
import Footer from './(components)/Footer';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const MITRA_DAFTAR = 'https://mikala-web-mitra.vercel.app/auth/register';

async function getArtikel() {
  try {
    const res = await fetch(`${API}/mga/artikel?per_page=3`, { next: { revalidate: 3600 } });
    return (await res.json()).data || [];
  } catch { return []; }
}

async function getSettings() {
  try {
    const res = await fetch(`${API}/mga/settings`, { next: { revalidate: 3600 } });
    return (await res.json()).data || {};
  } catch { return {}; }
}

const STATS = [
  { num: '500+',  label: 'Alumni Ditempatkan',   icon: '👥' },
  { num: '98%',   label: 'Tingkat Kelulusan',     icon: '🎓' },
  { num: '50+',   label: 'Mitra Fasilitas Jepang',icon: '🏥' },
  { num: '10+',   label: 'Tahun Pengalaman',      icon: '⭐' },
];

const PROGRAMS = [
  {
    icon: '🎌',
    title: 'Program Kaigo Jepang',
    desc: 'Program intensif mempersiapkan caregiver profesional siap kerja di Jepang dengan standar EPA & SSW.',
    duration: '12 Bulan',
    highlights: ['Bahasa Jepang N4-N3', 'Sertifikasi Kaigo', 'Penempatan Langsung'],
  },
  {
    icon: '📚',
    title: 'Bahasa Jepang Intensif',
    desc: 'Kelas bahasa Jepang khusus tenaga kesehatan, dari level N5 hingga N3 dengan metode komunikatif.',
    duration: '6 Bulan',
    highlights: ['JLPT N4 Target', 'Kelas Kecil 10 Orang', 'Native Teacher'],
  },
  {
    icon: '🏅',
    title: 'Sertifikasi Kompetensi',
    desc: 'Uji kompetensi dan sertifikasi resmi BNSP untuk caregiver dan tenaga perawat profesional.',
    duration: '3 Bulan',
    highlights: ['Sertifikat BNSP', 'Diakui Nasional', 'Modul Standar Jepang'],
  },
];

const STEPS = [
  { num: '01', title: 'Daftar Online',      desc: 'Isi formulir pendaftaran dan lengkapi persyaratan dokumen dasar.' },
  { num: '02', title: 'Seleksi & Interview', desc: 'Ikuti proses seleksi berkas, tes kesehatan, dan wawancara motivasi.' },
  { num: '03', title: 'Pelatihan Intensif',  desc: 'Mengikuti program pelatihan bahasa, keperawatan, dan budaya Jepang.' },
  { num: '04', title: 'Penempatan Kerja',    desc: 'Ditempatkan di fasilitas kesehatan Jepang mitra MGA yang terverifikasi.' },
];

const TESTIMONIALS = [
  { nama: 'Sari Rahayu, 26', asal: 'Bekasi', text: 'Berkat MGA, saya kini bekerja di nursing home di Osaka. Pelatihan bahasa dan budaya sangat membantu adaptasi saya di Jepang.', foto: '👩' },
  { nama: 'Budi Santoso, 28', asal: 'Surabaya', text: 'Program Kaigo MGA sangat terstruktur. Dalam 12 bulan saya sudah bisa bekerja mandiri di fasilitas lansia di Tokyo.', foto: '👨' },
  { nama: 'Dewi Anggraini, 25', asal: 'Bandung', text: 'Trainer-trainer MGA sangat berpengalaman. Mereka tidak hanya mengajar ilmu tapi juga mental untuk bekerja di luar negeri.', foto: '👩' },
];

export default async function HomePage() {
  const [artikel, settings] = await Promise.all([getArtikel(), getSettings()]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/"/>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 40%, #0d2a4a 100%)',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}/>
        
        {/* Green glow */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,122,94,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }}/>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '60px' }}>
          <div className="grid-2">
            {/* Left: text */}
            <div className="animate-fadeup">
              <div className="tag tag-green" style={{ marginBottom: '20px' }}>🎌 Program Kaigo Jepang 2026</div>
              <h1 style={{
                fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: 'white',
                lineHeight: 1.15, marginBottom: '20px', fontFamily: "'DM Serif Display', serif",
              }}>
                Wujudkan Karir<br/>
                <span style={{ color: 'var(--green2)' }}>Perawat Profesional</span><br/>
                di Jepang
              </h1>
              <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '480px' }}>
                Mikala Global Akademi membuka jalan karir Anda sebagai tenaga perawat (Kaigo) di Jepang. Pelatihan komprehensif, bersertifikat, dan penempatan langsung.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={MITRA_DAFTAR} className="btn-primary" target="_blank" rel="noreferrer" style={{ fontSize: '16px', padding: '15px 32px' }}>
                  🚀 Daftar Sekarang
                </a>
                <Link href="/program" className="btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontSize: '15px' }}>
                  Lihat Program →
                </Link>
              </div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
                {['✅ Resmi BNSP', '🏛️ Terdaftar Kemendikbud', '🤝 Mitra EPA & SSW'].map(b => (
                  <span key={b} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Right: visual card */}
            <div className="animate-fadein" style={{ animationDelay: '0.3s' }}>
              <div style={{
                background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '28px', padding: '28px',
              }}>
                <img
                  src="https://www.mikalaglobalmedika.com/wp-content/uploads/2023/04/Perawatan-khusus.png"
                  alt="Program Kaigo"
                  style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '18px', marginBottom: '20px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {STATS.slice(0,4).map(s => (
                    <div key={s.num} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green2)' }}>{s.num}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--green)', padding: 'clamp(20px,4vw,28px) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {STATS.map(s => (
              <div key={s.num} style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800 }}>{s.num}</div>
                <div style={{ fontSize: '13px', opacity: 0.85 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAM ────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="tag tag-green" style={{ marginBottom: '12px' }}>Program Unggulan</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>
              Pilih Program yang Tepat
            </h2>
            <p style={{ color: 'var(--text2)', marginTop: '12px', fontSize: '16px', maxWidth: '560px', margin: '12px auto 0' }}>
              Program terstruktur dengan kurikulum standar internasional untuk mempersiapkan Anda bekerja di Jepang
            </p>
          </div>
          <div className="grid-3">
            {PROGRAMS.map((p, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{p.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{p.title}</h3>
                  <span className="tag tag-blue" style={{ flexShrink: 0, marginLeft: '8px' }}>{p.duration}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {p.highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>{h}
                    </div>
                  ))}
                </div>
                <Link href="/program" style={{ display: 'block', marginTop: '20px', textAlign: 'center', padding: '10px', borderRadius: '12px', background: 'var(--green3)', color: 'var(--green)', fontWeight: 700, fontSize: '13px' }}>
                  Pelajari Lebih →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="tag tag-blue" style={{ marginBottom: '12px' }}>Cara Bergabung</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>
              4 Langkah Menuju Jepang
            </h2>
          </div>
          <div className="grid-4">
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--green), var(--green2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontSize: '20px', fontWeight: 800 }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hide-mobile" style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: 'var(--green2)', zIndex: 1 }}>→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href={MITRA_DAFTAR} className="btn-primary" target="_blank" rel="noreferrer" style={{ fontSize: '16px', padding: '15px 36px' }}>
              Mulai Perjalanan Anda →
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="tag" style={{ background: 'rgba(26,122,94,0.3)', color: 'var(--green2)', marginBottom: '12px' }}>Testimoni Alumni</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, fontFamily: "'DM Serif Display', serif" }}>
              Cerita Sukses Alumni MGA
            </h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px' }}>
                <div style={{ fontSize: '28px', color: 'var(--green2)', marginBottom: '16px' }}>"</div>
                <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--green3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{t.foto}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.nama}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Alumni dari {t.asal} — Jepang</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTIKEL ────────────────────────────────────────────────────────── */}
      {artikel.length > 0 && (
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div className="tag tag-green" style={{ marginBottom: '8px' }}>Blog & Artikel</div>
                <h2 style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>Informasi Terbaru</h2>
              </div>
              <Link href="/artikel" style={{ color: 'var(--green)', fontWeight: 700, fontSize: '14px' }}>Lihat Semua →</Link>
            </div>
            <div className="grid-3">
              {artikel.slice(0,3).map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} className="card" style={{ display: 'block' }}>
                  {a.gambar && <img src={a.gambar} alt={a.judul} style={{ width: '100%', height: '200px', objectFit: 'cover' }}/>}
                  <div style={{ padding: '20px' }}>
                    <span className="tag tag-green" style={{ marginBottom: '10px', display: 'inline-block' }}>{a.kategori || 'Informasi'}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.5 }}>{a.judul}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{a.ringkasan || a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BOTTOM ─────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--green) 0%, var(--blue) 100%)', padding: 'clamp(60px,10vw,100px) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: 'white', marginBottom: '16px', fontFamily: "'DM Serif Display', serif" }}>
            Siap Memulai Perjalanan ke Jepang?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(14px,2vw,18px)', marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px' }}>
            Bergabunglah dengan ratusan alumni yang kini berkarir sukses di Jepang. Daftar sekarang dan mulai perjalanan Anda!
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={MITRA_DAFTAR} className="btn-white" target="_blank" rel="noreferrer" style={{ fontSize: '16px', padding: '15px 36px' }}>
              🚀 Daftar Sekarang
            </a>
            <Link href="/kontak" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '15px 36px', borderRadius: '50px', fontWeight: 700, fontSize: '16px', border: '2px solid rgba(255,255,255,0.3)' }}>
              💬 Konsultasi Gratis
            </Link>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
