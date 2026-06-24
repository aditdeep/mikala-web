'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await authService.login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', position:'relative', overflow:'hidden', background:'linear-gradient(135deg, #0a1a12 0%, #0f2a1e 50%, #0a1a1a 100%)' }}>
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'5%', left:'-10%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ width:'100%', maxWidth:'400px', position:'relative', zIndex:1 }}>
        <div className="text-center mb-8">
          <div style={{ width:'72px', height:'72px', borderRadius:'22px', margin:'0 auto 16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(16,185,129,0.5)' }}>
            <span style={{ color:'white', fontSize:'28px', fontWeight:800 }}>M</span>
          </div>
          <h1 style={{ color:'white', fontSize:'26px', fontWeight:800 }}>Mikala Klien</h1>
          <p style={{ color:'rgba(110,231,183,0.8)', fontSize:'14px', marginTop:'6px' }}>Masuk ke akun Anda</p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'28px', padding:'32px', boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', color:'#f87171', fontSize:'14px' }}>{error}</div>}
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ color:'rgba(110,231,183,0.8)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(110,231,183,0.6)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required style={{ width:'100%', padding:'13px 14px 13px 42px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'white', fontSize:'14px', outline:'none' }} />
              </div>
            </div>
            <div>
              <label style={{ color:'rgba(110,231,183,0.8)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(110,231,183,0.6)' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ width:'100%', padding:'13px 42px 13px 42px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'white', fontSize:'14px', outline:'none' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(110,231,183,0.6)' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign:"right", marginTop:"4px" }}>
              <a href="/auth/forgot-password" style={{ color:"rgba(16,185,129,0.7)", fontSize:"12px", textDecoration:"none" }}>Lupa password?</a>
            </div>
            <button type="submit" disabled={loading} style={{ marginTop:'8px', padding:'15px', background: loading ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'14px', color:'white', fontSize:'15px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow:'0 4px 20px rgba(16,185,129,0.4)' }}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
        <p style={{ color:'rgba(110,231,183,0.5)', fontSize:'12px', textAlign:'center', marginTop:'24px' }}>© 2026 Mikala Global Medika</p>
      </div>
    </div>
  );
}
