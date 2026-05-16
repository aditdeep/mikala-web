'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Calendar, Wallet, Clock } from 'lucide-react';

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/mitra/payroll')
      .then((res: any) => {
        const d = res.data?.data;
        setPayroll(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalDiterima = payroll.filter(p => p.status === 'paid').reduce((a, b) => a + Number(b.total||0), 0);
  const totalPending  = payroll.filter(p => p.status !== 'paid').reduce((a, b) => a + Number(b.total||0), 0);

  const statusCfg: any = {
    paid:      { label:'Dibayar',  color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
    pending:   { label:'Pending',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)' },
    cancelled: { label:'Dibatal',  color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)' },
  };

  return (
    <div className="p-4 pt-6 space-y-4" style={{ paddingBottom:'80px' }}>
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Payroll</h1>
        <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>Riwayat pembayaran Anda</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div style={{ background:'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius:'20px', padding:'18px', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px' }}>
            <Wallet size={18} color="white" />
          </div>
          <p className="text-purple-200 text-xs font-medium">Total Diterima</p>
          <p className="text-white font-bold text-lg mt-1">Rp {totalDiterima.toLocaleString('id')}</p>
        </div>
        <div style={{ background:'linear-gradient(135deg, #ec4899, #8b5cf6)', borderRadius:'20px', padding:'18px', boxShadow:'0 8px 24px rgba(236,72,153,0.4)' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px' }}>
            <Clock size={18} color="white" />
          </div>
          <p className="text-pink-200 text-xs font-medium">Menunggu</p>
          <p className="text-white font-bold text-lg mt-1">Rp {totalPending.toLocaleString('id')}</p>
        </div>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden' }}>
        <div className="p-5 pb-3">
          <h2 className="font-bold" style={{ color:'var(--text-primary)' }}>Riwayat Pembayaran</h2>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{[1,2].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'16px', height:'80px' }} />)}</div>
        ) : payroll.length > 0 ? (
          <div className="px-4 pb-4 space-y-3">
            {payroll.map((item: any) => {
              const cfg = statusCfg[item.status] || statusCfg.pending;
              return (
                <div key={item.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'16px', padding:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                    <div>
                      <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>{item.payroll_number||'#'+item.id}</p>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px', color:'var(--text-muted)', fontSize:'12px' }}>
                        <Calendar size={11}/>
                        <span>{item.periode_mulai ? new Date(item.periode_mulai).toLocaleDateString('id-ID',{month:'long',year:'numeric'}) : '-'}</span>
                      </div>
                    </div>
                    <span style={{ background:cfg.bg, color:cfg.color, border:'1px solid '+cfg.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{cfg.label}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.jumlah_hari_kerja||0} hari kerja</p>
                      <p style={{ fontWeight:700, fontSize:'18px', color:'#10b981', marginTop:'2px' }}>Rp {Number(item.total||0).toLocaleString('id')}</p>
                    </div>
                    {item.status === 'pending' && (
                      <div style={{ textAlign:'right' }}>
                        <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>Gaji Pokok</p>
                        <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:600 }}>Rp {Number(item.gaji_pokok||0).toLocaleString('id')}</p>
                      </div>
                    )}
                  </div>
                  {item.catatan && (
                    <p style={{ color:'var(--text-muted)', fontSize:'11px', marginTop:'8px', paddingTop:'8px', borderTop:'1px solid var(--border)' }}>{item.catatan}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <DollarSign size={40} className="mx-auto mb-3" style={{ color:'var(--text-muted)', opacity:0.3 }} />
            <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Belum ada riwayat</p>
            <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Pembayaran Anda akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}
