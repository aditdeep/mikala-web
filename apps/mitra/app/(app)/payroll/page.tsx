'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Calendar, TrendingUp, Wallet } from 'lucide-react';

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/mitra/payroll')
      .then((res: any) => { setPayroll(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = payroll.filter(p => p.status === 'paid').reduce((a, b) => a + (b.amount || 0), 0);
  const pending = payroll.filter(p => p.status !== 'paid').reduce((a, b) => a + (b.amount || 0), 0);

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Payroll</h1>
        <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>Riwayat pembayaran Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div style={{
          background:'linear-gradient(135deg, #7c3aed, #4f46e5)',
          borderRadius:'20px', padding:'18px',
          boxShadow:'0 8px 24px rgba(124,58,237,0.4)',
        }}>
          <div style={{
            width:'36px', height:'36px', borderRadius:'10px',
            background:'rgba(255,255,255,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px',
          }}>
            <Wallet size={18} color="white" />
          </div>
          <p className="text-purple-200 text-xs font-medium">Total Diterima</p>
          <p className="text-white font-bold text-lg mt-1">Rp {total.toLocaleString('id')}</p>
        </div>

        <div style={{
          background:'linear-gradient(135deg, #ec4899, #8b5cf6)',
          borderRadius:'20px', padding:'18px',
          boxShadow:'0 8px 24px rgba(236,72,153,0.4)',
        }}>
          <div style={{
            width:'36px', height:'36px', borderRadius:'10px',
            background:'rgba(255,255,255,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px',
          }}>
            <TrendingUp size={18} color="white" />
          </div>
          <p className="text-pink-200 text-xs font-medium">Menunggu</p>
          <p className="text-white font-bold text-lg mt-1">Rp {pending.toLocaleString('id')}</p>
        </div>
      </div>

      {/* List */}
      <div style={{
        background:'var(--glass)', backdropFilter:'blur(20px)',
        border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden',
      }}>
        <div className="p-5 pb-3">
          <h2 className="font-bold" style={{ color:'var(--text-primary)' }}>Riwayat Pembayaran</h2>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'16px', height:'80px' }} />)}
          </div>
        ) : payroll.length > 0 ? (
          <div className="px-4 pb-4 space-y-3">
            {payroll.map((item) => (
              <div key={item.id} style={{
                background:'var(--glass)', border:'1px solid var(--border)',
                borderRadius:'16px', padding:'14px',
                display:'flex', alignItems:'center', gap:'12px',
              }}>
                <div style={{
                  width:'44px', height:'44px', borderRadius:'14px', flexShrink:0,
                  background: item.status === 'paid'
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))'
                    : 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <DollarSign size={20} style={{ color: item.status === 'paid' ? '#10b981' : '#f59e0b' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>
                      Pembayaran #{item.id}
                    </span>
                    <span style={{
                      background: item.status === 'paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: item.status === 'paid' ? '#10b981' : '#f59e0b',
                      border:`1px solid ${item.status === 'paid' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      borderRadius:'6px', padding:'2px 8px', fontSize:'10px', fontWeight:600,
                    }}>
                      {item.status === 'paid' ? 'Dibayar' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color:'var(--text-muted)' }}>
                      <Calendar size={12} />
                      <span>{new Date(item.payment_date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color:'#10b981' }}>
                      Rp {item.amount?.toLocaleString('id-ID') || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div style={{
              width:'70px', height:'70px', borderRadius:'20px', margin:'0 auto 14px',
              background:'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.1))',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Wallet size={30} style={{ color:'var(--purple-light)', opacity:0.5 }} />
            </div>
            <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Belum ada riwayat</p>
            <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Pembayaran Anda akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}
