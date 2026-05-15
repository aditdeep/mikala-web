'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';

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
        setMitra(data);
        const m: string[] = [];
        if (!data?.nama_lengkap) m.push('Nama Lengkap');
        if (!data?.tanggal_lahir) m.push('Tanggal Lahir');
        if (!data?.pendidikan_terakhir) m.push('Pendidikan');
        if (!data?.pengalaman) m.push('Pengalaman');
        setMissing(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const getPelatihan = (p: string) => {
    const m = p?.match(/PELATIHAN:[\s\S]*?([\s\S]*?)(?=PENGALAMAN KERJA:|DATA TAMBAHAN:|$)/i);
    return m ? m[1].trim() : p || '';
  };

  const getPengalamanKerja = (p: string) => {
    const m = p?.match(/PENGALAMAN KERJA:[\s\S]*?([\s\S]*?)(?=DATA TAMBAHAN:|$)/i);
    return m ? m[1].trim() : '';
  };

  const getExtra = (p: string, field: string) => {
    const m = p?.match(new RegExp(`${field}:\\s*([^,\\n]+)`, 'i'));
    return m ? m[1].trim() : '';
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px' }}>
      <p style={{ color:'var(--text3)' }}>Memuat data CV...</p>
    </div>
  );

  if (!mitra) return (
    <div style={{ textAlign:'center', padding:'40px' }}>
      <p style={{ color:'var(--text3)' }}>Data mitra tidak ditemukan</p>
      <button onClick={() => router.back()} style={{ marginTop:'16px', padding:'8px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text2)', cursor:'pointer' }}>
        Kembali
      </button>
    </div>
  );

  const nama = mitra?.nama_lengkap || mitra?.user?.name || '-';
  const p = mitra?.pengalaman || '';
  const tipeJob = getExtra(p, 'Tipe Pekerjaan') || 'Caregiver';
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
  const kota = mitra?.kota || '-';
  const tglLahir = mitra?.tanggal_lahir
    ? new Date(mitra.tanggal_lahir).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    : '-';

  return (
    <div>
      {/* Control Bar */}
      <div className="no-print" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <button onClick={() => router.back()} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', cursor:'pointer', fontSize:'13px' }}>
          <ArrowLeft size={16} />Kembali
        </button>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {missing.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'12px', color:'#f59e0b', fontSize:'12px' }}>
              <AlertCircle size={14} />Data kurang: {missing.join(', ')}
            </div>
          )}
          <button onClick={() => window.print()} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 18px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Download size={15} />Download PDF
          </button>
        </div>
      </div>

      {/* CV A4 */}
      <div id="cv-content" style={{
        width:'794px', minHeight:'1123px', margin:'0 auto',
        background:'white', fontFamily:'Arial, sans-serif',
        position:'relative', overflow:'hidden',
        boxShadow:'0 4px 32px rgba(0,0,0,0.15)',
      }}>
        {/* BG Gradient */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #f5c0e8 0%, #d090d8 25%, #9060c0 50%, #5090c8 75%, #30c0b0 100%)', opacity:0.25, zIndex:0 }} />

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, padding:'28px 30px 16px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg, #7c3aed, #06b6d4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'white', fontSize:'18px', fontWeight:900 }}>+</span>
              </div>
              <div>
                <div style={{ fontSize:'10px', fontWeight:700, color:'#7c3aed', letterSpacing:'1px' }}>MIKALA GLOBAL</div>
                <div style={{ fontSize:'12px', fontWeight:900, color:'#7c3aed', letterSpacing:'2px' }}>MEDIKA</div>
              </div>
            </div>
            <div style={{ fontSize:'46px', fontWeight:900, color:'#4a1a6a', lineHeight:1, marginBottom:'4px' }}>{nama.split(' ')[0]}</div>
            <div style={{ fontSize:'16px', fontWeight:600, color:'#6a3a8a' }}>{tipeJob}</div>
          </div>
          {/* Photo placeholder */}
          <div style={{ width:'140px', height:'140px', borderRadius:'50%', border:'4px solid white', background:'linear-gradient(135deg, #c890d8, #40a0c0)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize:'44px', fontWeight:700, color:'white' }}>{nama[0]?.toUpperCase()}</span>
          </div>
        </div>

        {/* 2 Column Content */}
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', padding:'0 30px 20px', gap:'0' }}>
          {/* LEFT */}
          <div style={{ paddingRight:'18px' }}>
            {/* Profil */}
            <div style={{ marginBottom:'18px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
                <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'15px' }}>+</span>
                <h2 style={{ fontSize:'15px', fontWeight:700, color:'#7c3aed', margin:0 }}>Profil</h2>
              </div>
              <div style={{ paddingLeft:'14px', fontSize:'11.5px', color:'#333', lineHeight:'1.9' }}>
                <div><strong>Usia</strong> : {usia} tahun</div>
                <div><strong>Tempat, Tgl Lahir</strong> : {tempatLahir}, {tglLahir}</div>
                <div><strong>Asal</strong> : {kota}</div>
                {suku !== '-' && <div><strong>Suku</strong> : {suku}</div>}
                <div><strong>Tinggi Badan</strong> : {tinggi} Cm</div>
                <div><strong>Berat Badan</strong> : {berat} Kg</div>
                <div><strong>Agama</strong> : {agama}</div>
                <div><strong>Status</strong> : {statusNikah}</div>
                <div><strong>Vaksin</strong> : {vaksin}</div>
                {takutHewan !== '-' && <div><strong>{takutHewan}</strong></div>}
                {memasak !== '-' && <div><strong>Kemampuan Memasak: {memasak}/5</strong></div>}
              </div>
            </div>

            {/* Pengalaman yang didapat */}
            {pelatihan && pelatihan !== 'Tidak ada' && (
              <div style={{ marginBottom:'18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
                  <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'15px' }}>+</span>
                  <h2 style={{ fontSize:'15px', fontWeight:700, color:'#7c3aed', margin:0 }}>Pengalaman yang didapat</h2>
                </div>
                <div style={{ paddingLeft:'14px', fontSize:'11.5px', color:'#333', lineHeight:'1.8' }}>
                  {pelatihan.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                    <div key={i} style={{ display:'flex', gap:'6px', marginBottom:'2px' }}>
                      <span>•</span><span>{line.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ paddingLeft:'18px', borderLeft:'1px solid rgba(124,58,237,0.15)' }}>
            {/* Pendidikan Formal */}
            <div style={{ marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'15px' }}>+</span>
                <h2 style={{ fontSize:'15px', fontWeight:700, color:'#4a1a6a', margin:0 }}>Pendidikan Formal</h2>
              </div>
              <div style={{ paddingLeft:'14px', fontSize:'11.5px', fontWeight:700, color:'#333' }}>
                {mitra?.pendidikan_terakhir || '-'}
              </div>
            </div>

            {/* Pendidikan Non Formal */}
            <div style={{ marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'15px' }}>+</span>
                <h2 style={{ fontSize:'15px', fontWeight:700, color:'#4a1a6a', margin:0 }}>Pendidikan Non Formal</h2>
              </div>
              <div style={{ paddingLeft:'14px', fontSize:'11.5px', color:'#333' }}>
                {pelatihan && pelatihan !== 'Tidak ada' ? pelatihan.split('\n')[0] : '-'}
              </div>
            </div>

            {/* Kemampuan */}
            <div style={{ marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'15px' }}>+</span>
                <h2 style={{ fontSize:'15px', fontWeight:700, color:'#4a1a6a', margin:0 }}>Kemampuan</h2>
              </div>
              <div style={{ paddingLeft:'14px', fontSize:'11.5px', color:'#333', lineHeight:'1.8' }}>
                {mitra?.pendidikan_terakhir && (
                  <div style={{ display:'flex', gap:'6px', marginBottom:'2px' }}>
                    <span>•</span><span>Lulusan {mitra.pendidikan_terakhir}</span>
                  </div>
                )}
                {pengalamanKerja.split('\n').filter((l:string) => l.trim()).slice(0,4).map((line:string, i:number) => (
                  <div key={i} style={{ display:'flex', gap:'6px', marginBottom:'2px' }}>
                    <span>•</span><span>{line.replace(/^[-•]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengalaman Kerja */}
            {pengalamanKerja && pengalamanKerja !== 'Tidak ada' && (
              <div style={{ marginBottom:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                  <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'15px' }}>+</span>
                  <h2 style={{ fontSize:'15px', fontWeight:700, color:'#4a1a6a', margin:0 }}>Pengalaman</h2>
                </div>
                <div style={{ paddingLeft:'14px', fontSize:'11.5px', color:'#333', lineHeight:'1.8' }}>
                  {pengalamanKerja.split('\n').filter((l:string) => l.trim()).map((line:string, i:number) => (
                    <div key={i} style={{ display:'flex', gap:'6px', marginBottom:'2px', fontWeight: i % 3 === 2 ? 700 : 400 }}>
                      <span>•</span><span>{line.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position:'relative', zIndex:1, background:'linear-gradient(135deg, #9060c0, #40a0c0)', padding:'10px 30px', display:'flex', justifyContent:'center', marginTop:'auto' }}>
          <span style={{ color:'white', fontStyle:'italic', fontWeight:600, fontSize:'15px' }}>With Love We Serve</span>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden; }
          #cv-content, #cv-content * { visibility: visible; }
          #cv-content { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0 !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
