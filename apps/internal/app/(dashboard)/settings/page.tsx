'use client';
import { useEffect, useState } from 'react';
import { authService, apiClient } from '@mikala/lib';
import { useTheme } from '@/components/ThemeProvider';
import { User, Bell, Shield, Palette, Moon, Sun, Save, CreditCard, Building2, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const { theme, toggle } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [payment, setPayment] = useState({
    bank_name: '',
    bank_account: '',
    bank_account_name: '',
    xendit_enabled: 'false',
    xendit_secret_key: '',
    xendit_public_key: '',
  });

  useEffect(() => {
    setUser(authService.getUser());
    apiClient.get('/internal/settings')
      .then((r: any) => {
        const d = r.data?.data;
        if (d) setPayment({
          bank_name:          d.bank_name || '',
          bank_account:       d.bank_account || '',
          bank_account_name:  d.bank_account_name || '',
          xendit_enabled:     d.xendit_enabled || 'false',
          xendit_secret_key:  d.xendit_secret_key || '',
          xendit_public_key:  d.xendit_public_key || '',
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/internal/settings', payment);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const set = (k: string, v: string) => setPayment(p => ({...p, [k]: v}));

  const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>Pengaturan</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'2px' }}>Kelola preferensi dan konfigurasi sistem</p>
      </div>

      {/* Theme Toggle */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:'linear-gradient(135deg, #f59e0b, #d97706)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Palette size={20} color="white" />
          </div>
          <div>
            <p style={{ fontWeight:600, color:'var(--text)', fontSize:'14px' }}>Tema Tampilan</p>
            <p style={{ color:'var(--text3)', fontSize:'12px' }}>{theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</p>
          </div>
        </div>
        <button onClick={toggle} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 16px', background: theme === 'dark' ? 'rgba(251,191,36,0.15)' : 'rgba(124,58,237,0.15)', border:'1px solid '+(theme==='dark'?'rgba(251,191,36,0.3)':'rgba(124,58,237,0.3)'), borderRadius:'10px', cursor:'pointer', color: theme==='dark'?'#fbbf24':'var(--purple-light)', fontWeight:600, fontSize:'13px' }}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Terang' : 'Gelap'}
        </button>
      </div>

      {/* Profil */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <User size={17} color="white" />
          </div>
          <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Profil</h2>
        </div>
        <div style={{ padding:'8px 20px 16px' }}>
          {[
            { label:'Nama Lengkap', value: user?.name || '-' },
            { label:'Email', value: user?.email || '-' },
            { label:'Role', value: user?.role || '-' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ padding:'12px 0', borderBottom: i < arr.length-1 ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <label style={{ color:'var(--text2)', fontSize:'13px', fontWeight:500, minWidth:'140px' }}>{item.label}</label>
              <span style={{ color:'var(--text)', fontSize:'13px' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rekening Perusahaan */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #0ea5e9, #0284c7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Building2 size={17} color="white" />
          </div>
          <div>
            <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Rekening Perusahaan</h2>
            <p style={{ color:'var(--text3)', fontSize:'11px' }}>Ditampilkan ke klien saat bayar manual</p>
          </div>
        </div>
        <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { key:'bank_name', label:'Nama Bank', placeholder:'Contoh: BCA, Mandiri, BNI' },
            { key:'bank_account', label:'Nomor Rekening', placeholder:'Nomor rekening perusahaan' },
            { key:'bank_account_name', label:'Atas Nama', placeholder:'Nama pemilik rekening' },
          ].map(item => (
            <div key={item.key}>
              <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>{item.label}</label>
              <input value={payment[item.key as keyof typeof payment]} onChange={e => set(item.key, e.target.value)} style={inputStyle} placeholder={item.placeholder} />
            </div>
          ))}
        </div>
      </div>

      {/* Xendit Config */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #4f46e5, #7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CreditCard size={17} color="white" />
          </div>
          <div>
            <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Payment Gateway (Xendit)</h2>
            <p style={{ color:'var(--text3)', fontSize:'11px' }}>Konfigurasi Xendit untuk pembayaran online</p>
          </div>
        </div>
        <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {/* Toggle Xendit */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 0' }}>
            <div>
              <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>Aktifkan Xendit</p>
              <p style={{ color:'var(--text3)', fontSize:'11px' }}>Tampilkan opsi bayar via Xendit ke klien</p>
            </div>
            <button onClick={() => set('xendit_enabled', payment.xendit_enabled === 'true' ? 'false' : 'true')}
              style={{ width:'48px', height:'26px', borderRadius:'13px', background: payment.xendit_enabled === 'true' ? '#7c3aed' : 'var(--border)', cursor:'pointer', border:'none', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
              <div style={{ position:'absolute', top:'3px', left: payment.xendit_enabled === 'true' ? '25px' : '3px', width:'20px', height:'20px', borderRadius:'50%', background:'white', transition:'left 0.2s' }}/>
            </button>
          </div>

          {payment.xendit_enabled === 'true' && (
            <>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Public Key</label>
                <input value={payment.xendit_public_key} onChange={e => set('xendit_public_key', e.target.value)} style={inputStyle} placeholder="xnd_public_..." />
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Secret Key</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={payment.xendit_secret_key}
                    onChange={e => set('xendit_secret_key', e.target.value)}
                    style={{...inputStyle, paddingRight:'40px'}}
                    placeholder="xnd_development_..."
                  />
                  <button onClick={() => setShowSecret(p => !p)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                    {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px' }}>
                <p style={{ color:'#f59e0b', fontSize:'12px' }}>⚠️ Secret key disimpan terenkripsi dan tidak ditampilkan ulang setelah disimpan.</p>
              </div>
            </>
          )}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 24px', background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'14px', color:'white', fontWeight:600, fontSize:'14px', cursor: saving ? 'not-allowed' : 'pointer', boxShadow:'0 4px 16px rgba(124,58,237,0.4)', opacity: saving ? 0.8 : 1 }}>
        <Save size={16} />{saving ? 'Menyimpan...' : saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}
