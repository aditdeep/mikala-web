'use client';
import { useLang } from '../../lib/LangContext';
import { translations } from '../../lib/i18n';
import Link from 'next/link';

const MITRA_DAFTAR = 'https://mikala-web-mitra.vercel.app/auth/register';

const PROGRAMS = [
  {
    icon: '🎌', duration_id: '12 Bulan', duration_en: '12 Months',
    title_id: 'Program Kaigo Jepang — EPA', title_en: 'Japan Kaigo Program — EPA',
    desc_id: 'Program intensif mempersiapkan caregiver profesional siap kerja di Jepang dengan standar EPA & SSW.',
    desc_en: 'Intensive program preparing professional caregivers ready to work in Japan with EPA & SSW standards.',
    highlights_id: ['Bahasa Jepang N4-N3', 'Sertifikasi Kaigo', 'Penempatan Langsung'],
    highlights_en: ['Japanese Language N4-N3', 'Kaigo Certification', 'Direct Placement'],
  },
  {
    icon: '📚', duration_id: '6 Bulan', duration_en: '6 Months',
    title_id: 'Bahasa Jepang Intensif', title_en: 'Intensive Japanese Language',
    desc_id: 'Kelas bahasa Jepang khusus tenaga kesehatan dengan kurikulum komunikatif.',
    desc_en: 'Japanese language class specifically for healthcare workers with communicative curriculum.',
    highlights_id: ['JLPT N4 Target', 'Kelas Kecil 10 Orang', 'Native Teacher'],
    highlights_en: ['JLPT N4 Target', 'Small Class 10 People', 'Native Teacher'],
  },
  {
    icon: '🏅', duration_id: '3 Bulan', duration_en: '3 Months',
    title_id: 'Sertifikasi Kompetensi', title_en: 'Competency Certification',
    desc_id: 'Uji kompetensi dan sertifikasi resmi BNSP untuk caregiver profesional.',
    desc_en: 'Official BNSP competency testing and certification for professional caregivers.',
    highlights_id: ['Sertifikat BNSP', 'Diakui Nasional', 'Modul Standar Jepang'],
    highlights_en: ['BNSP Certificate', 'Nationally Recognized', 'Japan Standard Module'],
  },
];

const TESTIMONIALS = [
  { nama: 'Sari Rahayu, 26', asal_id: 'Bekasi', asal_en: 'Bekasi', text_id: 'Berkat MGA, saya kini bekerja di nursing home di Osaka. Pelatihan bahasa dan budaya sangat membantu adaptasi saya di Jepang.', text_en: 'Thanks to MGA, I now work at a nursing home in Osaka. Language and culture training greatly helped my adaptation in Japan.', foto: '👩' },
  { nama: 'Budi Santoso, 28', asal_id: 'Surabaya', asal_en: 'Surabaya', text_id: 'Program Kaigo MGA sangat terstruktur. Dalam 12 bulan saya sudah bisa bekerja mandiri di fasilitas lansia di Tokyo.', text_en: "MGA's Kaigo program is very structured. Within 12 months I was able to work independently at an elderly facility in Tokyo.", foto: '👨' },
  { nama: 'Dewi Anggraini, 25', asal_id: 'Bandung', asal_en: 'Bandung', text_id: 'Trainer-trainer MGA sangat berpengalaman. Mereka tidak hanya mengajar ilmu tapi juga mental untuk bekerja di luar negeri.', text_en: "MGA's trainers are very experienced. They don't just teach knowledge but also the mindset to work abroad.", foto: '👩' },
];

const STEPS_DATA = [
  { num: '01', title_id: 'Daftar Online',       title_en: 'Apply Online',          desc_id: 'Isi formulir pendaftaran dan lengkapi persyaratan dokumen dasar.', desc_en: 'Fill in the registration form and complete basic document requirements.' },
  { num: '02', title_id: 'Seleksi & Interview',  title_en: 'Selection & Interview', desc_id: 'Ikuti proses seleksi berkas, tes kesehatan, dan wawancara motivasi.', desc_en: 'Undergo document screening, health test, and motivation interview.' },
  { num: '03', title_id: 'Pelatihan Intensif',   title_en: 'Intensive Training',     desc_id: 'Mengikuti program pelatihan bahasa, keperawatan, dan budaya Jepang.', desc_en: 'Join language, nursing, and Japanese culture training program.' },
  { num: '04', title_id: 'Penempatan Kerja',     title_en: 'Job Placement',          desc_id: 'Ditempatkan di fasilitas kesehatan Jepang mitra MGA yang terverifikasi.', desc_en: 'Placed at verified MGA partner healthcare facilities in Japan.' },
];

const STATS = [
  { num: '500+', label_id: 'Alumni Ditempatkan',    label_en: 'Alumni Placed',          icon: '👥' },
  { num: '98%',  label_id: 'Tingkat Kelulusan',     label_en: 'Pass Rate',              icon: '🎓' },
  { num: '50+',  label_id: 'Mitra Fasilitas Jepang',label_en: 'Japan Facility Partners',icon: '🏥' },
  { num: '10+',  label_id: 'Tahun Pengalaman',      label_en: 'Years Experience',       icon: '⭐' },
];

export function StatsBar() {
  const { lang } = useLang();
  return (
    <section style={{ background: 'var(--green)', padding: 'clamp(20px,4vw,28px) 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          {STATS.map(s => (
            <div key={s.num} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800 }}>{s.num}</div>
              <div style={{ fontSize: '13px', opacity: 0.85 }}>{lang === 'id' ? s.label_id : s.label_en}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramsSection() {
  const { lang } = useLang();
  const h = translations.home;
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="tag tag-green" style={{ marginBottom: '12px' }}>{h.prog_badge[lang]}</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{h.prog_title[lang]}</h2>
          <p style={{ color: 'var(--text2)', marginTop: '12px', fontSize: '16px', maxWidth: '560px', margin: '12px auto 0' }}>{h.prog_desc[lang]}</p>
        </div>
        <div className="grid-3">
          {PROGRAMS.map((p, i) => (
            <div key={i} className="card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{p.icon}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{lang === 'id' ? p.title_id : p.title_en}</h3>
                <span className="tag tag-blue" style={{ flexShrink: 0, marginLeft: '8px' }}>{lang === 'id' ? p.duration_id : p.duration_en}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>{lang === 'id' ? p.desc_id : p.desc_en}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(lang === 'id' ? p.highlights_id : p.highlights_en).map(h => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>{h}
                  </div>
                ))}
              </div>
              <Link href="/program" style={{ display: 'block', marginTop: '20px', textAlign: 'center', padding: '10px', borderRadius: '12px', background: 'var(--green3)', color: 'var(--green)', fontWeight: 700, fontSize: '13px' }}>
                {translations.home.prog_more[lang]}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StepsSection() {
  const { lang } = useLang();
  const h = translations.home;
  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="tag tag-blue" style={{ marginBottom: '12px' }}>{h.how_badge[lang]}</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{h.how_title[lang]}</h2>
        </div>
        <div className="grid-4">
          {STEPS_DATA.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--green), var(--green2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontSize: '20px', fontWeight: 800 }}>{s.num}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{lang === 'id' ? s.title_id : s.title_en}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{lang === 'id' ? s.desc_id : s.desc_en}</p>
              {i < 3 && <div className="hide-mobile" style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: 'var(--green2)', zIndex: 1 }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href={MITRA_DAFTAR} className="btn-primary" target="_blank" rel="noreferrer" style={{ fontSize: '16px', padding: '15px 36px' }}>
            {translations.home.start_btn[lang]}
          </a>
        </div>
      </div>
    </section>
  );
}

export function TestimoniSection() {
  const { lang } = useLang();
  const h = translations.home;
  return (
    <section className="section" style={{ background: 'var(--dark)', color: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="tag" style={{ background: 'rgba(26,122,94,0.3)', color: 'var(--green2)', marginBottom: '12px' }}>{h.testi_badge[lang]}</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, fontFamily: "'DM Serif Display', serif" }}>{h.testi_title[lang]}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }} className="mga-testi-scroll">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', minWidth: '280px' }}>
              <div style={{ fontSize: '28px', color: 'var(--green2)', marginBottom: '16px' }}>"</div>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>{lang === 'id' ? t.text_id : t.text_en}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--green3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{t.foto}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.nama}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{lang === 'id' ? `Alumni dari ${t.asal_id}` : `Alumni from ${t.asal_en}`} — Japan</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  const { lang } = useLang();
  const h = translations.home;
  return (
    <section style={{ background: 'linear-gradient(135deg, var(--green) 0%, var(--blue) 100%)', padding: 'clamp(60px,10vw,100px) 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: 'white', marginBottom: '16px', fontFamily: "'DM Serif Display', serif" }}>{h.cta_title[lang]}</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(14px,2vw,18px)', marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px' }}>{h.cta_desc[lang]}</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={MITRA_DAFTAR} className="btn-white" target="_blank" rel="noreferrer" style={{ fontSize: '16px', padding: '15px 36px' }}>🚀 {h.how_badge[lang] === 'Cara Bergabung' ? 'Daftar Sekarang' : 'Apply Now'}</a>
          <Link href="/kontak" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '15px 36px', borderRadius: '50px', fontWeight: 700, fontSize: '16px', border: '2px solid rgba(255,255,255,0.3)' }}>
            {h.cta_wa[lang]}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HeroBadges() {
  const { lang } = useLang();
  const h = translations.home;
  return (
    <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
      {[h.badge1[lang], h.badge2[lang], h.badge3[lang]].map(b => (
        <span key={b} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{b}</span>
      ))}
    </div>
  );
}
