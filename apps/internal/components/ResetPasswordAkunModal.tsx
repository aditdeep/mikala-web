'use client';
// Modal Reset Password akun Mitra/Klien oleh admin -- tindak lanjut dari "Lupa Password" di app
// mitra/klien yang ngarahin user chat WA ke admin. Bisa dibuka langsung utk 1 akun (`target`),
// atau tanpa target -> cari dulu akunnya by nama/email/no HP/NIM.
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { KeyRound, Search, X, Copy, Check, AlertTriangle } from 'lucide-react';

type Akun = { id: number; name: string; email: string; phone?: string; role: string; status?: string; mitra?: any; klien?: any };

export default function ResetPasswordAkunModal({ role, target, onClose }: {
  role: 'mitra' | 'klien';
  target?: Akun | null;
  onClose: () => void;
}) {
  const label = role === 'klien' ? 'Klien' : 'Mitra';
  const [akun, setAkun] = useState<Akun | null>(target || null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Akun[]>([]);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [manualPw, setManualPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (akun) return;
    const t = setTimeout(() => {
      setSearching(true);
      apiClient.get('/internal/akun/search', { params: { role, q } })
        .then((r: any) => setResults(Array.isArray(r.data?.data) ? r.data.data : []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [q, akun, role]);

  const submit = async () => {
    if (!akun) return;
    if (mode === 'manual' && manualPw.length < 8) { setError('Password minimal 8 karakter'); return; }
    setSaving(true); setError('');
    try {
      const r: any = await apiClient.post(`/internal/akun/${akun.id}/reset-password`, mode === 'manual' ? { password: manualPw } : {});
      setResult(r.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Gagal reset password');
    } finally { setSaving(false); }
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard?.writeText(`Email: ${result.email}\nPassword baru: ${result.new_password}`);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const nama = (a: Akun) => a.mitra?.nama_lengkap || a.klien?.nama_lengkap || a.name;
  const inp: React.CSSProperties = { width:'100%', padding:'10px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none', boxSizing:'border-box' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:120, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'20px', width:'100%', maxWidth:'440px', padding:'22px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', display:'flex', alignItems:'center', gap:'8px' }}>
            <KeyRound size={18} style={{ color:'#f59e0b' }} />Reset Password {label}
          </h2>
          <button onClick={onClose} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'6px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Step 1: pilih akun */}
        {!akun && (
          <>
            <div style={{ position:'relative', marginBottom:'10px' }}>
              <Search size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }} />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={`Cari nama / email / no HP${role === 'mitra' ? ' / NIM' : ''}...`}
                style={{ ...inp, paddingLeft:'34px' }} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', maxHeight:'320px', overflowY:'auto' }}>
              {searching && <p style={{ fontSize:'12px', color:'var(--text3)', padding:'8px' }}>Mencari...</p>}
              {!searching && results.length === 0 && <p style={{ fontSize:'12px', color:'var(--text3)', padding:'8px' }}>Akun {label.toLowerCase()} tidak ditemukan</p>}
              {!searching && results.map(a => (
                <button key={a.id} onClick={() => setAkun(a)}
                  style={{ textAlign:'left', padding:'10px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', cursor:'pointer' }}>
                  <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>
                    {nama(a)}{a.mitra?.nomor_induk ? <span style={{ color:'var(--text3)', fontWeight:400 }}> · {a.mitra.nomor_induk}</span> : null}
                  </p>
                  <p style={{ fontSize:'11px', color:'var(--text3)' }}>{a.email} · {a.phone || '-'}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: set password */}
        {akun && !result && (
          <>
            <div style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', padding:'12px', marginBottom:'14px' }}>
              <p style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{nama(akun)}</p>
              <p style={{ fontSize:'12px', color:'var(--text3)' }}>{akun.email} · {akun.phone || '-'}</p>
              {!target && (
                <button onClick={() => { setAkun(null); setError(''); }} style={{ marginTop:'6px', background:'none', border:'none', padding:0, color:'#3b82f6', fontSize:'12px', cursor:'pointer' }}>
                  Ganti akun
                </button>
              )}
            </div>

            <div style={{ display:'flex', gap:'6px', marginBottom:'12px' }}>
              {([['auto','Generate otomatis'],['manual','Ketik manual']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setMode(v)}
                  style={{ flex:1, padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer',
                    border: `1px solid ${mode === v ? 'rgba(245,158,11,0.5)' : 'var(--border)'}`,
                    background: mode === v ? 'rgba(245,158,11,0.12)' : 'transparent',
                    color: mode === v ? '#d97706' : 'var(--text2)' }}>
                  {l}
                </button>
              ))}
            </div>
            {mode === 'manual' && (
              <input value={manualPw} onChange={e => setManualPw(e.target.value)} placeholder="Password baru (min. 8 karakter)" style={{ ...inp, marginBottom:'12px' }} />
            )}
            <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'12px', lineHeight:1.5 }}>
              Password lama langsung tidak berlaku dan {label.toLowerCase()} otomatis ter-logout dari semua perangkat.
            </p>
            {error && <p style={{ fontSize:'12px', color:'#ef4444', marginBottom:'10px' }}>{error}</p>}
            <button onClick={submit} disabled={saving}
              style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg,#f59e0b,#d97706)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Memproses...' : 'Reset Password'}
            </button>
          </>
        )}

        {/* Step 3: hasil */}
        {result && (
          <>
            <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px', padding:'14px', marginBottom:'12px' }}>
              <p style={{ fontSize:'13px', fontWeight:700, color:'#10b981', marginBottom:'8px' }}>✓ Password berhasil direset</p>
              <p style={{ fontSize:'12px', color:'var(--text2)' }}>Email: <b style={{ color:'var(--text)' }}>{result.email}</b></p>
              <p style={{ fontSize:'12px', color:'var(--text2)' }}>Password baru: <b style={{ color:'var(--text)', fontFamily:'monospace', fontSize:'14px' }}>{result.new_password}</b></p>
            </div>
            {result.warning && (
              <div style={{ display:'flex', gap:'8px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'12px', padding:'10px 12px', marginBottom:'12px' }}>
                <AlertTriangle size={15} style={{ color:'#d97706', flexShrink:0, marginTop:'1px' }} />
                <p style={{ fontSize:'12px', color:'var(--text2)' }}>{result.warning}</p>
              </div>
            )}
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={copyText}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontWeight:600, fontSize:'12px', cursor:'pointer' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Tersalin' : 'Salin'}
              </button>
              {result.wa_url && (
                <a href={result.wa_url} target="_blank" rel="noopener noreferrer"
                  style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'10px', background:'#25d366', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'12px', textDecoration:'none' }}>
                  💬 Kirim ke {label} via WA
                </a>
              )}
            </div>
            <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'10px' }}>Password hanya ditampilkan sekali ini. Salin / kirim sebelum menutup.</p>
          </>
        )}
      </div>
    </div>
  );
}
