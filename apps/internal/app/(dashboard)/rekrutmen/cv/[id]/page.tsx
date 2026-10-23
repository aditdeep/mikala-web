'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';

const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";

// Warna template CV
const UNGU = '#8f4d88';
const TEAL = '#387a8b';
const NAVY = '#1f3550';
const HAL = 1122.5; // tinggi 1 halaman A4 dlm px (794px lebar)

export default function CVPage() {
  const params = useParams();
  const router = useRouter();
  const [mitra, setMitra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState<string[]>([]);
  const [cvMateri, setCvMateri] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get(`/internal/rekrutmen/mitra/${params.id}`)
      .then((res: any) => {
        const data = res.data?.data;
        // Guard: hitung field yang missing
        const missingFields: string[] = [];
        if (!data.foto_url)            missingFields.push('Foto Profil');
        if (!data.cv_file)             missingFields.push('CV / Dokumen');
        if (!data.nik)                 missingFields.push('NIK');
        if (!data.tanggal_lahir)       missingFields.push('Tanggal Lahir');
        if (!data.pendidikan_terakhir) missingFields.push('Pendidikan');
        if (!data.pengalaman)          missingFields.push('Pengalaman');
        setMitra(data);
        const m: string[] = [];
        if (!data?.nama_lengkap && !data?.user?.name) m.push('Nama Lengkap');
        if (!data?.tanggal_lahir) m.push('Tanggal Lahir');
        if (!data?.pendidikan_terakhir) m.push('Pendidikan');
        setMissing(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Bidang Keahlian di CV diisi dari materi training yang SUDAH DICEKLIS oleh divisi
    // Training Center (bukan tag statis lagi) -- lihat TrainingController::mitraProgress()
    // yang sudah menyiapkan field cv_materi persis untuk kebutuhan ini.
    apiClient.get(`/internal/training/mitra/${params.id}/progress`)
      .then((res: any) => setCvMateri(res.data?.cv_materi || []))
      .catch(() => setCvMateri([]));
  }, [params.id]);

  // Atur halaman cetak (A4 = 1122.5px): baris yg jatuh di batas halaman didorong ke halaman
  // berikutnya + jarak atas, lalu tinggi kartu dibulatkan ke kelipatan 1 halaman spy latar
  // gradasi & kolom ungu penuh sampai bawah kertas terakhir.
  useEffect(() => {
    const atur = () => {
      const kartu = document.getElementById('cv-content');
      if (!kartu) return;
      const blok = Array.from(kartu.querySelectorAll<HTMLElement>('[data-blok]'));
      kartu.style.minHeight = '';
      blok.forEach(b => { b.style.paddingTop = ''; });
      const atas = kartu.getBoundingClientRect().top;
      for (const b of blok) {
        const r = b.getBoundingClientRect();
        const y0 = r.top - atas, y1 = r.bottom - atas;
        const batas = Math.floor(y1 / HAL) * HAL; // batas halaman tepat di atas bawah blok
        if (batas > 0 && y0 < batas + 40) b.style.paddingTop = `${batas + 40 - y0}px`; // padding, bukan margin: margin di batas halaman dibuang browser saat cetak
      }
      kartu.style.minHeight = `${Math.max(1, Math.ceil((kartu.scrollHeight - 2) / HAL)) * HAL - 1}px`;
    };
    const t = setTimeout(atur, 300);
    document.fonts?.ready.then(atur); // font Hind mengubah tinggi baris -> hitung ulang
    window.addEventListener('beforeprint', atur);
    return () => { clearTimeout(t); window.removeEventListener('beforeprint', atur); };
  }, [mitra, cvMateri]);

  const getExtra = (p: string, field: string) => {
    const m = p?.match(new RegExp(`${field}:\\s*([^,\\n]+)`, 'i'));
    return m ? m[1].trim() : '';
  };
  const getPelatihan = (p: string) => {
    const m = p?.match(/PELATIHAN:[\s\S]*?([\s\S]*?)(?=PENGALAMAN KERJA:|DATA TAMBAHAN:|$)/i);
    return m ? m[1].trim() : '';
  };
  const getPengalamanKerja = (p: string) => {
    const m = p?.match(/PENGALAMAN KERJA:[\s\S]*?([\s\S]*?)(?=DATA TAMBAHAN:|$)/i);
    return m ? m[1].trim() : '';
  };

  // Guard: CV hanya bisa dilihat setelah verified
  if (!loading && mitra && mitra.status_rekrutmen !== 'verified') {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'20px' }}>
        <div style={{ textAlign:'center', maxWidth:'400px' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(245,158,11,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <span style={{ fontSize:'36px' }}>🔒</span>
          </div>
          <h2 style={{ color:'var(--text)', fontSize:'20px', fontWeight:700, marginBottom:'10px' }}>CV Belum Tersedia</h2>
          <p style={{ color:'var(--text3)', fontSize:'14px', lineHeight:'1.6', marginBottom:'20px' }}>
            CV mitra <strong style={{ color:'var(--text)' }}>{mitra.nama_lengkap || mitra.user?.name}</strong> belum dapat dilihat karena status rekrutmen masih <strong style={{ color:'#f59e0b' }}>{mitra.status_rekrutmen || 'Pending'}</strong>.
          </p>
          <p style={{ color:'var(--text3)', fontSize:'13px', marginBottom:'24px' }}>CV hanya tersedia setelah mitra diterima (status: Verified).</p>
          <button onClick={() => router.back()} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, cursor:'pointer' }}>
            ← Kembali ke Rekrutmen
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:`3px solid ${UNGU}`, borderTopColor:'transparent', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
        <p style={{ color:'#666' }}>Memuat CV...</p>
      </div>
    </div>
  );

  if (!mitra) return (
    <div style={{ textAlign:'center', padding:'40px' }}>
      <p style={{ color:'#666' }}>Data tidak ditemukan</p>
      <button onClick={() => router.back()} style={{ marginTop:'16px', padding:'8px 16px', background:'#f0f0f0', border:'none', borderRadius:'10px', cursor:'pointer' }}>Kembali</button>
    </div>
  );

  const nama = mitra?.nama_lengkap || mitra?.user?.name || '-';
  const namaDepan = nama.split(' ')[0];
  const namaBelakang = nama.split(' ').slice(1).join(' ');
  // FIX: Usia gak pernah kesimpen sbg kolom DB tersendiri -- di halaman Detail Mitra (rekrutmen/
  // page.tsx) juga cuma dihitung on-the-fly dari tanggal_lahir (lihat calcUsia() di sana), BUKAN
  // dibaca dari field lain. CV lama nyoba getExtra(p,'Usia') dari blob teks yg mostly kosong buat
  // mitra baru, makanya keliatan "- tahun" padahal Detail Mitra bisa nampilin usia dgn benar.
  const calcUsia = (tanggalLahir?: string): number | null => {
    if (!tanggalLahir) return null;
    const lahir = new Date(tanggalLahir);
    if (isNaN(lahir.getTime())) return null;
    const now = new Date();
    let u = now.getFullYear() - lahir.getFullYear();
    const belumUlangTahun = now.getMonth() < lahir.getMonth() || (now.getMonth() === lahir.getMonth() && now.getDate() < lahir.getDate());
    if (belumUlangTahun) u--;
    return u >= 0 ? u : null;
  };
  const p = mitra?.pengalaman || '';
  // FIX: mitra baru (dibuat via form Rekrutmen modern) ngisi kolom DB asli (mitra.agama,
  // mitra.berat_badan, dst -- lihat task migrasi blob->kolom sebelumnya), BUKAN blob teks lama
  // di mitra.pengalaman. Kalau CV cuma baca getExtra(p,...) dari blob itu, data yg sebenernya
  // ADA di DB keliatan kosong ("-") di CV. Sekarang kolom DB asli diprioritaskan, blob-parse
  // cuma fallback buat mitra lama yg belum kesimpen di kolom asli.
  const tipeJob = mitra?.tipe_pekerjaan || getExtra(p, 'Tipe Pekerjaan') || 'Perawat Homecare';
  const usiaHitung = calcUsia(mitra?.tanggal_lahir);
  const usia = usiaHitung != null ? String(usiaHitung) : (getExtra(p, 'Usia') || '-');
  const tempatLahir = mitra?.tempat_lahir || getExtra(p, 'Tempat Lahir') || '-';
  const suku = mitra?.suku || getExtra(p, 'Suku') || '-';
  const tinggi = mitra?.tinggi_badan || getExtra(p, 'TB') || '-';
  const berat = mitra?.berat_badan || getExtra(p, 'BB') || '-';
  const agama = mitra?.agama || getExtra(p, 'Agama') || '-';
  const statusNikah = mitra?.status_nikah || getExtra(p, 'Status Nikah') || '-';
  const vaksin = mitra?.vaksin || getExtra(p, 'Vaksin') || '-';
  const takutHewan = mitra?.takut_hewan || getExtra(p, 'Takut Hewan') || '-';
  // FIX: field ini diubah dari skala angka 1-5 jadi dropdown Bisa/Tidak Bisa (lihat rekrutmen/
  // page.tsx) -- data lama masih bisa nyimpen angka "1".."5", jadi dinormalisasi di sini juga
  // biar CV mitra lama gak nampilin angka mentah kayak "3/5".
  const memasakRaw = mitra?.bisa_memasak || getExtra(p, 'Memasak').replace(/\/5$/, '').trim() || '';
  const memasak = (() => {
    if (memasakRaw === 'Bisa' || memasakRaw === 'Tidak Bisa') return memasakRaw;
    const n = parseInt(memasakRaw, 10);
    if (!isNaN(n)) return n <= 1 ? 'Tidak Bisa' : 'Bisa';
    return '-';
  })();
  // Kemampuan (list bebas, diisi mitra sendiri saat daftar) -- ditampilin di Kemampuan Khusus
  const kemampuanList: string[] = (() => {
    if (Array.isArray(mitra?.kemampuan)) return mitra.kemampuan.filter(Boolean);
    if (typeof mitra?.kemampuan === 'string' && mitra.kemampuan.trim()) {
      try {
        const parsed = JSON.parse(mitra.kemampuan);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
      return mitra.kemampuan.split(/\r?\n|,/).map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  })();
  const pelatihan = getPelatihan(p);
  const pengalamanKerja = getPengalamanKerja(p);
  const tglLahir = mitra?.tanggal_lahir
    ? new Date(mitra.tanggal_lahir).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    : '-';
  const foto = mitra?.foto_url || mitra?.ktp_file || null;


  // Layout mengikuti template desain "Opsi 4" (Okt 2026): foto besar kiri atas, header ungu
  // berpola + logo, pita teal NIM, kolom kiri ungu (data diri, pendidikan, pelatihan) dan kolom
  // kanan (Kemampuan, Pengalaman Kerja). Ukuran = desain asli (A4 595pt) x 1.333 -> 794px.
  // Font: Futura -> Jost, Object Sans -> Plus Jakarta Sans, Cerebri Sans -> Figtree (Google Fonts).
  const tglAngka = (() => {
    const m = String(mitra?.tanggal_lahir || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
  })();
  const asal = mitra?.kota || (tempatLahir !== '-' ? tempatLahir : '-');
  const hewan = /tidak takut/i.test(takutHewan) ? 'Tidak Ada' : takutHewan;
  const bersih = (l: string) => l.replace(/^[-•◆✓]\s*/, '').trim();
  const linesPelatihan = pelatihan && pelatihan !== 'Tidak ada' ? pelatihan.split('\n').map(bersih).filter(Boolean) : [];
  if (linesPelatihan.length && mitra?.tahun_pelatihan && !linesPelatihan[0].includes(String(mitra.tahun_pelatihan)))
    linesPelatihan[0] = `${linesPelatihan[0]} (${mitra.tahun_pelatihan})`;
  const linesPengalaman = pengalamanKerja && pengalamanKerja !== 'Tidak ada' ? pengalamanKerja.split('\n').map(bersih).filter(Boolean) : [];
  const materiDidapat: string[] = cvMateri.map((m: any) => m.nama).filter(Boolean);

  // Nama: maks 2 baris di area ~270px; ukuran font diperkecil sampai muat
  const namaBaris = (() => {
    const kata = nama.split(/\s+/).filter(Boolean);
    for (let fs = 64; fs >= 26; fs -= 2) {
      const maxCh = Math.floor(270 / (fs * 0.46));
      const baris: string[] = [];
      for (const k of kata) {
        const akhir = baris[baris.length - 1];
        if (akhir && (akhir + ' ' + k).length <= maxCh) baris[baris.length - 1] = akhir + ' ' + k; else baris.push(k);
      }
      if (baris.length <= 2 && baris.every(b => b.length <= maxCh)) return { fs, baris };
    }
    return { fs: 26, baris: [nama] };
  })();

  // "Bagian tebal, sisanya biasa" (spt contoh: "Merawat pasien stroke, selama 6 tahun")
  const TebalAwal = ({ teks }: { teks: string }) => {
    const i = teks.indexOf(',');
    return i > 0 ? <><b style={{ fontWeight:700 }}>{teks.slice(0, i + 1)}</b>{teks.slice(i + 1)}</> : <>{teks}</>;
  };
  const Bio = ({ label, value }: { label: string; value: string }) => (
    <div data-blok style={{ display:'flex', fontSize:'14px', lineHeight:'17px' }}>
      <span style={{ width:'87px', flexShrink:0 }}>{label}</span>
      <span style={{ fontWeight:600 }}>: {value}</span>
    </div>
  );
  const Garis = () => <div style={{ width:'200px', height:'2px', background:NAVY, margin:'6px 0 4px' }} />;
  const JudulKiri = ({ teks }: { teks: string }) => (
    <h2 data-blok style={{ fontSize:'19px', fontWeight:700, margin:'0 0 2px', lineHeight:1.1 }}>{teks}</h2>
  );
  const JudulKanan = ({ teks }: { teks: string }) => (
    <div data-blok style={{ position:'relative', height:'51px', marginBottom:'12px' }}>
      <h2 style={{ position:'absolute', left:0, bottom:'12px', margin:0, fontFamily:'"Plus Jakarta Sans", sans-serif', fontSize:'20px', fontWeight:800, color:'#000' }}>{teks}</h2>
      <div style={{ position:'absolute', left:0, bottom:0, width:'226px', height:'3px', background:UNGU }} />
      <div style={{ position:'absolute', left:'226px', top:0, right:0, height:'51px', background:UNGU, overflow:'hidden' }}>
        <Pola t={12.75} style={{ position:'absolute', right:0, top:0, width:'51px', height:'51px' }} />
      </div>
    </div>
  );
  const Cek = ({ children }: { children: React.ReactNode }) => (
    <li data-blok style={{ display:'flex', gap:'8px', fontFamily:'"Figtree", sans-serif', fontSize:'14px', lineHeight:'18px', marginBottom:'4.5px', color:'#111' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:'2px' }} fill="none" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v8H4V4h11" /><path d="M8 11l4 4 9-10" />
      </svg>
      <span>{children}</span>
    </li>
  );

  return (
    <div className="cv-page-wrapper" style={{ background:'#eef0f3', minHeight:'100vh', padding:'20px' }}>
      {/* Control Bar */}
      <div className="no-print" style={{ maxWidth:'794px', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <button onClick={() => router.back()} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 16px', background:'white', border:'1px solid #ddd', borderRadius:'12px', color:'#555', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
          <ArrowLeft size={16} />Kembali
        </button>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {missing.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'12px', color:'#d97706', fontSize:'12px' }}>
              <AlertCircle size={14} />Data kurang: {missing.join(', ')}
            </div>
          )}
          <button onClick={() => window.print()} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 18px', background:`linear-gradient(135deg, ${UNGU}, ${TEAL})`, border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
            <Download size={15} />Download PDF
          </button>
        </div>
      </div>

      {/* CV A4 -- tinggi minimal 1 halaman, boleh memanjang ke halaman 2 kalau materi training
          banyak (lihat useEffect pengatur halaman). Latar & kolom kiri digambar sbg lapisan
          absolut yg gradasinya diulang per halaman. */}
      <div id="cv-content" style={{
        width:'794px', minHeight:'1123px', margin:'0 auto', position:'relative', overflow:'hidden',
        backgroundImage:'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #dfeaee 64%, #9cc5d1 84%, #4c93a9 100%)',
        backgroundSize:`100% ${HAL}px`, backgroundRepeat:'repeat-y', backgroundColor:'#ffffff',
        fontFamily:'"Jost", "Futura", "Segoe UI", sans-serif', boxShadow:'0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* kolom kiri */}
        <div style={{ position:'absolute', left:0, top:'416px', bottom:0, width:'314px',
          backgroundImage:'linear-gradient(180deg, #8e4b89 0%, #7f5791 45%, #636e9e 75%, #4f8ba7 100%)',
          backgroundSize:`100% ${HAL}px`, backgroundPosition:'0 -416px', backgroundRepeat:'repeat-y' }} />
        {/* foto */}
        <div style={{ position:'absolute', left:0, top:0, width:'314px', height:'352px', background:'#f4f4f4', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {foto ? <img src={foto} alt={nama} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
            : <span style={{ fontSize:'110px', fontWeight:600, color:UNGU }}>{nama[0]?.toUpperCase()}</span>}
        </div>
        {/* header ungu + pola + logo */}
        <div style={{ position:'absolute', left:'314px', top:0, width:'480px', height:'188px', background:UNGU, overflow:'hidden' }}>
          <Pola t={47} style={{ position:'absolute', right:0, top:0, width:'188px', height:'188px' }} />
          <div style={{ position:'absolute', right:0, top:'15px', width:'157px', height:'47px', borderRadius:'24px 0 0 24px', background:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', paddingLeft:'10px' }}>
            <img src={LOGO} alt="Mikala Global Medika" style={{ height:'32px', objectFit:'contain' }} />
          </div>
          <h1 style={{ position:'absolute', left:'35px', top:`${namaBaris.baris.length === 1 ? 60 : 18}px`, width:'260px', margin:0, color:'white', fontSize:`${namaBaris.fs}px`, fontWeight:600, lineHeight:0.95, letterSpacing:'-0.5px' }}>
            {namaBaris.baris.map((b, i) => <div key={i}>{b}</div>)}
          </h1>
          {/* ikon clipboard */}
          <svg style={{ position:'absolute', left:'24px', top:'138px' }} width="36" height="42" viewBox="0 0 36 42">
            <g transform="rotate(-8 16 22)">
              <rect x="3" y="5" width="26" height="34" rx="2" fill="#b07a5a" />
              <rect x="6" y="9" width="20" height="27" fill="#fff" />
              <rect x="11" y="3" width="10" height="5" rx="2" fill="#5f9aa8" />
              <rect x="8" y="13" width="7" height="7" fill="#6aa9b5" />
              <path d="M10 16.5h3M11.5 15v3" stroke="#fff" strokeWidth="1.3" />
              <path d="M17 15h7M9 24h14M9 28h12M9 32h14" stroke="#9fb6c6" strokeWidth="1.2" />
            </g>
            <path d="M21 27l9-11" stroke="#8b8fc7" strokeWidth="4" strokeLinecap="round" />
            <path d="M30 16l4-5" stroke="#999" strokeWidth="1" />
          </svg>
          <p style={{ position:'absolute', left:'69px', top:'138px', margin:0, color:'white', fontSize:'23px', fontWeight:400 }}>{tipeJob}</p>
          <div style={{ position:'absolute', left:'35px', top:'176px', width:'408px', height:'2px', background:'white' }} />
        </div>
        {/* pita teal NIM + lipatan */}
        <div style={{ position:'absolute', left:0, top:'352px', width:'338px', height:'64px', background:TEAL, color:'white', padding:'9px 0 0 39px', boxSizing:'border-box', fontSize:'18px', lineHeight:'22px' }}>
          <div>NIM <b style={{ fontWeight:600 }}>{mitra?.nomor_induk || '-'}</b></div>
          <div>{tempatLahir !== '-' ? `${tempatLahir}, ` : ''}<b style={{ fontWeight:600 }}>{tglAngka || '-'}</b></div>
        </div>
        <svg style={{ position:'absolute', left:'314px', top:'416px' }} width="24" height="25"><polygon points="0,0 24,0 0,25" fill="#56294f" /></svg>

        {/* BODY 2 kolom */}
        <div style={{ position:'relative', display:'table', width:'100%', tableLayout:'fixed' }}>
          {/* KIRI */}
          <div style={{ display:'table-cell', width:'314px', verticalAlign:'top', padding:'422px 16px 8px 39px', color:'white' }}>
            <Bio label="Kelamin" value={mitra?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
            <Bio label="Asal" value={asal} />
            <Bio label="Takut Hewan" value={hewan} />
            <Bio label="Tinggi" value={tinggi !== '-' ? `${tinggi} Cm.` : '-'} />
            <Bio label="Berat" value={berat !== '-' ? `${berat} Kg.` : '-'} />
            <Bio label="Suku" value={suku} />
            <Bio label="Agama" value={agama} />
            {memasak !== '-' && <Bio label="Masak" value={memasak} />}
            <Bio label="Status" value={statusNikah} />
            {mitra?.hijab && <Bio label="Hijab" value={mitra.hijab} />}
            {vaksin !== '-' && <Bio label="Vaksin" value={vaksin} />}

            <Garis />
            <JudulKiri teks="Pendidikan Formal" />
            <p data-blok style={{ fontSize:'14.5px', lineHeight:'18px', margin:0 }}>
              {mitra?.pendidikan_terakhir || '-'}{mitra?.tahun_lulus ? ` (${mitra.tahun_lulus})` : ''}
            </p>

            {linesPelatihan.length > 0 && (<>
              <Garis />
              <JudulKiri teks="Pendidikan Non-Formal" />
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {linesPelatihan.map((l: string, i: number) => (
                  <li key={i} data-blok style={{ display:'flex', gap:'8px', fontSize:'13.5px', lineHeight:'17px', paddingLeft:'10px' }}>
                    <span style={{ flexShrink:0 }}>•</span><span><TebalAwal teks={l} /></span>
                  </li>
                ))}
              </ul>
            </>)}

            {/* materi training yg SUDAH DICEKLIS Training Center (cv_materi), font kecil spt contoh */}
            <Garis />
            <JudulKiri teks="Pelatihan Didapat" />
            {materiDidapat.length > 0 ? (
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {materiDidapat.map((t, i) => (
                  <li key={i} data-blok style={{ display:'flex', gap:'2px', fontSize:'11px', lineHeight:'13px' }}>
                    <span style={{ flexShrink:0 }}>✓</span><span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize:'12px', fontStyle:'italic', margin:0, opacity:0.85 }}>Belum ada materi training yang diceklis.</p>
            )}
            <div style={{ width:'200px', height:'2px', background:NAVY, marginTop:'8px' }} />
          </div>

          {/* KANAN */}
          <div style={{ display:'table-cell', verticalAlign:'top', padding:'202px 28px 90px 35px' }}>
            {kemampuanList.length > 0 && (<>
              <JudulKanan teks="Kemampuan" />
              <ul style={{ listStyle:'none', margin:'0 0 50px', padding:0 }}>
                {kemampuanList.map((k, i) => <Cek key={i}>{k}</Cek>)}
              </ul>
            </>)}

            <JudulKanan teks="Pengalaman Kerja" />
            {linesPengalaman.length > 0 ? (
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {linesPengalaman.map((l: string, i: number) => <Cek key={i}><TebalAwal teks={l} /></Cek>)}
              </ul>
            ) : (
              <p style={{ fontFamily:'"Figtree", sans-serif', fontSize:'14px', fontStyle:'italic', margin:0 }}>Fresh Graduate / Belum ada pengalaman kerja</p>
            )}
          </div>
        </div>

        {/* "With Love We Serve" -- selalu di bawah halaman terakhir, kolom kanan (ruangnya = padding bawah kolom kanan) */}
        <div style={{ position:'absolute', left:'418px', bottom:'38px', display:'flex', alignItems:'center', gap:'8px', color:'#dcdcdc' }}>
          <svg width="44" height="8" viewBox="0 0 44 8"><path d="M0 4h44M0 4l4-3M0 4l4 3M3 4l4-3M3 4l4 3" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
          <span style={{ fontFamily:'"Yellowtail", cursive', fontSize:'22px', whiteSpace:'nowrap' }}>With Love We Serve</span>
          <svg width="44" height="8" viewBox="0 0 44 8"><path d="M0 4h44M44 4l-4-3M44 4l-4 3M41 4l-4-3M41 4l-4 3" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@800&family=Figtree:wght@400;700&family=Yellowtail&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          /* .no-print (Control Bar + Sidebar/Header dashboard, lihat globals.css) disembunyikan
             total; shell dashboard di-reset ke height:auto di globals.css spy CV panjang bisa
             lanjut ke halaman 2. */
          html, body { background: white !important; }
          .cv-page-wrapper { padding: 0 !important; min-height: 0 !important; background: white !important; }
          #cv-content { box-shadow: none !important; margin: 0 auto !important; }
          /* semua warna/gradasi latar ikut tercetak persis spt di layar */
          #cv-content, #cv-content * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* full-bleed (tanpa margin kertas) spy latar & kolom kiri sampai tepi */
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}

/** Pola dekoratif (setengah lingkaran solid + busur garis) spt di template; t = ukuran 1 petak. */
function Pola({ t, style }: { t: number; style: React.CSSProperties }) {
  const id = `pola-${String(t).replace('.', '-')}`;
  const busur = [0.5, 0.43, 0.36, 0.29, 0.22].map(r => r * t);
  const solid = (x: number, y: number) => (<>
    <path d={`M${x} ${y} h${t} a${t / 2} ${t / 2} 0 0 1 ${-t} 0z`} fill={TEAL} />
    <path d={`M${x} ${y + t} a${t / 2} ${t / 2} 0 0 1 ${t} 0z`} fill={TEAL} />
  </>);
  const garis = (x: number, y: number) => (
    <g fill="none" stroke={TEAL} strokeWidth={Math.max(0.6, t / 40)}>
      {busur.map((r, i) => (
        <g key={i}>
          <path d={`M${x} ${y + t / 2 - r} a${r} ${r} 0 0 1 0 ${2 * r}`} />
          <path d={`M${x + t} ${y + t / 2 - r} a${r} ${r} 0 0 0 0 ${2 * r}`} />
        </g>
      ))}
    </g>
  );
  return (
    <svg style={style}>
      <defs>
        <pattern id={id} width={2 * t} height={2 * t} patternUnits="userSpaceOnUse">
          {solid(0, 0)}{garis(t, 0)}{garis(0, t)}{solid(t, t)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
