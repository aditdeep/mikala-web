'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { DollarSign, Calendar, FileText, CheckCircle, AlertCircle, Clock, X, CreditCard, Building2, ExternalLink, Copy, Check } from 'lucide-react';

export default function TagihanPage() {
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<''|'manual'|'xendit'>('');
  const [copied, setCopied] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [paySettings, setPaySettings] = useState<any>({
    bank_name: 'BCA',
    bank_account: '-',
    bank_account_name: 'PT Mikala Global Medika',
    xendit_enabled: false,
  });

  useEffect(() => {
    apiClient.get('/klien/tagihan')
      .then((res: any) => {
        const data = res.data?.data;
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setTagihan(items);
        setLoading(false);
      })
      .catch(() => { setTagihan([]); setLoading(false); });

    // Ambil setting rekening & xendit
    apiClient.get('/payment-settings')
      .then((res: any) => { if (res.data?.data) setPaySettings(res.data.data); })
      .catch(() => {});
  }, []);

  const fetchTagihan = () => {
    apiClient.get('/klien/tagihan').then((res: any) => {
      const data = res.data?.data;
      setTagihan(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    }).catch(() => {});
  };

  const totalUnpaid = tagihan.filter(t => t.status !== 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);
  const totalPaid   = tagihan.filter(t => t.status === 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);

  const statusConfig: any = {
    paid:    { label:'Lunas',        color:'#10b981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)',  icon: CheckCircle },
    overdue: { label:'Jatuh Tempo',  color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)',   icon: AlertCircle },
    unpaid:  { label:'Belum Bayar',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)',  icon: Clock },
    partial: { label:'Sebagian',     color:'#3b82f6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  icon: Clock },
    pending: { label:'Menunggu',     color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)',  icon: Clock },
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleXenditPay = async () => {
    if (!selectedInvoice) return;
    setPaying(true);
    try {
      const res: any = await apiClient.post('/klien/tagihan/'+selectedInvoice.id+'/bayar', { method: 'xendit' });
      const invoiceUrl = res.data?.data?.invoice_url;
      if (invoiceUrl) window.open(invoiceUrl, '_blank');
      else alert('Link pembayaran tidak tersedia, hubungi admin.');
    } catch { alert('Gagal membuat link pembayaran. Coba lagi atau hubungi admin.'); }
    finally { setPaying(false); }
  };

  const handleManualConfirm = async () => {
    if (!selectedInvoice) return;
    setPaying(true);
    try {
      await apiClient.post('/klien/tagihan/'+selectedInvoice.id+'/bayar', { method: 'manual' });
      setPaySuccess(true);
      setTimeout(() => {
        setPaySuccess(false); setSelectedInvoice(null); setPaymentMethod('');
        fetchTagihan();
      }, 2500);
    } catch { alert('Gagal konfirmasi. Coba lagi.'); }
    finally { setPaying(false); }
  };

  const closeModal = () => { setSelectedInvoice(null); setPaymentMethod(''); setPaySuccess(false); };

  return (
    <div className="p-4 pt-6 space-y-4" style={{ paddingBottom:'80px' }}>
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
        <div className="p-5 pb-3"><h2 className="font-bold" style={{ color:'var(--text-primary)' }}>Semua Tagihan</h2></div>
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
                      <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:cfg.bg, border:'1px solid '+cfg.border, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <FileText size={19} style={{ color:cfg.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>Invoice #{invoice.id}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color:'var(--text-muted)' }}>
                          <Calendar size={11} />
                          <span>Jatuh Tempo: {invoice.due_date || invoice.tanggal_jatuh_tempo ? new Date(invoice.due_date || invoice.tanggal_jatuh_tempo).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ background:cfg.bg, color:cfg.color, border:'1px solid '+cfg.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-base" style={{ color:'var(--green)' }}>
                      <DollarSign size={17} />Rp {Number(invoice.total)?.toLocaleString('id-ID') || 0}
                    </div>
                    {invoice.status !== 'paid' && (
                      <button onClick={() => { setSelectedInvoice(invoice); setPaymentMethod(''); }}
                        style={{ padding:'8px 18px', background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'10px', border:'none', color:'white', fontSize:'12px', fontWeight:600, cursor:'pointer', boxShadow:'0 3px 10px rgba(16,185,129,0.4)' }}>
                        Bayar
                      </button>
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

      {/* Payment Modal */}
      {selectedInvoice && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:'var(--card)', borderRadius:'24px 24px 0 0', padding:'24px', width:'100%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto' }}>
            {paySuccess ? (
              <div style={{ textAlign:'center', padding:'24px 0' }}>
                <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <CheckCircle size={32} style={{ color:'#10b981' }} />
                </div>
                <h3 style={{ fontWeight:700, fontSize:'18px', color:'var(--text)', marginBottom:'8px' }}>Konfirmasi Terkirim!</h3>
                <p style={{ color:'var(--text2)', fontSize:'13px' }}>Tim kami akan memverifikasi pembayaran Anda segera.</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                  <h3 style={{ fontWeight:700, fontSize:'18px', color:'var(--text)' }}>Pilih Metode Bayar</h3>
                  <button onClick={closeModal} style={{ width:'32px', height:'32px', borderRadius:'10px', background:'var(--glass)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'14px', padding:'14px', marginBottom:'20px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>Total Tagihan</p>
                  <p style={{ fontWeight:700, fontSize:'22px', color:'#10b981' }}>Rp {Number(selectedInvoice.total)?.toLocaleString('id-ID')}</p>
                  <p style={{ color:'var(--text3)', fontSize:'11px', marginTop:'2px' }}>Invoice #{selectedInvoice.id}</p>
                </div>

                {paymentMethod === '' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {paySettings.xendit_enabled && (
                      <button onClick={() => setPaymentMethod('xendit')}
                        style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px', background:'var(--glass)', border:'2px solid var(--border)', borderRadius:'16px', cursor:'pointer', textAlign:'left', width:'100%' }}>
                        <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg, #4f46e5, #7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <CreditCard size={22} color="white" />
                        </div>
                        <div>
                          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Payment Gateway</p>
                          <p style={{ color:'var(--text3)', fontSize:'12px', marginTop:'2px' }}>Kartu kredit, VA, QRIS, e-wallet</p>
                        </div>
                      </button>
                    )}
                    <button onClick={() => setPaymentMethod('manual')}
                      style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px', background:'var(--glass)', border:'2px solid var(--border)', borderRadius:'16px', cursor:'pointer', textAlign:'left', width:'100%' }}>
                      <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg, #0ea5e9, #0284c7)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Building2 size={22} color="white" />
                      </div>
                      <div>
                        <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Transfer Manual</p>
                        <p style={{ color:'var(--text3)', fontSize:'12px', marginTop:'2px' }}>Transfer ke rekening perusahaan</p>
                      </div>
                    </button>
                  </div>
                )}

                {paymentMethod === 'xendit' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                    <button onClick={() => setPaymentMethod('')} style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:'var(--text2)', fontSize:'13px', cursor:'pointer', padding:0 }}>← Kembali</button>
                    <div style={{ background:'rgba(79,70,229,0.08)', border:'1px solid rgba(79,70,229,0.2)', borderRadius:'14px', padding:'16px' }}>
                      <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)', marginBottom:'6px' }}>Pembayaran via Xendit</p>
                      <p style={{ color:'var(--text3)', fontSize:'12px', lineHeight:'1.6' }}>Anda akan diarahkan ke halaman pembayaran Xendit. Tersedia: Kartu Kredit, Virtual Account, QRIS, GoPay, OVO, Dana.</p>
                    </div>
                    <button onClick={handleXenditPay} disabled={paying}
                      style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #4f46e5, #7c3aed)', border:'none', borderRadius:'14px', color:'white', fontWeight:700, fontSize:'14px', cursor: paying?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: paying?0.7:1 }}>
                      <ExternalLink size={16} />{paying ? 'Membuat link...' : 'Bayar Sekarang'}
                    </button>
                  </div>
                )}

                {paymentMethod === 'manual' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                    <button onClick={() => setPaymentMethod('')} style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:'var(--text2)', fontSize:'13px', cursor:'pointer', padding:0 }}>← Kembali</button>
                    <div style={{ background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:'14px', padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
                      <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>Rekening Tujuan</p>
                      {[
                        { label:'Bank', value: paySettings.bank_name },
                        { label:'Nomor Rekening', value: paySettings.bank_account, copyable: true },
                        { label:'Atas Nama', value: paySettings.bank_account_name },
                        { label:'Jumlah Transfer', value: 'Rp '+Number(selectedInvoice.total)?.toLocaleString('id-ID'), copyable: true },
                      ].map(item => (
                        <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div>
                            <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                            <p style={{ color:'var(--text)', fontSize:'14px', fontWeight:600 }}>{item.value}</p>
                          </div>
                          {item.copyable && (
                            <button onClick={() => copyToClipboard(item.value)}
                              style={{ padding:'6px 10px', background:'rgba(14,165,233,0.15)', border:'1px solid rgba(14,165,233,0.3)', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', color:'#0ea5e9', fontSize:'11px', fontWeight:600 }}>
                              {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Disalin' : 'Salin'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p style={{ color:'var(--text3)', fontSize:'12px', textAlign:'center' }}>Setelah transfer, klik tombol di bawah untuk konfirmasi</p>
                    <button onClick={handleManualConfirm} disabled={paying}
                      style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #0ea5e9, #0284c7)', border:'none', borderRadius:'14px', color:'white', fontWeight:700, fontSize:'14px', cursor: paying?'not-allowed':'pointer', opacity: paying?0.7:1 }}>
                      {paying ? 'Mengkonfirmasi...' : 'Saya Sudah Transfer'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// Sat May 16 11:45:54 WIB 2026
