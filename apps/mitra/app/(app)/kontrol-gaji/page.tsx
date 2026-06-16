'use client';
import { useEffect, useState } from 'react';
import { Wallet, TrendingDown, CreditCard, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@mikala/lib';

export default function KontrolGajiPage() {
  const [kredit, setKredit]   = useState<any>(null);
  const [tab, setTab]         = useState<'kredit'|'kasbon'|'fee'>('kredit');
  const [kasbon, setKasbon]   = useState<any[]>([]);
  const [fee, setFee]         = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/mitra/kredit-pelatihan').then((r: any) => setKredit(r.data?.data)).catch(() => {}),
      apiClient.get('/mitra/kasbon').then((r: any) => setKasbon(r.data?.data || [])).catch(() => {}),
      apiClient.get('/mitra/fee-saya').then((r: any) => setFee(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5 pb-24">
      <div>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Kontrol Gaji</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kredit pelatihan & kasbon Anda</p>
      </div>

      {/* Card Cuti */}
      <Link href="/cuti" style={{ textDecoration:'none' }}>
        <div style={{
          background:'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.08))',
          border:'1px solid rgba(124,58,237,0.3)',
          borderRadius:'14px', padding:'14px',
          display:'flex', alignItems:'center', gap:'12px', cursor:'pointer'
        }}>
          <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'rgba(124,58,237,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Calendar size={20} color="#a78bfa"/>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>Ajukan Cuti</p>
            <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>Lihat quota & history pengajuan cuti</p>
          </div>
          <ChevronRight size={18} color="var(--text3)"/>
        </div>
      </Link>

      {/* Tabs */}
      <div style={{ display:'flex', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', padding:'4px' }}>
        {(['kredit','kasbon','fee'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'8px', borderRadius:'9px', fontSize:'13px', fontWeight:600, cursor:'pointer',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? '#7c3aed' : 'var(--text3)',
            border: 'none', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          }}>
            {t === 'kredit' ? '💳 Kredit' : t === 'kasbon' ? '💰 Kasbon' : '🎁 Fee Referral'}
          </button>
        ))}
      </div>

      {tab === 'kredit' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {!kredit ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)' }}>
              <CreditCard size={48} style={{ margin:'0 auto 12px', opacity:0.2 }} />
              <p style={{ fontWeight:600 }}>Tidak ada kredit pelatihan</p>
              <p style={{ fontSize:'12px' }}>Kamu memilih metode pembayaran Cash</p>
            </div>
          ) : (
            <>
              <div style={{
                borderRadius:'20px', padding:'20px',
                background: kredit.status === 'lunas'
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : 'linear-gradient(135deg,#ec4899,#be185d)',
                color:'white',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                  <span style={{ fontSize:'13px', opacity:0.8 }}>Status Kredit</span>
                  <span style={{ fontSize:'12px', fontWeight:600, background:'rgba(255,255,255,0.2)', padding:'3px 10px', borderRadius:'99px' }}>
                    {kredit.status === 'lunas' ? '✅ Lunas' : kredit.status === 'active' ? '⏳ Aktif' : '⏸ Ditangguhkan'}
                  </span>
                </div>
                <p style={{ fontSize:'32px', fontWeight:800 }}>Rp {Number(kredit.sisa_tagihan).toLocaleString('id-ID')}</p>
                <p style={{ fontSize:'12px', opacity:0.7, marginBottom:'12px' }}>Sisa tagihan</p>
                <div style={{ height:'6px', background:'rgba(255,255,255,0.2)', borderRadius:'99px' }}>
                  <div style={{ height:'100%', background:'white', borderRadius:'99px',
                    width:`${Math.min((kredit.total_terbayar/kredit.total_biaya)*100,100)}%` }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', opacity:0.7, marginTop:'6px' }}>
                  <span>Terbayar: Rp {Number(kredit.total_terbayar).toLocaleString('id-ID')}</span>
                  <span>Total: Rp {Number(kredit.total_biaya).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                  <TrendingDown size={15} style={{ color:'#ec4899' }} />
                  <span style={{ fontSize:'12px', color:'var(--text2)' }}>Potongan per Job</span>
                </div>
                <p style={{ fontSize:'22px', fontWeight:800, color:'#ec4899' }}>Rp {Number(kredit.cicilan_per_job).toLocaleString('id-ID')}</p>
                <p style={{ fontSize:'11px', color:'var(--text3)' }}>Dipotong otomatis dari setiap pendapatan job</p>
              </div>

              {kredit.potongan?.length > 0 && (
                <div>
                  <p style={{ fontSize:'12px', fontWeight:600, color:'var(--text2)', marginBottom:'8px' }}>Riwayat Potongan</p>
                  {kredit.potongan.map((p: any) => (
                    <div key={p.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', padding:'12px', marginBottom:'8px', display:'flex', justifyContent:'space-between' }}>
                      <div>
                        <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{p.order?.kode_order ?? `Job #${p.id}`}</p>
                        <p style={{ fontSize:'11px', color:'var(--text3)' }}>{new Date(p.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</p>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <p style={{ fontSize:'13px', fontWeight:700, color:'#ec4899' }}>-Rp {Number(p.jumlah_potongan).toLocaleString('id-ID')}</p>
                        <p style={{ fontSize:'11px', color:'var(--text3)' }}>Sisa: Rp {Number(p.sisa_setelah_potong).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'kasbon' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {kasbon.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)' }}>
              <Wallet size={48} style={{ margin:'0 auto 12px', opacity:0.2 }} />
              <p>Belum ada kasbon</p>
            </div>
          ) : (
            kasbon.map((k: any) => (
              <div key={k.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:'15px', color:'var(--text)' }}>Rp {Number(k.jumlah).toLocaleString('id-ID')}</p>
                  <p style={{ fontSize:'12px', color:'var(--text3)' }}>{k.keterangan}</p>
                  <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>{new Date(k.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
                <span style={{
                  fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'8px',
                  background: k.status==='lunas'?'rgba(16,185,129,0.1)':k.status==='approved'?'rgba(59,130,246,0.1)':k.status==='rejected'?'rgba(239,68,68,0.1)':'rgba(245,158,11,0.1)',
                  color: k.status==='lunas'?'#10b981':k.status==='approved'?'#3b82f6':k.status==='rejected'?'#ef4444':'#f59e0b',
                }}>
                  {k.status==='lunas'?'✅ Lunas':k.status==='approved'?'✓ Disetujui':k.status==='rejected'?'✗ Ditolak':'⏳ Menunggu'}
                </span>
              </div>
            ))
          )}
          <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', fontSize:'12px', color:'#f59e0b', display:'flex', gap:'6px', alignItems:'flex-start' }}>
            <AlertCircle size={14} style={{ marginTop:'1px', flexShrink:0 }} />
            Pengajuan kasbon dilakukan melalui koordinator atau Divisi Finance Mikala.
          </div>
        </div>
      )}

      {tab === 'fee' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {/* Summary */}
          {fee && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <div style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px', textAlign:'center' }}>
                <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'4px' }}>Fee Pending</p>
                <p style={{ fontSize:'18px', fontWeight:800, color:'#f59e0b' }}>Rp {Number(fee.total_pending||0).toLocaleString('id-ID')}</p>
              </div>
              <div style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px', textAlign:'center' }}>
                <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'4px' }}>Fee Diterima</p>
                <p style={{ fontSize:'18px', fontWeight:800, color:'#10b981' }}>Rp {Number(fee.total_paid||0).toLocaleString('id-ID')}</p>
              </div>
            </div>
          )}

          {fee?.fee_referrer?.length > 0 ? (
            <>
              <p style={{ fontSize:'12px', fontWeight:600, color:'var(--text2)' }}>Mitra yang Anda referensikan:</p>
              {fee.fee_referrer.map((f: any) => (
                <div key={f.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:700, color:'var(--purple-light)', overflow:'hidden' }}>
                      {f.mitra?.foto_url ? <img src={f.mitra.foto_url} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : f.mitra?.nama_lengkap?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{f.mitra?.nama_lengkap}</p>
                      <p style={{ fontSize:'11px', color:'var(--text3)' }}>Didaftarkan via referral Anda</p>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:'14px', fontWeight:700, color: f.fee_amount > 0 ? '#10b981' : 'var(--text3)' }}>
                      {f.fee_amount > 0 ? `Rp ${Number(f.fee_amount).toLocaleString('id-ID')}` : 'Fee belum diset'}
                    </p>
                    <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'6px', background: f.fee_status==='paid'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)', color: f.fee_status==='paid'?'#10b981':'#f59e0b' }}>
                      {f.fee_status === 'paid' ? '✓ Dibayar' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text3)' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>🎁</div>
              <p style={{ fontWeight:600 }}>Belum ada referral</p>
              <p style={{ fontSize:'12px', marginTop:'4px' }}>Ajak teman untuk bergabung sebagai mitra Mikala dan dapatkan fee referral!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
