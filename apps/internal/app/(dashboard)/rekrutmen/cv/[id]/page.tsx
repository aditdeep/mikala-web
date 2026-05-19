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
  const tipeJob = getExtra(p, 'Tipe Pekerjaan') || mitra?.tipe_pekerjaan || 'Perawat Homecare';
  const usia = getExtra(p, 'Usia') || '-';
  const tempatLahir = getExtra(p, 'Tempat Lahir') || '-';
  const suku = getExtra(p, 'Suku') || '-';
  const tinggi = getExtra(p, 'TB') || '-';
  const berat = getExtra(p, 'BB') || '-';
  const agama = getExtra(p, 'Agama') || '-';
  const statusNikah = getExtra(p, 'Status Nikah') || '-';
  const vaksin = getExtra(p, 'Vaksin') || '-';
  const takutHewan = getExtra(p, 'Takut Hewan') || '-';
  const memasak = getExtra(p, 'Memasak') || '-';
  const pelatihan = getPelatihan(p);
  const pengalamanKerja = getPengalamanKerja(p);
  const tglLahir = mitra?.tanggal_lahir
    ? new Date(mitra.tanggal_lahir).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    : '-';
  const foto = mitra?.foto_url || mitra?.ktp_file || null;
  const email = mitra?.user?.email || '-';
  const phone = mitra?.user?.phone || '-';
  const alamat = mitra?.alamat || '-';
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
    <div style={{ background:'#f0f4f0', minHeight:'100vh', padding:'20px' }}>
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

      {/* CV A4 */}
      <div id="cv-content" style={{
        width:'794px', minHeight:'1123px', margin:'0 auto',
        background:'white', fontFamily:'"Segoe UI", Arial, sans-serif',
        position:'relative', boxShadow:'0 8px 40px rgba(0,0,0,0.18)',
        borderRadius:'4px', overflow:'hidden',
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
              {/* Contact mini */}
              <div style={{ display:'flex', gap:'16px', marginTop:'12px', flexWrap:'wrap' }}>
                {[
                  { icon:'📞', val: phone },
                  { icon:'✉️', val: email },
                ].map(c => (
                  <div key={c.val} style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'rgba(255,255,255,0.85)' }}>
                    <span>{c.icon}</span><span>{c.val}</span>
                  </div>
                ))}
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

        {/* ═══ BODY - 2 COLUMNS ═══ */}
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'900px' }}>

          {/* ═══ LEFT SIDEBAR ═══ */}
          <div style={{ background:`linear-gradient(180deg, ${LIGHT_GREEN} 0%, rgba(232,245,240,0.3) 100%)`, borderRight:'2px solid rgba(45,122,94,0.12)', padding:'24px 18px' }}>

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

            {/* ALAMAT */}
            <div style={{ marginBottom:'20px' }}>
              <SectionTitle title="Alamat" color={GREEN} />
              <p style={{ fontSize:'11px', color:DARK, lineHeight:'1.7', margin:0 }}>{alamat}</p>
            </div>

            {/* KONTAK */}
            <div style={{ marginBottom:'20px' }}>
              <SectionTitle title="Kontak" color={GREEN} />
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                {[
                  { label:'Telepon', value: phone, icon:'📞' },
                  { label:'Email', value: email, icon:'✉️' },
                ].map(c => (
                  <div key={c.label} style={{ display:'flex', gap:'8px', fontSize:'11px', color:DARK, alignItems:'flex-start' }}>
                    <span style={{ flexShrink:0 }}>{c.icon}</span>
                    <div>
                      <div style={{ color:GRAY, fontSize:'10px' }}>{c.label}</div>
                      <div style={{ fontWeight:600, wordBreak:'break-all' as const }}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
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
          <div style={{ padding:'24px 24px 24px 20px' }}>

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

            {/* MOTIVASI / TIPE PEKERJAAN */}
            <div style={{ marginBottom:'22px' }}>
              <SectionTitle title="Bidang Keahlian" color={PINK} />
              <div style={{ background:`linear-gradient(135deg, rgba(214,58,122,0.06), white)`, borderRadius:'12px', padding:'14px 16px', border:`1px solid ${PINK}22` }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {[tipeJob, 'Perawatan Pasien', 'Homecare', 'Komunikasi'].filter(Boolean).map((skill, i) => (
                    <span key={i} style={{ background: i === 0 ? `linear-gradient(135deg, ${GREEN}, ${PINK})` : `linear-gradient(135deg, ${LIGHT_GREEN}, ${LIGHT_PINK})`, color: i === 0 ? 'white' : DARK, borderRadius:'20px', padding:'4px 12px', fontSize:'10px', fontWeight:600, border: i === 0 ? 'none' : `1px solid ${GREEN}22` }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
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
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
          body * { visibility: hidden; }
          #cv-content, #cv-content * { visibility: visible; }
          #cv-content {
            position: absolute; left: 0; top: 0;
            width: 794px; box-shadow: none !important;
            margin: 0 !important; border-radius: 0 !important;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
