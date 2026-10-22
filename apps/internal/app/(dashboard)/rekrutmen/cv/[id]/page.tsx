'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';

const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";

// Warna template CV
const UNGU = '#a35597';
const TEAL = '#3f88a2';
const TEKS = '#1c1c1c';
const HAL = 1122.5; // tinggi 1 halaman A4 dlm px (794px lebar)
// tekstur bintik (noise) di atas gradasi, spt template desain
const NOISE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

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
  const nik = mitra?.nik || '-';


  // Layout mengikuti template CV desain (contoh: "CV Nita Agnes R.pdf"): latar gradasi pink ->
  // krem -> cyan bertekstur, blok teal + foto bulat di kanan atas, kolom ungu di kiri (Profil &
  // materi training) dan kolom kanan di atas gradasi (pendidikan, kemampuan, pengalaman).
  // Ukuran = template asli (A4 1131px) x 0.702 -> lebar 794px.
  const namaFs = Math.max(30, Math.min(48, Math.floor(400 / (nama.length * 0.6))));
  const tglLahirTeks = [mitra?.tempat_lahir || getExtra(p, 'Tempat Lahir'), tglLahir !== '-' ? tglLahir : ''].filter(Boolean).join(', ') || '-';
  const asal = mitra?.kota || '';
  const linesPelatihan = pelatihan && pelatihan !== 'Tidak ada' ? pelatihan.split('\n').map((l: string) => l.replace(/^[-•◆]\s*/, '').trim()).filter(Boolean) : [];
  const linesPengalaman = pengalamanKerja && pengalamanKerja !== 'Tidak ada' ? pengalamanKerja.split('\n').map((l: string) => l.replace(/^[-•◆]\s*/, '').trim()).filter(Boolean) : [];
  const materiDidapat: string[] = cvMateri.map((m: any) => m.nama).filter(Boolean);

  const Judul = ({ teks, warna }: { teks: string; warna: string }) => (
    <h2 data-blok style={{ display:'flex', alignItems:'baseline', gap:'12px', fontSize:'21px', fontWeight:700, color:warna, margin:'0 0 8px', lineHeight:1.2, breakAfter:'avoid' as const }}>
      <span style={{ fontSize:'20px' }}>+</span>{teks}
    </h2>
  );
  const Baris = ({ label, value }: { label: string; value: string }) => (
    <div data-blok style={{ fontSize:'13px', lineHeight:'18px' }}><b style={{ fontWeight:600 }}>{label} :</b> {value}</div>
  );
  const Poin = ({ teks, warna }: { teks: string; warna: string }) => (
    <li data-blok style={{ display:'flex', gap:'12px', fontSize:'13px', lineHeight:'18.5px', marginBottom:'1px', color:warna, breakInside:'avoid' as const }}>
      <span style={{ flexShrink:0 }}>•</span><span>{teks}</span>
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

      {/* CV A4 -- tinggi minimal 1 halaman (1123px), boleh memanjang ke halaman 2 kalau materi
          training banyak. Kolom ungu digambar sbg lapisan absolut setinggi kartu, jadi selalu
          sampai bawah berapa pun panjang isinya. */}
      <div id="cv-content" style={{
        width:'794px', minHeight:'1123px', margin:'0 auto', position:'relative', overflow:'hidden',
        backgroundImage:`radial-gradient(ellipse 60% 40% at 0% 0%, #e27cb8 0%, rgba(226,124,184,0) 100%), linear-gradient(155deg, #dc8fc0 0%, #e9c3c2 22%, #f0e6b2 38%, #c8edd2 58%, #92e4ea 80%, #7fe0f3 100%)`,
        backgroundSize:`100% ${HAL}px`, backgroundRepeat:'repeat-y', backgroundColor:'#7fe0f3',
        fontFamily:'"Hind", "Segoe UI", Arial, sans-serif', boxShadow:'0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* tekstur bintik halus spt template */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`url("${NOISE}")`, opacity:0.1, pointerEvents:'none' }} />
        {/* kolom ungu kiri (sudut kanan atas membulat) */}
        <div style={{ position:'absolute', left:0, top:'291px', bottom:0, width:'409px', background:UNGU, borderTopRightRadius:'62px' }} />
        {/* blok teal kanan atas + foto bulat */}
        <div style={{ position:'absolute', right:0, top:0, width:'298px', height:'312px', background:TEAL, borderBottomLeftRadius:'150px' }} />
        <div className="cv-foto" style={{ position:'absolute', left:'518px', top:'53px', width:'253px', height:'253px', borderRadius:'50%', background:'white', padding:'6px', boxSizing:'border-box' }}>
          <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {foto ? <img src={foto} alt={nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'80px', fontWeight:700, color:UNGU }}>{nama[0]?.toUpperCase()}</span>}
          </div>
        </div>

        {/* HEADER: logo, nama, jabatan */}
        <div style={{ position:'relative', height:'291px', padding:'38px 0 0 74px', boxSizing:'border-box', width:'480px' }}>
          <img src={LOGO} alt="Mikala Global Medika" style={{ height:'40px', objectFit:'contain', display:'block' }} />
          <h1 style={{ margin:'62px 0 0', fontSize:`${namaFs}px`, fontWeight:700, color:'white', lineHeight:1.1, letterSpacing:'0.5px', fontFamily:'Arial, Helvetica, sans-serif', wordSpacing:'6px' }}>{nama}</h1>
          <p style={{ margin:'12px 0 0', fontSize:'26px', fontWeight:700, fontStyle:'italic', color:'white', lineHeight:1.1 }}>{tipeJob}</p>
        </div>

        {/* BODY 2 kolom */}
        <div style={{ position:'relative', display:'table', width:'100%', tableLayout:'fixed' }}>
          {/* KIRI (ungu): Profil + materi training */}
          <div style={{ display:'table-cell', width:'409px', verticalAlign:'top', padding:'40px 20px 30px 79px', color:'white' }}>
            <Judul teks="Profil" warna="white" />
            <div style={{ paddingLeft:'30px', marginBottom:'34px' }}>
              <Baris label="Usia" value={usia !== '-' ? `${usia} tahun` : '-'} />
              <Baris label="Tempat, Tgl Lahir" value={tglLahirTeks} />
              {asal && <Baris label="Asal" value={asal} />}
              <Baris label="Suku" value={suku} />
              <Baris label="Tinggi Badan" value={tinggi !== '-' ? `${tinggi} Cm` : '-'} />
              <Baris label="Berat Badan" value={berat !== '-' ? `${berat} Kg` : '-'} />
              <Baris label="Agama" value={agama} />
              <Baris label="Status" value={statusNikah} />
              {mitra?.hijab && <Baris label="Hijab" value={mitra.hijab} />}
              <Baris label="Vaksin" value={vaksin} />
              {takutHewan !== '-' && <div style={{ fontSize:'13px', lineHeight:'18px', fontWeight:600 }}>{takutHewan}</div>}
              {memasak !== '-' && <div style={{ fontSize:'13px', lineHeight:'18px', fontWeight:600 }}>{memasak === 'Bisa' ? 'Bisa Memasak' : 'Tidak Bisa Memasak'}</div>}
            </div>

            {/* materi training yg SUDAH DICEKLIS Training Center (cv_materi) */}
            <Judul teks="Pengalaman yang didapat" warna="white" />
            {materiDidapat.length > 0 ? (
              <ul style={{ listStyle:'none', margin:0, padding:'0 0 0 30px' }}>
                {materiDidapat.map((t, i) => <Poin key={i} teks={t} warna="white" />)}
              </ul>
            ) : (
              <p style={{ fontSize:'12px', fontStyle:'italic', margin:'0 0 0 30px', opacity:0.85 }}>Belum ada materi training yang diceklis.</p>
            )}
          </div>

          {/* KANAN: pendidikan, kemampuan, pengalaman */}
          <div style={{ display:'table-cell', verticalAlign:'top', padding:'40px 40px 30px 54px', color:TEKS }}>
            <Judul teks="Pendidikan Formal" warna={TEKS} />
            <p style={{ fontSize:'13px', fontWeight:600, margin:'0 0 16px 30px' }}>
              {mitra?.pendidikan_terakhir || '-'}{mitra?.tahun_lulus ? ` (Lulus ${mitra.tahun_lulus})` : ''}
            </p>

            {linesPelatihan.length > 0 && (<>
              <Judul teks="Pendidikan Non Formal" warna={TEKS} />
              <div style={{ margin:'0 0 16px 30px', fontSize:'13px', lineHeight:'18.5px' }}>
                {linesPelatihan.map((l: string, i: number) => <div key={i}>{i === 0 && mitra?.tahun_pelatihan ? `${mitra.tahun_pelatihan} : ${l}` : l}</div>)}
              </div>
            </>)}

            {kemampuanList.length > 0 && (<>
              <Judul teks="Kemampuan" warna={TEKS} />
              <ul style={{ listStyle:'none', margin:'0 0 16px', padding:'0 0 0 30px' }}>
                {kemampuanList.map((k, i) => <Poin key={i} teks={k} warna={TEKS} />)}
              </ul>
            </>)}

            <Judul teks="Pengalaman" warna={TEKS} />
            {linesPengalaman.length > 0 ? (
              <ul style={{ listStyle:'none', margin:0, padding:'0 0 0 30px' }}>
                {linesPengalaman.map((l: string, i: number) => <Poin key={i} teks={l} warna={TEKS} />)}
              </ul>
            ) : (
              <p style={{ fontSize:'13px', fontStyle:'italic', margin:'0 0 0 30px' }}>Fresh Graduate / Belum ada pengalaman kerja</p>
            )}
          </div>
        </div>

        {/* badge "With Love We Serve" -- melintang di batas 2 kolom, di bawah isi */}
        <div style={{ height:'110px' }} />
        <div style={{ position:'absolute', left:'286px', bottom:'42px', zIndex:1, width:'240px', height:'42px', backgroundImage:'linear-gradient(90deg, #a3d4ef 0%, #b07ccb 55%, #c3449c 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'"Kaushan Script", cursive', fontSize:'22px', color:'white', letterSpacing:'0.5px' }}>With Love We Serve</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Kaushan+Script&display=swap');
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
          /* full-bleed (tanpa margin kertas) spy gradasi & kolom ungu sampai tepi */
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
