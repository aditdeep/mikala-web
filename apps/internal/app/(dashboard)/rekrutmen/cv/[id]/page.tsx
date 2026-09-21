'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, Download, AlertCircle, Phone, Mail, MapPin, Calendar, User } from 'lucide-react';

const LOGO = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png";
const FAVICON = "https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png";

// Colors
const GREEN = '#2d7a5e';
const GREEN2 = '#3a9e78';
const PINK = '#d63a7a';
const PINK2 = '#e8699a';
const DARK = '#1a2e25';
const GRAY = '#4a5568';
const LIGHT_GREEN = '#e8f5f0';
const LIGHT_PINK = '#fce8f0';

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
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:`3px solid ${GREEN}`, borderTopColor:'transparent', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
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
  const p = mitra?.pengalaman || '';
  // FIX: mitra baru (dibuat via form Rekrutmen modern) ngisi kolom DB asli (mitra.agama,
  // mitra.berat_badan, dst -- lihat task migrasi blob->kolom sebelumnya), BUKAN blob teks lama
  // di mitra.pengalaman. Kalau CV cuma baca getExtra(p,...) dari blob itu, data yg sebenernya
  // ADA di DB keliatan kosong ("-") di CV. Sekarang kolom DB asli diprioritaskan, blob-parse
  // cuma fallback buat mitra lama yg belum kesimpen di kolom asli.
  const tipeJob = mitra?.tipe_pekerjaan || getExtra(p, 'Tipe Pekerjaan') || 'Perawat Homecare';
  const usia = getExtra(p, 'Usia') || '-';
  const tempatLahir = mitra?.tempat_lahir || getExtra(p, 'Tempat Lahir') || '-';
  const suku = mitra?.suku || getExtra(p, 'Suku') || '-';
  const tinggi = mitra?.tinggi_badan || getExtra(p, 'TB') || '-';
  const berat = mitra?.berat_badan || getExtra(p, 'BB') || '-';
  const agama = mitra?.agama || getExtra(p, 'Agama') || '-';
  const statusNikah = mitra?.status_nikah || getExtra(p, 'Status Nikah') || '-';
  const vaksin = mitra?.vaksin || getExtra(p, 'Vaksin') || '-';
  const takutHewan = mitra?.takut_hewan || getExtra(p, 'Takut Hewan') || '-';
  const memasak = mitra?.bisa_memasak || getExtra(p, 'Memasak') || '-';
  const pelatihan = getPelatihan(p);
  const pengalamanKerja = getPengalamanKerja(p);
  const tglLahir = mitra?.tanggal_lahir
    ? new Date(mitra.tanggal_lahir).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    : '-';
  const foto = mitra?.foto_url || mitra?.ktp_file || null;
  const nik = mitra?.nik || '-';

  const SectionTitle = ({ title, color = GREEN }: { title: string; color?: string }) => (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
      <div style={{ width:'4px', height:'20px', borderRadius:'2px', background:`linear-gradient(to bottom, ${color}, ${color === GREEN ? PINK : GREEN})` }} />
      <h2 style={{ fontSize:'13px', fontWeight:800, color, margin:0, letterSpacing:'0.5px', textTransform:'uppercase' }}>{title}</h2>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, ${color}44, transparent)` }} />
    </div>
  );

  const BioRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display:'flex', gap:'8px', padding:'3px 0', borderBottom:'1px solid rgba(45,122,94,0.08)', fontSize:'11px', color:DARK }}>
      <span style={{ minWidth:'110px', color:GRAY, fontWeight:500 }}>{label}</span>
      <span style={{ fontWeight:600, color:DARK }}>{value}</span>
    </div>
  );

  const ListItem = ({ text, color = GREEN }: { text: string; color?: string }) => (
    <div style={{ display:'flex', gap:'8px', marginBottom:'4px', fontSize:'11px', color:DARK, lineHeight:'1.6' }}>
      <span style={{ color, fontWeight:700, flexShrink:0, marginTop:'1px' }}>◆</span>
      <span>{text.replace(/^[-•◆]\s*/, '')}</span>
    </div>
  );

  return (
    <div className="cv-page-wrapper" style={{ background:'#f0f4f0', minHeight:'100vh', padding:'20px' }}>
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
          <button onClick={() => window.print()} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 18px', background:`linear-gradient(135deg, ${GREEN}, ${GREEN2})`, border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer', boxShadow:`0 4px 12px ${GREEN}44` }}>
            <Download size={15} />Download PDF
          </button>
        </div>
      </div>

      {/* CV A4 -- tinggi TIDAK dipatok (biar bisa lebih dari 1 halaman kalau kontennya panjang,
          browser print yg atur pemotongan halaman). overflow TIDAK hidden di level ini (supaya
          konten yg lebih panjang dari 1123px gak ke-crop -- dekorasi lingkaran di header sudah
          di-clip di level headernya sendiri, lihat di bawah). */}
      <div id="cv-content" style={{
        width:'794px', margin:'0 auto',
        background:'white', fontFamily:'"Segoe UI", Arial, sans-serif',
        position:'relative', boxShadow:'0 8px 40px rgba(0,0,0,0.18)',
        borderRadius:'4px',
      }}>

        {/* Background subtle pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 20% 20%, ${LIGHT_GREEN} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${LIGHT_PINK} 0%, transparent 50%)`, opacity:0.5, zIndex:0, pointerEvents:'none' }} />

        {/* ═══ HEADER ═══ */}
        <div style={{ position:'relative', zIndex:1, background:`linear-gradient(135deg, ${GREEN} 0%, ${GREEN2} 40%, ${PINK} 100%)`, padding:'0', overflow:'hidden' }}>
          {/* Header bg pattern */}
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
          <div style={{ position:'absolute', bottom:'-30px', left:'30%', width:'150px', height:'150px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

          <div style={{ padding:'24px 30px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:2 }}>
            {/* Left: Logo + Name */}
            <div style={{ flex:1 }}>
              {/* Logo */}
              <div style={{ marginBottom:'14px' }}>
                <img src={LOGO} alt="Mikala Global Medika" style={{ height:'36px', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
              </div>
              {/* Name */}
              <div style={{ marginBottom:'6px' }}>
                <span style={{ fontSize:'38px', fontWeight:900, color:'white', lineHeight:1, textShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>{namaDepan} </span>
                {namaBelakang && <span style={{ fontSize:'38px', fontWeight:300, color:'rgba(255,255,255,0.9)', lineHeight:1 }}>{namaBelakang}</span>}
              </div>
              {/* Job Title */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(10px)', borderRadius:'20px', padding:'5px 14px', border:'1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color:'white', fontSize:'12px', fontWeight:600, letterSpacing:'0.5px' }}>{tipeJob}</span>
              </div>
            </div>

            {/* Right: Photo */}
            <div style={{ flexShrink:0, marginLeft:'20px' }}>
              <div style={{ width:'130px', height:'130px', borderRadius:'50%', border:'4px solid rgba(255,255,255,0.6)', background:`linear-gradient(135deg, ${LIGHT_GREEN}, ${LIGHT_PINK})`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.25), 0 0 0 8px rgba(255,255,255,0.15)' }}>
                {foto ? (
                  <img src={foto} alt={nama} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <span style={{ fontSize:'48px', fontWeight:700, color:GREEN }}>{nama[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Header bottom wave */}
          <svg viewBox="0 0 794 30" style={{ display:'block', width:'100%', height:'30px' }} preserveAspectRatio="none">
            <path d="M0,0 Q200,30 400,15 Q600,0 794,20 L794,30 L0,30 Z" fill="white" />
          </svg>
        </div>

        {/* ═══ BODY - 2 COLUMNS ═══ -- pakai display:table/table-cell (bukan CSS grid) karena
            grid sering gak kepotong dgn bener kalau kontennya lebih panjang dari 1 halaman A4
            pas di-print/export PDF (kolom kanan yg panjang jadi ke-crop). table-cell alami
            mendukung tinggi kolom yg fleksibel & page-break yg lebih predictable di Chrome. */}
        <div style={{ position:'relative', zIndex:1, display:'table', width:'100%', tableLayout:'fixed' }}>

          {/* ═══ LEFT SIDEBAR ═══ */}
          <div style={{ display:'table-cell', width:'240px', verticalAlign:'top', background:`linear-gradient(180deg, ${LIGHT_GREEN} 0%, rgba(232,245,240,0.3) 100%)`, borderRight:'2px solid rgba(45,122,94,0.12)', padding:'24px 18px' }}>

            {/* Foto besar (opsional duplicate untuk print) */}

            {/* BIODATA */}
            <div style={{ marginBottom:'20px' }}>
              <SectionTitle title="Data Diri" color={GREEN} />
              <BioRow label="NIK" value={nik} />
              <BioRow label="Tempat Lahir" value={tempatLahir} />
              <BioRow label="Tgl Lahir" value={tglLahir} />
              <BioRow label="Usia" value={usia + ' tahun'} />
              <BioRow label="Jenis Kelamin" value={mitra?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
              <BioRow label="Agama" value={agama} />
              <BioRow label="Status" value={statusNikah} />
              <BioRow label="Suku" value={suku} />
            </div>

            {/* FISIK */}
            <div style={{ marginBottom:'20px' }}>
              <SectionTitle title="Data Fisik" color={GREEN} />
              <BioRow label="Tinggi Badan" value={tinggi + ' cm'} />
              <BioRow label="Berat Badan" value={berat + ' kg'} />
              <BioRow label="Vaksin" value={vaksin} />
            </div>

            {/* KEMAMPUAN KHUSUS */}
            <div style={{ marginBottom:'20px' }}>
              <SectionTitle title="Kemampuan Khusus" color={PINK} />
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {takutHewan !== '-' && (
                  <div style={{ background:`linear-gradient(135deg, ${LIGHT_GREEN}, white)`, borderRadius:'8px', padding:'6px 10px', fontSize:'10px', color:GREEN, fontWeight:600, border:`1px solid ${GREEN}22` }}>
                    🐾 {takutHewan}
                  </div>
                )}
                {memasak !== '-' && (
                  <div style={{ background:`linear-gradient(135deg, ${LIGHT_PINK}, white)`, borderRadius:'8px', padding:'6px 10px', fontSize:'10px', color:PINK, fontWeight:600, border:`1px solid ${PINK}22` }}>
                    🍳 Memasak: {memasak}/5
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ═══ RIGHT CONTENT ═══ */}
          <div style={{ display:'table-cell', verticalAlign:'top', padding:'24px 24px 24px 20px' }}>

            {/* PENDIDIKAN FORMAL */}
            <div style={{ marginBottom:'22px' }}>
              <SectionTitle title="Pendidikan Formal" color={GREEN} />
              <div style={{ background:`linear-gradient(135deg, ${LIGHT_GREEN}, white)`, borderRadius:'12px', padding:'12px 16px', border:`1px solid ${GREEN}22` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`linear-gradient(135deg, ${GREEN}, ${GREEN2})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ color:'white', fontSize:'18px' }}>🎓</span>
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'12px', color:DARK, margin:0 }}>{mitra?.pendidikan_terakhir || '-'}</p>
                    <p style={{ fontSize:'10px', color:GRAY, margin:'2px 0 0' }}>Pendidikan Terakhir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PENDIDIKAN NON FORMAL / PELATIHAN */}
            {pelatihan && pelatihan !== 'Tidak ada' && (
              <div style={{ marginBottom:'22px' }}>
                <SectionTitle title="Pelatihan & Sertifikasi" color={GREEN} />
                <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                  {pelatihan.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                    <ListItem key={i} text={line} color={GREEN} />
                  ))}
                </div>
              </div>
            )}

            {/* PENGALAMAN KERJA */}
            <div style={{ marginBottom:'22px' }}>
              <SectionTitle title="Pengalaman Kerja" color={PINK} />
              {pengalamanKerja && pengalamanKerja !== 'Tidak ada' ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                  {pengalamanKerja.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                    <ListItem key={i} text={line} color={PINK} />
                  ))}
                </div>
              ) : (
                <div style={{ background:`linear-gradient(135deg, ${LIGHT_PINK}, white)`, borderRadius:'10px', padding:'12px 16px', border:`1px solid ${PINK}22` }}>
                  <p style={{ fontSize:'11px', color:GRAY, margin:0, fontStyle:'italic' }}>Fresh Graduate / Belum ada pengalaman kerja</p>
                </div>
              )}
            </div>

            {/* BIDANG KEAHLIAN -- diisi dari materi training yg sudah DICEKLIS oleh Training
                Center (cv_materi), bukan tag statis lagi. Dikelompokkan per kategori (mis.
                "Dasar" & "PHC") kalau ceklisnya kebetulan kena 2 kategori sekaligus, masing2
                ditampilkan sebagai list rapi 2 kolom (bukan pill/badge lagi biar muat banyak
                item tanpa berantakan). break-inside:avoid di tiap baris biar gak kepotong di
                tengah kalau pas jatuh di batas halaman. */}
            <div style={{ marginBottom:'22px' }}>
              <SectionTitle title="Bidang Keahlian" color={PINK} />
              {(() => {
                const KATEGORI_LABEL: Record<string, string> = {
                  'Dasar': 'Materi Dasar',
                  'PHC': 'Perawat Homecare (PHC)',
                };
                const grup = cvMateri.reduce((acc: Record<string, string[]>, m: any) => {
                  const kat = m.kategori || 'Lainnya';
                  if (!acc[kat]) acc[kat] = [];
                  if (m.nama) acc[kat].push(m.nama);
                  return acc;
                }, {} as Record<string, string[]>);
                const kategoriKeys = Object.keys(grup);
                return (
                  <div style={{ background:`linear-gradient(135deg, rgba(214,58,122,0.06), white)`, borderRadius:'12px', padding:'14px 16px', border:`1px solid ${PINK}22` }}>
                    <div style={{ marginBottom: kategoriKeys.length ? '10px' : 0 }}>
                      <span style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', borderRadius:'20px', padding:'4px 12px', fontSize:'10px', fontWeight:600 }}>{tipeJob}</span>
                    </div>
                    {kategoriKeys.length > 0 ? (
                      kategoriKeys.map(kat => (
                        <div key={kat} style={{ marginBottom:'12px', breakInside:'avoid-column' as const }}>
                          {kategoriKeys.length > 1 && (
                            <p style={{ fontSize:'10.5px', fontWeight:700, color:PINK, textTransform:'uppercase', letterSpacing:'0.3px', margin:'0 0 6px' }}>{KATEGORI_LABEL[kat] || kat}</p>
                          )}
                          <div style={{ columnCount:2, columnGap:'18px' }}>
                            {grup[kat].map((nm: string, i: number) => (
                              <div key={i} style={{ display:'flex', gap:'6px', fontSize:'10.5px', color:DARK, lineHeight:'1.5', marginBottom:'3px', breakInside:'avoid-column' as const }}>
                                <span style={{ color:GREEN, flexShrink:0 }}>✓</span>
                                <span>{nm}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize:'11px', color:GRAY, margin:0, fontStyle:'italic' }}>Belum ada materi training yang diceklis oleh Training Center.</p>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{ position:'relative', zIndex:1, background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'12px 30px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <img src={FAVICON} alt="MGM" style={{ height:'28px', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
          <span style={{ color:'rgba(255,255,255,0.9)', fontStyle:'italic', fontWeight:700, fontSize:'14px', letterSpacing:'1px' }}>With Love We Serve</span>
          <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'10px' }}>Mikala Global Medika © 2026</span>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          /* .no-print (Control Bar di sini + Sidebar/Header dashboard, lihat globals.css)
             disembunyikan total via display:none (bukan cuma visibility:hidden) supaya beneran
             gak makan tempat/nambah margin kosong di atas hasil print. Shell dashboard yg
             dipatok height:100vh+overflow:hidden juga di-reset ke height:auto/overflow:visible
             di globals.css -- itu akar masalah kenapa CV yg lebih panjang dari 1 halaman dulu
             ke-crop, gak pernah lanjut ke halaman 2. Kartu #cv-content sekarang tinggal ngikut
             flow dokumen biasa & center via margin:auto, gak perlu position:absolute lagi. */
          .cv-page-wrapper { padding: 0 !important; min-height: 0 !important; background: white !important; }
          #cv-content {
            box-shadow: none !important;
            margin: 0 auto !important; border-radius: 0 !important;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
