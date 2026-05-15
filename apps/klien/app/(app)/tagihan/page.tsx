'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Calendar, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function TagihanPage() {
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/klien/tagihan')
      .then((res: any) => {
        const data = res.data?.data;
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []; setTagihan(items);
        setLoading(false);
      })
      .catch(() => { setTagihan([]); setLoading(false); });
  }, []);

  const totalUnpaid = tagihan.filter(t => t.status !== 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);
  const totalPaid = tagihan.filter(t => t.status === 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);

  const statusConfig: any = {
    paid: { label:'Lunas', color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)', icon: CheckCircle },
    overdue: { label:'Jatuh Tempo', color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)', icon: AlertCircle },
    pending: { label:'Menunggu', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', icon: Clock },
  };

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Tagihan</h1>
        <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{tagihan.length} tagihan total</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div style={{ background:'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius:'20px', padding:'18px', boxShadow:'0 8px 24px rgba(239,68,68,0.35)' }}>
          <p className="text-red-200 text-xs font-medium mb-2">Belum Dibayar</p>
          <p className="text-white font-bold text-base">Rp {totalUnpaid.toLocaleString('id')}</p>
        </div>
        <div style={{ background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'20px', padding:'18px', boxShadow:'0 8px 24px rgba(16,185,129,0.35)' }}>
          <p className="text-green-100 text-xs font-medium mb-2">Sudah Dibayar</p>
          <p className="text-white font-bold text-base">Rp {totalPaid.toLocaleString('id')}</p>
        </div>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden' }}>
        <div className="p-5 pb-3">
          <h2 className="font-bold" style={{ color:'var(--text-primary)' }}>Semua Tagihan</h2>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{[1,2].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'16px', height:'100px' }} />)}</div>
        ) : tagihan.length > 0 ? (
          <div className="px-4 pb-4 space-y-3">
            {tagihan.map((invoice) => {
              const cfg = statusConfig[invoice.status] || statusConfig.pending;
              return (
                <div key={invoice.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'16px', padding:'16px' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:cfg.bg, border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <FileText size={19} style={{ color:cfg.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>Invoice #{invoice.id}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color:'var(--text-muted)' }}>
                          <Calendar size={11} />
                          <span>Jatuh Tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-base" style={{ color:'var(--green)' }}>
                      <DollarSign size={17} />Rp {invoice.total?.toLocaleString('id-ID') || 0}
                    </div>
                    {invoice.status !== 'paid' && (
                      <button onClick={() => alert('Payment integration coming soon')} style={{ padding:'8px 18px', background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'10px', border:'none', color:'white', fontSize:'12px', fontWeight:600, cursor:'pointer', boxShadow:'0 3px 10px rgba(16,185,129,0.4)' }}>Bayar</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <FileText size={40} className="mx-auto mb-3" style={{ color:'var(--text-muted)', opacity:0.3 }} />
            <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Belum ada tagihan</p>
          </div>
        )}
      </div>
    </div>
  );
}
