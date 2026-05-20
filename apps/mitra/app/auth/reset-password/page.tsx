'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get('token') || '';
  const email        = searchParams.get('email') || '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  // Validasi token saat load
  useEffect(() => {
    if (!token || !email) {
      setError('Link tidak valid. Silakan request reset password ulang.');
      setValidating(false);
      return;
    }
    apiClient.post('/auth/validate-reset-token', { token, email })
      .then(() => setTokenValid(true))
      .catch((err: any) => setError(err.response?.data?.message || 'Token tidak valid atau sudah kadaluarsa'))
      .finally(() => setValidating(false));
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password minimal 8 karakter'); return; }
    if (password !== confirm) { setError('Konfirmasi password tidak cocok'); return; }
    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/reset-password', {
        email, token, password, password_confirmation: confirm,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal reset password');
    } finally { setLoading(false); }
  };

  const bg  = 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)';
  const inp: React.CSSProperties = {
    width:'100%', padding:'13px 42px 13px 14px',
    background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'14px', color:'white', fontSize:'14px',
    outline:'none', boxSizing:'border-box' as const,
  };

  return (
    <div style={{ minHeight:'100vh', background:bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png" alt="Mikala" style={{ height:'36px', marginBottom:'8px' }}/>
          <h1 style={{ color:'white', fontSize:'22px', fontWeight:800 }}>Reset Password</h1>
        </div>

        <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'28px' }}>

          {/* Loading validasi */}
          {validating && (
            <div style={{ textAlign:'center', padding:'20px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'3px solid rgba(124,58,237,0.3)', borderTopColor:'#7c3aed', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}/>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px' }}>Memvalidasi link...</p>
            </div>
          )}

          {/* Token invalid */}
          {!validating && !tokenValid && !success && (
            <div style={{ textAlign:'center' }}>
              <XCircle size={48} style={{ color:'#ef4444', margin:'0 auto 16px', display:'block' }}/>
              <h3 style={{ color:'white', fontSize:'16px', fontWeight:700, marginBottom:'8px' }}>Link Tidak Valid</h3>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', marginBottom:'20px' }}>{error}</p>
              <button onClick={() => router.push('/auth/forgot-password')}
                style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'14px', color:'white', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>
                Request Reset Ulang
              </button>
            </div>
          )}

          {/* Form reset */}
          {!validating && tokenValid && !success && (
            <>
              {error && (
                <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px', color:'#f87171', fontSize:'13px' }}>
                  {error}
                </div>
              )}
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', marginBottom:'16px' }}>
                Reset untuk: <strong style={{ color:'white' }}>{email}</strong>
              </p>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                <div>
                  <label style={{ color:'rgba(167,139,250,0.8)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Password Baru *</label>
                  <div style={{ position:'relative' }}>
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter" required style={inp}/>
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(167,139,250,0.6)', cursor:'pointer', display:'flex' }}>
                      {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ color:'rgba(167,139,250,0.8)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Konfirmasi Password *</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Ulangi password baru" required
                    style={{ ...inp, paddingLeft:'14px' }}/>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div style={{ display:'flex', gap:'4px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex:1, height:'3px', borderRadius:'99px', background: password.length >= i*2 ? (password.length >= 8 ? '#10b981' : '#f59e0b') : 'rgba(255,255,255,0.1)' }}/>
                    ))}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  marginTop:'4px', padding:'14px',
                  background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                  border:'none', borderRadius:'14px', color:'white', fontSize:'14px',
                  fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            </>
          )}

          {/* Sukses */}
          {success && (
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <CheckCircle2 size={32} style={{ color:'#10b981' }}/>
              </div>
              <h3 style={{ color:'white', fontSize:'17px', fontWeight:700, marginBottom:'8px' }}>Password Berhasil Diubah!</h3>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', marginBottom:'20px' }}>
                Silakan login menggunakan password baru Anda.
              </p>
              <button onClick={() => router.push('/auth/login')}
                style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'14px', color:'white', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>
                Login Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'white', fontSize:'14px' }}>Memuat...</div>
      </div>
    }>
      <ResetPasswordForm/>
    </Suspense>
  );
}
