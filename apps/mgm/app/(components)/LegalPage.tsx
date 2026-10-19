import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

const GREEN = '#0e92b3';
const PINK = '#9c488b';

// Kontak resmi untuk urusan data pribadi & penghapusan akun (dipakai halaman legal yg diminta
// Google Play). Hotline WA official sedang dialihkan sementara (lihat PengumumanPopup) --
// kembalikan ke 6282114488878 / 0821-1448-8878 saat popup pengumuman dimatikan.
export const LEGAL_WA = '6281513382031';
export const LEGAL_WA_LABEL = '0815-1338-2031';
export const LEGAL_EMAIL = 'apps@mikalaglobalmedika.com';
export const LEGAL_ALAMAT = 'Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi, Jawa Barat';

export type Bagian = { judul: string; isi: React.ReactNode };

/** Halaman dokumen legal (Kebijakan Privasi, Syarat & Ketentuan, Hapus Akun) bergaya website MGM. */
export default function LegalPage({ judul, ringkas, diperbarui, bagian, children }: {
  judul: string; ringkas: string; diperbarui: string; bagian?: Bagian[]; children?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#eef8fa' }}>
      <Navbar />
      <div style={{ background: `linear-gradient(160deg, ${PINK} 0%, ${GREEN} 100%)`, padding: 'clamp(36px,7vw,60px) 20px clamp(40px,7vw,64px)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(24px,4.5vw,38px)', fontWeight: 800, color: 'white', margin: '0 0 10px' }}>{judul}</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>{ringkas}</p>
      </div>

      <main style={{ maxWidth: '820px', margin: '0 auto', padding: 'clamp(24px,5vw,48px) 16px 64px' }}>
        <article style={{ background: 'white', borderRadius: '24px', padding: 'clamp(22px,4.5vw,44px)', boxShadow: '0 10px 30px rgba(14,146,179,0.08)', color: '#1f2937', fontSize: '15px', lineHeight: 1.75 }}>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 24px' }}>Terakhir diperbarui: {diperbarui}</p>
          {children}
          {bagian?.map((b, i) => (
            <section key={b.judul} style={{ marginTop: i === 0 && !children ? 0 : '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2e25', margin: '0 0 10px' }}>{i + 1}. {b.judul}</h2>
              <div className="legal-isi">{b.isi}</div>
            </section>
          ))}
        </article>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', justifyContent: 'center', marginTop: '24px', fontSize: '14px' }}>
          <Link href="/kebijakan-privasi" style={{ color: GREEN, fontWeight: 600 }}>Kebijakan Privasi</Link>
          <Link href="/syarat-ketentuan" style={{ color: GREEN, fontWeight: 600 }}>Syarat &amp; Ketentuan</Link>
          <Link href="/hapus-akun" style={{ color: GREEN, fontWeight: 600 }}>Hapus Akun</Link>
        </nav>
      </main>

      <style>{`
        .legal-isi p { margin: 0 0 10px; }
        .legal-isi ul, .legal-isi ol { margin: 0 0 10px; padding-left: 22px; }
        .legal-isi li { margin-bottom: 6px; }
        .legal-isi a { color: ${GREEN}; font-weight: 600; }
      `}</style>
      <Footer />
    </div>
  );
}
