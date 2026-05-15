'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, authService } from '@mikala/lib';
import { User, Phone, Mail, MapPin, LogOut, Edit2, Save, X, Home, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const u = authService.getUser();
    setUser(u);
    apiClient.get('/klien/profile')
      .then((r: any) => {
        const data = r.data?.data;
        setProfile(data);
        const klien = data?.klien || data;
        setForm({
          phone: u?.phone || '',
          alamat: klien?.alamat || '',
          kota: klien?.kota || '',
          provinsi: klien?.provinsi || '',
          phone_secondary: klien?.phone_secondary || '',
          bank_name: klien?.bank_name || '',
          bank_account: klien?.bank_account || '',
          bank_account_name: klien?.bank_account_name || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.patch('/klien/profile', form);
      // Refresh data
      const r: any = await apiClient.get('/klien/profile');
      setProfile(r.data?.data);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  const klien = profile?.klien || profile;
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'K';
  const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div style={{ padding:'16px', paddingBottom:'80px' }} className="space-y-4">
      <div style={{ paddingTop:'8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>Profil</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'12px', color:'#10b981', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            <Edit2 size={14} />Edit
          </button>
        ) : (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setEditing(false)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontSize:'13px', cursor:'pointer' }}>
              <X size={14} />Batal
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
              <Save size={14} />{saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'10px 14px', color:'#ef4444', fontSize:'13px' }}>
          {error}
        </div>
      )}

      {/* Avatar Card */}
      <div style={{ background:'linear-gradient(135deg, #10b981, #059669, #0d9488)', borderRadius:'20px', padding:'24px', textAlign:'center', boxShadow:'0 8px 24px rgba(16,185,129,0.4)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ width:'72px', height:'72px', borderRadius:'20px', margin:'0 auto 12px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:700, color:'white', border:'2px solid rgba(255,255,255,0.4)' }}>{initials}</div>
        <h2 style={{ color:'white', fontWeight:700, fontSize:'18px' }}>{user?.name}</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'12px', marginTop:'4px' }}>{user?.email}</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'10px', background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'5px 12px' }}>
          <User size={12} color="white" />
          <span style={{ color:'white', fontSize:'11px', fontWeight:500, textTransform:'capitalize' }}>{klien?.tipe || 'individu'}</span>
        </div>
      </div>

      {/* Info Pribadi */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Informasi Pribadi</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {/* Read-only fields */}
          {[
            { icon: User, label:'Nama Lengkap', value: klien?.nama_lengkap || user?.name },
            { icon: Mail, label:'Email', value: user?.email },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'#10b981' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p>
                </div>
              </div>
            );
          })}

          {/* Editable fields */}
          {[
            { key:'phone', icon: Phone, label:'Nomor HP' },
            { key:'phone_secondary', icon: Phone, label:'HP Lainnya' },
            { key:'alamat', icon: MapPin, label:'Alamat' },
            { key:'kota', icon: Home, label:'Kota' },
            { key:'provinsi', icon: MapPin, label:'Provinsi' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'#10b981' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  {editing ? (
                    <input value={form[item.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [item.key]: e.target.value }))} style={inputStyle} />
                  ) : (
                    <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{form[item.key] || '-'}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Pembayaran */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Info Pembayaran</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { key:'bank_name', icon: CreditCard, label:'Nama Bank' },
            { key:'bank_account', icon: CreditCard, label:'No. Rekening' },
            { key:'bank_account_name', icon: User, label:'Nama Rekening' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'#7c3aed' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  {editing ? (
                    <input value={form[item.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [item.key]: e.target.value }))} style={inputStyle} />
                  ) : (
                    <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{form[item.key] || '-'}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
        {[
          { label:'Total Pasien', value: klien?.total_pasien || 0 },
          { label:'Total Order', value: klien?.total_orders || 0 },
          { label:'Total Tagihan', value: `Rp ${(Number(klien?.total_tagihan)||0).toLocaleString('id')}` },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', padding:'14px', textAlign:'center' }}>
            <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>{s.value}</p>
            <p style={{ color:'var(--text3)', fontSize:'10px', marginTop:'2px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ width:'100%', padding:'14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'16px', color:'#ef4444', fontWeight:600, fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
        <LogOut size={16} />Keluar
      </button>
    </div>
  );
}
