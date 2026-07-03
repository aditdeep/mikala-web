import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Kaigo Jepang — Mikala Global Akademi',
  description: 'Program pelatihan Kaigo (perawat lansia) untuk bekerja di Jepang. EPA, SSW, dan sertifikasi BNSP.',
};

const MITRA_DAFTAR = 'https://mitra.mikalaglobalmedika.com/auth/register';

const PROGRAMS_DETAIL = [
  {
    icon: '🎌', badge: 'Paling Populer',
    title: 'Program Kaigo Jepang — EPA',
    subtitle: 'Economic Partnership Agreement',
    duration: '12 Bulan', biaya: 'Hubungi Kami', kuota: '20 Peserta/Batch',
    desc: 'Program flagship MGA untuk menjadi Kaigo Fukushishi (perawat lansia berlisensi Jepang) melalui jalur EPA. Program intensif mencakup bahasa Jepang, keperawatan, dan budaya Jepang.',
    kurikulum: [
      'Bahasa Jepang JLPT N4 (480 jam)',
      'Keperawatan Dasar & Lanjutan (200 jam)',
      'Budaya & Etiket Kerja Jepang (80 jam)',
      'Praktek Klinik Simulasi (120 jam)',
      'Persiapan Ujian Kaigo Fukushishi',
    ],
    syarat: ['D3/S1 Keperawatan atau Kebidanan', 'Usia 18-35 tahun', 'Sehat jasmani dan rohani', 'Tidak buta warna', 'Lulus seleksi MGA'],
    color: 'var(--green)',
  },
  {
    icon: '⭐', badge: 'Baru 2024',
    title: 'Program Kaigo Jepang — SSW',
    subtitle: 'Specified Skilled Worker',
    duration: '8 Bulan', biaya: 'Hubungi Kami', kuota: '15 Peserta/Batch',
    desc: 'Jalur lebih cepat menuju Jepang melalui SSW (Tokutei Ginou). Cocok untuk yang sudah memiliki pengalaman kerja di bidang kesehatan dan ingin segera berangkat ke Jepang.',
    kurikulum: [
      'Bahasa Jepang JLPT N4 (320 jam)',
      'Ujian SSW Kaigo (Persiapan)',
      'Standar Keperawatan Jepang (160 jam)',
      'Simulasi Wawancara Perusahaan',
      'Orientasi Budaya Jepang',
    ],
    syarat: ['D3/S1 Keperawatan / Pengalaman 2 tahun', 'Usia 18-35 tahun', 'Sehat jasmani dan rohani', 'JLPT N4 atau sedang belajar', 'Lulus seleksi MGA'],
    color: 'var(--blue)',
  },
  {
    icon: '📚', badge: '',
    title: 'Bahasa Jepang Intensif',
    subtitle: 'Untuk Tenaga Kesehatan',
    duration: '6 Bulan', biaya: 'Hubungi Kami', kuota: '10 Peserta/Kelas',
    desc: 'Kelas bahasa Jepang khusus tenaga kesehatan dengan kurikulum yang mencakup kosakata medis, komunikasi dengan pasien, dan penulisan laporan dalam bahasa Jepang.',
    kurikulum: [
      'Hiragana, Katakana, Kanji Dasar',
      'Kosakata Medis & Keperawatan',
      'Komunikasi dengan Pasien',
      'Penulisan Laporan Keperawatan',
      'JLPT N5-N4 Preparation',
    ],
    syarat: ['Terbuka untuk semua latar belakang', 'Usia minimal 18 tahun', 'Motivasi belajar tinggi', 'Tersedia kelas pagi & malam'],
    color: '#7c3aed',
  },
];

const FAQ = [
  { q: 'Apakah ada jaminan penempatan kerja?', a: 'MGA memiliki jaringan 50+ fasilitas kesehatan di Jepang. Kami berupaya optimal untuk penempatan alumni, namun hasil akhir bergantung pada kinerja dan ujian sertifikasi peserta.' },
  { q: 'Berapa biaya program secara keseluruhan?', a: 'Biaya bervariasi tergantung program. Tersedia pilihan cicilan dan beasiswa parsial. Hubungi kami untuk informasi biaya terkini.' },
  { q: 'Apakah bisa daftar tanpa background keperawatan?', a: 'Program Bahasa Jepang Intensif terbuka untuk semua. Namun program Kaigo EPA/SSW membutuhkan latar belakang pendidikan atau pengalaman di bidang kesehatan.' },
  { q: 'Berapa lama proses hingga bisa berangkat ke Jepang?', a: 'Rata-rata 12-18 bulan dari pendaftaran hingga keberangkatan, mencakup pelatihan, sertifikasi, dan proses visa.' },
];

export default function ProgramPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar active="/program"/>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 60%, #0d2a4a 100%)', padding: 'clamp(100px,15vw,140px) 0 clamp(60px,10vw,100px)', textAlign: 'center' }}>
        <div className="container">
          <div className="tag tag-green" style={{ marginBottom: '16px' }}>Program Kami</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', fontFamily: "'DM Serif Display', serif", marginBottom: '20px' }}>
            Program untuk Karir<br/>
            <span style={{ color: 'var(--green2)' }}>Perawat di Jepang</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(14px,2vw,17px)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.8 }}>
            Pilih program yang sesuai dengan latar belakang dan tujuan karir Anda di Jepang
          </p>
          <a href={MITRA_DAFTAR} className="btn-primary" target="_blank" rel="noreferrer" style={{ fontSize: '16px', padding: '15px 36px' }}>
            🚀 Daftar Sekarang
          </a>
        </div>
      </section>

      {/* Program detail */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {PROGRAMS_DETAIL.map((p, i) => (
            <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '0' }}>
                <div style={{ padding: 'clamp(24px,4vw,40px)', background: `linear-gradient(135deg, ${p.color}15, ${p.color}05)`, borderRight: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '36px' }}>{p.icon}</span>
                    {p.badge && <span className="tag" style={{ background: `${p.color}15`, color: p.color }}>{p.badge}</span>}
                  </div>
                  <h2 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{p.title}</h2>
                  <p style={{ color: p.color, fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>{p.subtitle}</p>
                  <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '14px', marginBottom: '20px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[['⏱', p.duration], ['👥', p.kuota], ['💰', p.biaya]].map(([icon, val]) => (
                      <div key={val} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--text2)' }}>
                        {icon} {val}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 'clamp(24px,4vw,40px)' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px', fontSize: '14px' }}>📋 Kurikulum</p>
                    {p.kurikulum.map((k, j) => (
                      <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                        <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>{k}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px', fontSize: '14px' }}>📌 Persyaratan</p>
                    {p.syarat.map((s, j) => (
                      <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text2)' }}>
                        <span style={{ color: 'var(--text3)', flexShrink: 0 }}>•</span>{s}
                      </div>
                    ))}
                  </div>
                  <a href={MITRA_DAFTAR} className="btn-primary" target="_blank" rel="noreferrer" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`, width: '100%', justifyContent: 'center' }}>
                    Daftar Program Ini →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="tag tag-blue" style={{ marginBottom: '12px' }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>Pertanyaan Umum</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ background: 'var(--bg)', borderRadius: '16px', padding: '20px 24px', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px', fontSize: '15px' }}>Q: {f.q}</p>
                <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
