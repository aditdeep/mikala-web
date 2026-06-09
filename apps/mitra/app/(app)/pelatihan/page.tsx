'use client';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Circle, ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import { apiClient } from '@mikala/lib';

export default function PelatihanPage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openKat, setOpenKat] = useState<string[]>(['Dasar','PHC']);

  useEffect(() => {
    // Coba endpoint baru dulu, fallback ke lama
    apiClient.get('/mitra/pelatihan-saya')
      .then((r: any) => setData(r.data))
      .catch(() => {
        // Fallback ke endpoint lama
        apiClient.get('/mitra/pelatihan')
          .then((r: any) => {
            const items = r.data?.data || [];
            const done  = items.filter((m: any) => m.status==='completed').length;
            setData({
              total: items.length, selesai: done,
              persen: items.length ? Math.round(done/items.length*100) : 0,
              by_kategori: [],
              legacy: items,
            });
          })
          .catch(() => {})
      })
      .finally(() => setLoading(false));
  }, []);

  const kat_color: Record<string,string> = { 'Dasar':'#7c3aed', 'PHC':'#0ea5e9' };
  const kat_emoji: Record<string,string> = { 'Dasar':'📚', 'PHC':'🏥' };

  if (loading) return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <GraduationCap size={40} style={{ color:'var(--purple-light)', opacity:0.4 }}/>
    </div>
  );

  // Belum ada data sama sekali
  if (!data || (data.total === 0 && !data.legacy?.length)) return (
    <div style={{ padding:'20px', textAlign:'center', paddingBottom:'80px' }}>
      <GraduationCap size={48} style={{ color:'var(--purple-light)', margin:'0 auto 14px', display:'block', opacity:0.3 }}/>
      <p style={{ color:'var(--text)', fontWeight:600 }}>Belum ada data pelatihan</p>
      <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'6px' }}>
        Trainer akan menginput progress materi Anda setelah sesi pelatihan
      </p>
    </div>
  );

  return (
    <div style={{ padding:'16px', paddingBottom:'80px', maxWidth:'500px', margin:'0 auto' }}>
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:800, color:'var(--text)' }}>Pelatihan Saya</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px' }}>Progress materi yang sudah didapatkan</p>
      </div>

      {/* Overall progress */}
      <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1))', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'20px', padding:'20px', marginBottom:'16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
          <div>
            <p style={{ fontSize:'13px', color:'var(--text3)' }}>Total Progress</p>
            <p style={{ fontSize:'28px', fontWeight:800, color:'var(--text)', lineHeight:1.1 }}>{data.persen}%</p>
            <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'2px' }}>{data.selesai} dari {data.total} materi</p>
          </div>
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:`3px solid ${data.persen===100?'#10b981':'rgba(124,58,237,0.4)'}` }}>
            <span style={{ fontSize:'20px', fontWeight:800, color: data.persen===100?'#10b981':'var(--purple-light)' }}>{data.persen}</span>
            <span style={{ fontSize:'10px', color:'var(--text3)' }}>%</span>
          </div>
        </div>
        <div style={{ height:'8px', background:'rgba(255,255,255,0.08)', borderRadius:'99px', overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:'99px', width:`${data.persen}%`, background: data.persen===100?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#7c3aed,#4f46e5)', transition:'width 0.8s' }}/>
        </div>
      </div>

      {/* Info */}
      <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'12px', padding:'12px 14px', fontSize:'12px', color:'#3b82f6', marginBottom:'16px' }}>
        ℹ️ Materi diceklis oleh Divisi Training Center setelah sesi selesai.
      </div>

      {/* Progress per kategori — tampil hanya jika ada data checklist baru */}
      {data.by_kategori?.length > 0 && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
            {data.by_kategori.map((k: any) => (
              <div key={k.kategori} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', padding:'14px' }}>
                <p style={{ fontSize:'13px', marginBottom:'2px' }}>{kat_emoji[k.kategori]||'📖'} <strong style={{ color:kat_color[k.kategori]||'var(--text)' }}>{k.kategori}</strong></p>
                <p style={{ fontSize:'20px', fontWeight:800, color:'var(--text)' }}>{k.persen}%</p>
                <p style={{ fontSize:'11px', color:'var(--text3)' }}>{k.selesai}/{k.total} materi</p>{k.rating_rata > 0 && (<p style={{ fontSize:'11px', color:'#fbbf24', fontWeight:700, marginTop:'2px' }}>&#9733; {Number(k.rating_rata).toFixed(1)}/5.0</p>)}
                <div style={{ height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'99px', marginTop:'8px' }}>
                  <div style={{ height:'100%', borderRadius:'99px', width:`${k.persen}%`, background:kat_color[k.kategori]||'#7c3aed' }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Detail per kategori */}
          {data.by_kategori.map((k: any) => (
            <div key={k.kategori} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', overflow:'hidden', marginBottom:'12px' }}>
              <button onClick={() => setOpenKat(prev => prev.includes(k.kategori)?prev.filter((x:string)=>x!==k.kategori):[...prev,k.kategori])}
                style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'transparent', border:'none', cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ fontSize:'14px' }}>{kat_emoji[k.kategori]||'📖'}</span>
                  <span style={{ fontSize:'13px', fontWeight:700, color:kat_color[k.kategori]||'var(--text)' }}>Materi {k.kategori}</span>
                  <span style={{ fontSize:'11px', color:'var(--text3)', background:'var(--bg)', padding:'2px 8px', borderRadius:'99px' }}>{k.selesai}/{k.total}</span>
                </div>
                {openKat.includes(k.kategori) ? <ChevronDown size={16} style={{ color:'var(--text3)' }}/> : <ChevronRight size={16} style={{ color:'var(--text3)' }}/>}
              </button>
              {openKat.includes(k.kategori) && (
                <div style={{ borderTop:'1px solid var(--border)' }}>
                  {k.materi?.map((m: any) => {
                    const indent = m.parent_kode ? 16 : 0;
                    return (
                      <div key={m.id} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px 16px', paddingLeft:`${16+indent}px`, borderBottom:'1px solid rgba(255,255,255,0.04)', background: m.checked?'rgba(16,185,129,0.04)':'transparent' }}>
                        {m.checked
                          ? <CheckCircle2 size={16} style={{ color:'#10b981', flexShrink:0, marginTop:'2px' }}/>
                          : <Circle size={16} style={{ color:'var(--text3)', flexShrink:0, marginTop:'2px', opacity:0.4 }}/>}
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:'12px', color: m.checked?'var(--text)':'var(--text3)', lineHeight:'1.4' }}>
                            <span style={{ color:'var(--text3)', fontSize:'10px', marginRight:'4px' }}>{m.kode}</span>{m.nama}
                          </p>
                          {m.checked && (
                            <p style={{ fontSize:'10px', color:'#10b981', marginTop:'2px' }}>
                              ✓ {m.tanggal_dapat ? new Date(m.tanggal_dapat).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : '-'}
                              {m.pengajar && <span style={{ color:'var(--text3)' }}> · {m.pengajar}</span>}
                            </p>
                          )}
                          {m.checked && m.rating > 0 && (
                            <p style={{ fontSize:'11px', color:'#fbbf24', marginTop:'2px', fontWeight:700 }}>
                              {Array.from({length:5}).map((_,i)=>i<Math.round(Number(m.rating))?'★':'☆').join('')} {Number(m.rating).toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Fallback: tampilan lama kalau belum ada data checklist sistem baru */}
      {(!data.by_kategori?.length) && data.legacy?.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {data.legacy.map((m: any) => (
            <div key={m.id} style={{ background:'var(--glass)', border:`1px solid ${m.status==='completed'?'rgba(16,185,129,0.3)':'var(--border)'}`, borderRadius:'14px', padding:'14px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                {m.status==='completed'
                  ? <CheckCircle2 size={18} style={{ color:'#10b981' }}/>
                  : <BookOpen size={18} style={{ color:'var(--text3)' }}/>}
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:'14px', color:'var(--text)' }}>{m.judul||m.nama}</p>
                  {m.completed_at && <p style={{ fontSize:'11px', color:'#10b981', marginTop:'4px' }}>✓ {new Date(m.completed_at).toLocaleDateString('id-ID')}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
